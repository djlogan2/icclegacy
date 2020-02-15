"use strict";

const { createCommand, Meta, UNKNOWN_META } = require("./command");
const { Datagram } = require("./datagram");

class Parser {
  constructor() {
    this.expectPrompt = true;
    this.leftover = "";
    this.pendingDatagrams = [];

    this.onLoginPrompt = () => {};
    this.onCommand = _ => {};
    this.onDatagram = _ => {};
  }

  append(data) {
    if (typeof data !== "string") throw new Error("data");
    this.leftover = parse(this, this.leftover + data);
  }
}

const CONTROL_Y = String.fromCharCode(0x19);
const CONTROL_Z = String.fromCharCode(0x1a);
const LOGIN_PROMPT = "login:";

// parses datastructures and returns leftover.
function parse(parser, data) {
  if (!(parser instanceof Parser)) throw new Error("parser");
  if (typeof data !== "string") throw new Error("data");

  const commandStack = [];

  let position = 0;
  let parsedUntil = position;

  while (data.length > 6) {
    if (parser.expectPrompt) {
      const promptIndex = data.indexOf(LOGIN_PROMPT);
      if (promptIndex !== -1) {
        parser.expectPrompt = false;
        position = promptIndex + LOGIN_PROMPT.length;
        parsedUntil = position;
        parser.onLoginPrompt();
      }
    }

    const firstIndex = data.indexOf(CONTROL_Y, position);
    if (firstIndex === -1 || data.length <= firstIndex + 1) {
      break;
    }

    switch (data[firstIndex + 1]) {
      case "[": {
        if (commandStack.length === 0) {
          if (position !== firstIndex && !/^\s*$/.test(data.substr(position, firstIndex - position))) {
            // The command stack is empty and so we are at the root.
            // No text can appear in the root.
            throw new Error(`orphan text at the root '${data.substr(firstIndex)}'`);
          }
        } else {
          // Save the skipped data into the command buffer.
          commandStack[commandStack.length - 1].buffer += data.substr(position, firstIndex - position);
        }
        const metaMatch = /(\d+)(?: (.*?))(?: (.*?))?\r?\n/.exec(data.substr(firstIndex + 2));
        if (metaMatch) {
          position = firstIndex + 2;
          position += metaMatch.length;

          const meta = new Meta(parseInt(metaMatch[1]), metaMatch[2], metaMatch[3]);
          commandStack.push({ meta: meta, buffer: "" });
        }
        break;
      }
      case "]": {
        if (commandStack.length === 0) {
          // It happens when the connection closes.
          position += 2;
          break;
        }
        const cmdData = commandStack.pop();
        cmdData.buffer += data.substr(position, firstIndex - position);
        position = firstIndex + 2;
        parsedUntil = position;

        const cmd = createCommand(cmdData.meta, cmdData.buffer, parser.pendingDatagrams.slice());
        parser.onCommand(cmd);

        for (let dg of parser.pendingDatagrams) {
          parser.onDatagram(dg);
        }
        parser.pendingDatagrams = [];

        break;
      }
      case "(": {
        let cmdData;
        if (commandStack.length === 0) {
          // Some datagrams are sent outside of commands, such as DG_MSEC.
          cmdData = { meta: UNKNOWN_META, buffer: "" };
        } else {
          cmdData = commandStack[commandStack.length - 1];
          cmdData.buffer += data.substr(position, firstIndex - position);
        }

        const endIndex = data.indexOf(CONTROL_Y + ")", firstIndex + 2);
        if (endIndex < firstIndex + 2) {
          break;
        }
        position = firstIndex + 2;

        let dgIdEnd = data.indexOf(" ", position);
        if (dgIdEnd === -1) {
          dgIdEnd = data.indexOf(CONTROL_Y, position);
        }
        const dgId = parseInt(data.substr(position, dgIdEnd - position));
        const params = parseDatagramParams(data, dgIdEnd, endIndex);
        const datagram = new Datagram(cmdData.meta, dgId, params);
        parser.pendingDatagrams.push(datagram);

        position = endIndex + 2;
        break;
      }
      default:
        throw new Error("The incoming stream contains invalid data!");
    }

    if (position <= firstIndex) {
      break;
    }
  }

  parser.pendingDatagrams = [];
  return data.substr(parsedUntil);
}

function parseDatagramParams(data, startIdx, endIdx) {
  if (typeof data !== "string") throw new Error("data");
  if (typeof startIdx !== "number") throw new Error("startIdx");
  if (typeof endIdx !== "number") throw new Error("endIdx");

  const params = [];

  while (startIdx < endIdx) {
    switch (data[startIdx]) {
      case " ":
      case "\r":
      case "\n": {
        startIdx++;
        break;
      }
      case CONTROL_Y: {
        let param = "";
        let paramLen;
        while (data[startIdx] === CONTROL_Y && startIdx < endIdx) {
          if (data[startIdx + 1] !== "{") {
            throw new Error("Malformed start of uber quoted parameter.");
          }
          startIdx += 2;
          paramLen = data.substr(startIdx, endIdx - startIdx).indexOf(CONTROL_Y + "}");
          if (paramLen === -1) {
            // Cannot find the end of the uber quoted parameter.
            throw new Error(`Can't find the end of uber quoted parameter in '${data.substr(startIdx)}'`);
          }
          if (param.length > 0) {
            param += "\n";
          }
          param += data.substr(startIdx, paramLen);
          startIdx += paramLen + 2;
        }
        params.push(param);
        break;
      }
      case "{": {
        startIdx += 1;
        let paramLen = data.substr(startIdx, endIdx - startIdx).indexOf("}");
        if (paramLen === -1) {
          // Cannot find the end of the uber quoted parameter.
          throw new Error(`Can't find the end of uber quoted parameter in '${data.substr(startIdx)}'`);
        }
        params.push(data.substr(startIdx, paramLen));
        startIdx += paramLen + 1;
        break;
      }
      default: {
        let offset = data.substr(startIdx, endIdx - startIdx).indexOf(" ");
        if (offset === -1) {
          offset = endIdx - startIdx;
        }
        params.push(data.substr(startIdx, offset));
        startIdx += offset + 1;
        break;
      }
    }
  }

  return params;
}

module.exports = {
  Parser: Parser
};
