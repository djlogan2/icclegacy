"use strict";

const { DG } = require("./id");
const { Field } = require("./field");

class Datagram {
  constructor(id, params) {
    if (typeof id !== "number") throw new Error("id");
    if (!Array.isArray(params)) throw new Error("params");

    if (id < 0 || id > DG.COUNT) throw new Error(`id '${id}' is out of bounds`);

    this.id = id;

    this.params = [];
    for (let p of params) {
      if (typeof p !== "string") throw new Error(`param '${p}' string expected`);
      this.params.push(new Field(p));
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

module.exports = {
  Datagram,
  LoginFailed,
  WhoAmI,
  createDatagram
};
