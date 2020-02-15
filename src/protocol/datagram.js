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

module.exports = {
  Datagram: Datagram
};
