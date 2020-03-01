"use strict";

const iconv = require("iconv-lite");
const { Parser, DG } = require("./protocol");
const { StateMachine, STATE_CONNECTING, STATE_OFFLINE, STATE_AUTHENTICATING, STATE_LOGGED_IN } = require("./state");
const { EventEmitter } = require("./event");
const { Sessions } = require("./sessions");

const SERVER_ENCODING = "latin1";

class Client {
  constructor() {
    this.sessions = new Sessions();
    this.protocol = new Parser();
    this.state = new StateMachine();

    this.enabledDatagrams = [];
    this.enabledDatagrams.length = DG.COUNT;
    this.enabledDatagrams.fill("0");
    this.enabledDatagrams[DG.SET2] = "1";

    this.datagramEvents = [];
    this.datagramEvents.length = DG.COUNT;

    this.onDatagram(DG.WHO_AM_I, dg => handleWhoAmI(this, dg));
    this.onDatagram(DG.LOGIN_FAILED, dg => handleLoginFailed(this, dg));
  }

  async login(socket, host, port, credentials) {
    if (!(socket instanceof Object)) throw new Error("socket");
    if (typeof host !== "string") throw new Error("host");
    if (typeof port !== "number") throw new Error("port");
    if (!(credentials instanceof Object)) throw new Error("credentials");

    this.socket = socket;
    this.socket.setKeepAlive(true);
    this.socket.setNoDelay(true);
    this.socket.setEncoding(SERVER_ENCODING);
    this.socket.on("data", data => handleSocketData(this, data));
    this.socket.on("error", err => handleSocketError(this, err));

    this.credentials = credentials;

    if (this.state.currentState.active) {
      this.logout();
    }
    this.state.transition(STATE_CONNECTING);

    this.socket.connect({
      host: host,
      port: port
    });

    return new Promise((resolve, reject) => {
      this.loginResolve = resolve;
      this.loginReject = reject;
    });
  }

  logout() {
    this.whoAmI = null;

    this.state.transition(STATE_OFFLINE);
    this.sessions.errorAll(new Error("client logged out"));
    this.protocol.reset();

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

  send(cmd) {
    if (typeof cmd !== "string") throw new Error("cmd");

    if (!this.state.currentState.active) {
      return Promise.resolve();
    }

    let promise;
    if (this.state.currentState.loggedIn) {
      const session = this.sessions.create();
      promise = session.promise;
      cmd = "`" + session.id + "`" + cmd;
    } else {
      promise = Promise.resolve();
    }

    cmd += "\n";
    cmd = iconv.decode(Buffer.from(cmd), SERVER_ENCODING);
    this.socket.write(cmd);

    return promise;
  }

  admin(password) {
    if (typeof password !== "string" || !password) throw new Error("password");
    return this.send("admin " + password);
  }

  date() {
    return this.send("date");
  }

  set2(dg, enable) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof enable !== "boolean") throw new Error("enable");

    return this.send(`set-2 ${dg} ${enable ? "1" : "0"}`);
  }

  vars(player) {
    if (player && typeof player !== "string") throw new Error("player");
    return this.send("vars" + (player ? " " + player : ""));
  }
}

function handleSocketData(client, data) {
  if (!(client instanceof Client)) throw new Error("client");
  if (typeof data !== "string") throw new Error("data");

  const result = client.protocol.append(data);
  if (result.loginPrompt) {
    handleLoginPrompt(client);
  }
  for (let cmd of result.commands) {
    handleCommand(client, cmd);
    for (let dg of cmd.datagrams) {
      handleDatagram(client, dg);
    }
  }
}

function handleSocketError(client, err) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(err instanceof Error)) throw new Error("err");

  client.logout();
  maybeResolveLogin(client, null, err);
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

  if (cmd.meta.tag) {
    client.sessions.success(cmd.meta.tag, cmd);
  }
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

  resolveLogin(client, dg, null);
}

function handleLoginFailed(client, dg) {
  if (!(client instanceof Client)) throw new Error("client");
  if (!(dg instanceof Object)) throw new Error("dg");

  client.logout();
  resolveLogin(client, null, dg);
}

function maybeResolveLogin(client, success, failure) {
  if (client.loginResolve) {
    resolveLogin(client, success, failure);
  }
}

function resolveLogin(client, success, failure) {
  if (!(client instanceof Client)) throw new Error("client");

  if (success || !failure) {
    client.loginResolve(success);
  }
  if (failure) {
    client.loginReject(failure);
  }

  client.loginResolve = null;
  client.loginReject = null;
}

module.exports = {
  Client,
  handleLoginPrompt,
  handleDatagram
};
