"use strict";

const { CN } = require("./id");

class Meta {
  constructor(id, sender, tag) {
    if (typeof id !== "number") throw new Error("id");
    if (typeof sender !== "string") throw new Error("sender");

    this.id = id;
    this.sender = sender;
    this.tag = tag;
  }
}

const UNKNOWN_META = new Meta(CN.S_UNKNOWN, "*");

class Command {
  constructor(meta, content, datagrams) {
    if (!(meta instanceof Meta)) throw new Error("meta");
    if (typeof content !== "string") throw new Error("content");

    this.meta = meta;
    this.content = content.replace("\r\n", "\n");
    this.datagrams = datagrams;
  }
}

class Date extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }
}

const INVALID_GAME_ID = "-1";

class Observe extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }

  get gameId() {
    const match = / (\d+)\./.exec(this.content);
    return match ? match[1] : INVALID_GAME_ID;
  }
}

const commandFactory = [];
commandFactory.length = CN.COUNT;
commandFactory[CN.DATE] = Date;
commandFactory[CN.OBSERVE] = Observe;

function createCommand(meta, content, datagrams) {
  if (!(meta instanceof Meta)) throw new Error("meta");
  if (typeof content !== "string") throw new Error("content");

  const factory = commandFactory[meta.id];
  if (factory) {
    return new factory(meta, content, datagrams);
  }

  return new Command(meta, content, datagrams);
}

module.exports = {
  createCommand,
  Command,
  Meta,
  Date,
  Observe,
  INVALID_GAME_ID,
  UNKNOWN_META
};
