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

class IllegalMove extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }
}

class Finger extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }
}

class List extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }
}

class Minus extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }

  success() {
    const content = this.content.trimEnd();
    return /^Removed .*\.$/.test(content) || /^Removing ".*" from the list\.$/.test(content);
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

class Pgn extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }
}

class Plus extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
  }

  success() {
    const content = this.content.trimEnd();
    return /^.* added\.$/.test(content) || /^You have been added to .*'s simul list\.$/.test(content) || /^added to .* list$/.test(content);
  }
}

const commandFactory = [];
commandFactory.length = CN.COUNT;
commandFactory[CN.DATE] = Date;
commandFactory[CN.FINGER] = Finger;
commandFactory[CN.LIST] = List;
commandFactory[CN.MINUS] = Minus;
commandFactory[CN.OBSERVE] = Observe;
commandFactory[CN.PGN] = Pgn;
commandFactory[CN.PLUS] = Plus;
commandFactory[CN.S_ILLEGAL_MOVE] = IllegalMove;

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
  IllegalMove,
  Finger,
  List,
  Minus,
  Observe,
  Pgn,
  Plus,
  INVALID_GAME_ID,
  UNKNOWN_META
};
