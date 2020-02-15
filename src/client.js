"use strict";

const iconv = require("iconv-lite");
const { Parser, DG } = require("./protocol");

const SERVER_ENCODING = "latin1";

class Client {
  constructor(host, port, credentials) {
    if (typeof host !== "string") throw new Error("host");
    if (typeof port !== "number") throw new Error("port");
    if (!(credentials instanceof Object)) throw new Error("credentials");

    this.host = host;
    this.port = port;
    this.credentials = credentials;

    this.enabledDatagrams = [];
    this.enabledDatagrams.length = DG.COUNT;
    this.enabledDatagrams[DG.LOGIN_FAILED] = "1";
    this.enabledDatagrams[DG.SET2] = "1";
    this.enabledDatagrams[DG.WHO_AM_I] = "1";

    this.datagramSubscribers = [];
    this.datagramSubscribers.length = DG.COUNT;
  }

  start(socket) {
    if (!(socket instanceof Object)) throw new Error("socket");

    if (this.socket) {
      this.stop();
    }

    this.protocol = new Parser();
    this.protocol.onLoginPrompt = () => handleLoginPrompt(this);
    this.protocol.onCommand = cmd => handleCommand(this, cmd);
    this.protocol.onDatagram = dg => handleDatagram(this, dg);

    this.socket = socket;
    this.socket.setKeepAlive(true);
    this.socket.setNoDelay(true);
    this.socket.setEncoding(SERVER_ENCODING);
    this.socket.on("data", data => handleSocketData(this, data));
    this.socket.on("error", err => handleSocketError(this, err));
    this.socket.connect({
      host: this.host,
      port: this.port
    });
  }

  stop() {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;

      this.protocol = null;
    }
  }

  subscribeDatagram(dg, cb) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof cb !== "function") throw new Error("cb");

    const subs = this.datagramSubscribers[dg];
    if (subs) {
      subs.push(cb);
    } else {
      this.datagramSubscribers[dg] = [cb];
    }
  }

  enableDatagram(dg) {
    if (typeof data !== "number") throw new Error("dg");
    throw new Error("implement me");
  }

  disableDatagram(dg) {
    if (typeof data !== "number") throw new Error("dg");
    throw new Error("implement me");
  }

  send(cmd, prefix = null) {
    // if (!State.Active)
    //   return;
    // if (prefix == null && State.CurrentState.Authenticated)
    //   prefix = AuthenticatedUserName;

    if (prefix) {
      if (/\d/.test(prefix[0])) {
        throw new Error(`command tag '${prefix}' cannot start with number`);
      }
      cmd = "`" + prefix + "`" + cmd;
    }
    cmd += "\n";
    cmd = iconv.decode(Buffer.from(cmd), SERVER_ENCODING);
    this.socket.write(cmd);
  }
}

function handleSocketData(client, data) {
  if (!(client instanceof Client)) throw new Error("client");
  if (typeof data !== "string") throw new Error("data");

  client.protocol.append(data);
}

function handleSocketError(client, err) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(err instanceof Error)) throw new Error("err");
}

function handleLoginPrompt(client) {
  if (!(client instanceof Client)) throw new Error("client");

  client.send("level1=5");
  client.send("level2settings=" + client.enabledDatagrams.join());
  client.send(client.credentials.formatLoginString());
}

function handleCommand(client, cmd) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(cmd instanceof Object)) throw new Error("cmd");
}

function handleDatagram(client, dg) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(dg instanceof Object)) throw new Error("dg");

  for (let sub of client.datagramSubscribers[dg.id]) {
    sub(dg);
  }
}

module.exports = {
  Client: Client
};
