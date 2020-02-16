"use strict";

const { DG } = require("./id");

class Datagram {
  constructor(id, params) {
    if (typeof id !== "number") throw new Error("id");
    if (!Array.isArray(params)) throw new Error("params");

    if (id < 0 || id > DG.COUNT) throw new Error(`id '${id}' is out of bounds`);

    this.id = id;

    this.params = [];
    for (let p of params) {
      if (typeof p !== "string") throw new Error(`param '${p}' string expected`);
      this.params.push(new Param(p));
    }
  }
}

class WhoAmI extends Datagram {
  constructor(params) {
    super(DG.WHO_AM_I, params);
  }

  username() {
    return this.params[0].asString();
  }

  titles() {
    return this.params[1].asStringList();
  }
}

class LoginFailed extends Datagram {
  constructor(params) {
    super(DG.LOGIN_FAILED, params);
  }

  code() {
    return this.params[0].asInt();
  }

  reason() {
    return this.params[1].asString();
  }
}

const datagramFactory = [];
datagramFactory.length = DG.COUNT;
datagramFactory[DG.LOGIN_FAILED] = LoginFailed;
datagramFactory[DG.WHO_AM_I] = WhoAmI;

function createDatagram(id, params) {
  if (typeof id !== "number") throw new Error("id");
  if (!Array.isArray(params)) throw new Error("params");

  const factory = datagramFactory[id];
  if (factory) {
    return new factory(params);
  }

  return new Datagram(id, params);
}

class Param {
  constructor(value) {
    if (typeof value !== "string") throw new Error("value");
    this.value = value;
  }

  asString() {
    return this.value;
  }

  asStringList() {
    return /^\s*$/.test(this.value) ? [] : this.value.split(" ");
  }

  asBool() {
    return this.value === "1";
  }

  asInt() {
    return parseInt(this.value);
  }

  asMsFromMs() {
    return this.asInt();
  }

  asMsFromSeconds() {
    return this.asInt() * 1000;
  }

  asMsFromMinutes() {
    return this.asInt() * 1000 * 60;
  }

  asColor() {
    return this.value === "-1" ? null : this.value === "1" ? "w" : "b";
  }
}

module.exports = {
  Param,
  Datagram,
  LoginFailed,
  WhoAmI,
  createDatagram
};
