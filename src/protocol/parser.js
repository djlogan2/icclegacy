"use strict";

const { createCommand, Meta } = require("./command");
const { createDatagram } = require("./datagram");

const CONTROL_Y = String.fromCharCode(0x19);
const CONTROL_Z = String.fromCharCode(0x1a);
const LOGIN_PROMPT = "login:";

class Parser {
  constructor() {
    this.expectLoginPrompt = true;
    this.leftover = "";
  }

  reset() {
    this.expectLoginPrompt = true;
    this.leftover = "";
  }

  append(data) {
    if (typeof data !== "string") throw new Error("data");
    data = this.leftover + data;

    const result = {
      loginPrompt: false,
      commands: []
    };

    class CmdData {
      constructor(meta, datagrams = []) {
        this.meta = meta;
        this.content = "";
        this.datagrams = datagrams;
      }
    }
    const cmdStack = [];

    // Some datagrams are sent outside of commands, such as DG_MSEC.
    // They are stored here and prepended to the next command.
    let orphanDatagrams = [];

    let position = 0;
    let parsedUntil = position;

    while (data.length > 6) {
      if (this.expectLoginPrompt) {
        const promptIndex = data.indexOf(LOGIN_PROMPT);
        if (promptIndex !== -1) {
          this.expectLoginPrompt = false;
          result.loginPrompt = true;
          position = promptIndex + LOGIN_PROMPT.length;
          parsedUntil = position;
        }
      }

      const firstIndex = data.indexOf(CONTROL_Y, position);
      if (firstIndex === -1 || data.length <= firstIndex + 1) {
        break;
      }

      switch (data[firstIndex + 1]) {
        case "[": {
          if (cmdStack.length === 0) {
            if (position !== firstIndex && !/^\s*$/.test(data.substr(position, firstIndex - position))) {
              // The command stack is empty and so we are at the root.
              // No text can appear in the root.
              throw new Error(`orphan text at the root '${data.substr(firstIndex)}'`);
            }
          } else {
            // Save the skipped data into the command.
            cmdStack[cmdStack.length - 1].content += data.substr(position, firstIndex - position);
          }
          const metaMatch = /(\d+)(?: (.*?))(?: (.*?))?\r?\n/.exec(data.substr(firstIndex + 2));
          if (metaMatch) {
            position = firstIndex + 2;
            position += metaMatch[0].length;

            const meta = new Meta(parseInt(metaMatch[1]), metaMatch[2], metaMatch[3]);
            cmdStack.push(new CmdData(meta, orphanDatagrams));
            orphanDatagrams = [];
          }
          break;
        }
        case "]": {
          if (cmdStack.length === 0) {
            // It happens when the connection closes.
            position += 2;
            break;
          }
          const cmdData = cmdStack.pop();
          cmdData.content += data.substr(position, firstIndex - position);
          position = firstIndex + 2;
          parsedUntil = position;

          const cmd = createCommand(cmdData.meta, cmdData.content, cmdData.datagrams);
          result.commands.push(cmd);
          break;
        }
        case "(": {
          let cmdData;
          if (cmdStack.length) {
            cmdData = cmdStack[cmdStack.length - 1];
            cmdData.content += data.substr(position, firstIndex - position);
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

          if (cmdData) {
            const dg = createDatagram(dgId, params);
            cmdData.datagrams.push(dg);
          } else {
            // Some datagrams are sent outside of commands, such as DG_MSEC.
            const dg = createDatagram(dgId, params);
            orphanDatagrams.push(dg);
          }

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

    this.leftover = data.substr(parsedUntil);
    return result;
  }
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
        let value = "";
        let valueLen;
        while (data[startIdx] === CONTROL_Y && startIdx < endIdx) {
          if (data[startIdx + 1] !== "{") {
            throw new Error("Malformed start of uber quoted parameter.");
          }
          startIdx += 2;
          valueLen = data.substr(startIdx, endIdx - startIdx).indexOf(CONTROL_Y + "}");
          if (valueLen === -1) {
            // Cannot find the end of the uber quoted parameter.
            throw new Error(`Can't find the end of uber quoted parameter in '${data.substr(startIdx)}'`);
          }
          if (value.length > 0) {
            value += "\n";
          }
          value += data.substr(startIdx, valueLen);
          startIdx += valueLen + 2;
        }
        params.push(value);
        break;
      }
      case "{": {
        startIdx += 1;
        let valueLen = data.substr(startIdx, endIdx - startIdx).indexOf("}");
        if (valueLen === -1) {
          // Cannot find the end of the uber quoted parameter.
          throw new Error(`Can't find the end of uber quoted parameter in '${data.substr(startIdx)}'`);
        }
        params.push(data.substr(startIdx, valueLen));
        startIdx += valueLen + 1;
        break;
      }
      default: {
        let valueLen = data.substr(startIdx, endIdx - startIdx).indexOf(" ");
        if (valueLen === -1) {
          valueLen = endIdx - startIdx;
        }
        params.push(data.substr(startIdx, valueLen));
        startIdx += valueLen + 1;
        break;
      }
    }
  }

  return params;
}

module.exports = { Parser };
