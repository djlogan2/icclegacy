"use strict";

const iconv = require("iconv-lite");
const { Parser, DG } = require("./protocol");
const { StateMachine, STATE_CONNECTING, STATE_OFFLINE, STATE_AUTHENTICATING, STATE_LOGGED_IN } = require("./state");
const { EventEmitter } = require("./event");

const SERVER_ENCODING = "latin1";

class Client {
  constructor(host, port, credentials) {
    if (typeof host !== "string") throw new Error("host");
    if (typeof port !== "number") throw new Error("port");
    if (!(credentials instanceof Object)) throw new Error("credentials");

    this.host = host;
    this.port = port;
    this.credentials = credentials;

    this.state = new StateMachine();

    this.protocol = new Parser();
    this.protocol.onLoginPrompt.on(() => handleLoginPrompt(this));
    this.protocol.onCommand.on(cmd => handleCommand(this, cmd));
    this.protocol.onDatagram.on(dg => handleDatagram(this, dg));

    this.enabledDatagrams = [];
    this.enabledDatagrams.length = DG.COUNT;
    this.enabledDatagrams.fill("0");
    this.enabledDatagrams[DG.SET2] = "1";

    this.datagramEvents = [];
    this.datagramEvents.length = DG.COUNT;

    this.onDatagram(DG.WHO_AM_I, dg => handleWhoAmI(this, dg));
    this.onDatagram(DG.LOGIN_FAILED, dg => handleLoginFailed(this, dg));
  }

  start(socket) {
    if (!(socket instanceof Object)) throw new Error("socket");

    if (this.socket) {
      this.stop();
    }

    this.state.transition(STATE_CONNECTING);

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
    this.whoAmI = null;

    this.protocol.reset();
    this.state.transition(STATE_OFFLINE);

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }

  onDatagram(dg, cb) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof cb !== "function") throw new Error("cb");

    let e = this.datagramEvents[dg];
    if (e) {
      e.on(cb);
    } else {
      e = new EventEmitter();
      e.on(cb);
      this.datagramEvents[dg] = e;
    }

    if (this.enabledDatagrams[dg] !== "1") {
      this.enabledDatagrams[dg] = "1";
      if (this.state.currentState.loggedIn) {
        this.set2(dg, true);
      }
    }
  }

  send(cmd, tag = null) {
    if (typeof cmd !== "string") throw new Error("cmd");

    if (!this.state.currentState.active) {
      return;
    }

    if (tag) {
      if (!/[a-zA-Z]/.test(tag[0])) {
        throw new Error(`command tag '${tag}' must start with letter`);
      }
    } else {
      if (this.state.currentState.loggedIn) {
        tag = this.whoAmI.username();
      }
    }

    cmd = (tag ? "`" + tag + "`" : "") + cmd + "\n";
    cmd = iconv.decode(Buffer.from(cmd), SERVER_ENCODING);
    this.socket.write(cmd);
  }

  set2(dg, enable) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof enable !== "boolean") throw new Error("enable");

    this.send(`set-2 ${dg} ${enable ? "1" : "0"}`);
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

  client.stop();
}

function handleLoginPrompt(client) {
  if (!(client instanceof Client)) throw new Error("client");

  client.state.transition(STATE_AUTHENTICATING);

  client.send("level1=5");
  client.send("level2settings=" + client.enabledDatagrams.join(""));
  client.send(client.credentials.formatLoginString());
}

function handleCommand(client, cmd) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(cmd instanceof Object)) throw new Error("cmd");
}

function handleDatagram(client, dg) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(dg instanceof Object)) throw new Error("dg");

  const e = client.datagramEvents[dg.id];
  if (e) {
    e.emit(dg);
  }
}

function handleWhoAmI(client, dg) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(dg instanceof Object)) throw new Error("dg");

  client.whoAmI = dg;
  client.state.transition(STATE_LOGGED_IN);
}

function handleLoginFailed(client, dg) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(dg instanceof Object)) throw new Error("dg");

  client.stop();
}

module.exports = {
  Client: Client
};
