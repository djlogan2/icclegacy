"use strict";

const { Meta } = require("./command");
const { DG } = require("./id");

class Datagram {
  constructor(meta, id, params) {
    if (!(meta instanceof Meta)) throw new Error("meta");
    if (typeof id !== "number") throw new Error("id");
    if (!Array.isArray(params)) throw new Error("params");

    if (id < 0 || id > DG.COUNT) throw new Error(`id '${id}' is out of bounds`);

    this.meta = meta;
    this.id = id;
    this.params = params;
  }
}

class WhoAmI extends Datagram {
  constructor(meta, params) {
    super(meta, DG.WHO_AM_I, params);
  }

  username() {
    return this.params[0].asString();
  }

  titles() {
    return this.params[1].asStringList();
  }
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
  Datagram,
  WhoAmI,
  Param
};
