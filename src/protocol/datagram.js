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
  static id = DG.WHO_AM_I;

  constructor(params) {
    super(WhoAmI.id, params);
  }

  username() {
    return this.params[0].asString();
  }

  titles() {
    return this.params[1].asStringList();
  }
}

class LoginFailed extends Datagram {
  static id = DG.LOGIN_FAILED;

  constructor(params) {
    super(LoginFailed.id, params);
  }

  code() {
    return this.params[0].asInt();
  }

  reason() {
    return this.params[1].asString();
  }
}

class PersonalTell extends Datagram {
  static id = DG.PERSONAL_TELL;

  constructor(params) {
    super(PersonalTell.id, params);
  }

  senderUsername() {
    return this.params[0].asString();
  }

  senderTitles() {
    return this.params[1].asStringList();
  }

  message() {
    return this.params[2].asString();
  }

  // Returns enum TellType.
  tellType() {
    return this.params[3].asInt();
  }
}

class PersonalTellEcho extends Datagram {
  static id = DG.PERSONAL_TELL_ECHO;

  constructor(params) {
    super(PersonalTellEcho.id, params);
  }

  senderUsername() {
    return this.params[0].asString();
  }

  // Returns enum TellType.
  tellType() {
    return this.params[1].asInt();
  }

  message() {
    return this.params[2].asString();
  }
}

class PersonalQTell extends Datagram {
  static id = DG.PERSONAL_QTELL;

  constructor(params) {
    super(PersonalQTell.id, params);
  }

  senderUsername() {
    return this.params[0].asString();
  }

  senderTitles() {
    return this.params[1].asStringList();
  }

  message() {
    return this.params[2].asString();
  }
}

class ChannelTell extends Datagram {
  static id = DG.CHANNEL_TELL;

  constructor(params) {
    super(ChannelTell.id, params);
  }

  channel() {
    return this.params[0].asInt();
  }

  senderUsername() {
    return this.params[1].asString();
  }

  senderTitles() {
    return this.params[2].asStringList();
  }

  message() {
    return this.params[3].asString();
  }

  // Returns enum TellType.
  tellType() {
    return this.params[4].asInt();
  }
}

const datagramFactory = [];
datagramFactory.length = DG.COUNT;
datagramFactory[ChannelTell.id] = ChannelTell;
datagramFactory[LoginFailed.id] = LoginFailed;
datagramFactory[PersonalTell.id] = PersonalTell;
datagramFactory[PersonalTellEcho.id] = PersonalTellEcho;
datagramFactory[PersonalQTell.id] = PersonalQTell;
datagramFactory[WhoAmI.id] = WhoAmI;

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
  ChannelTell,
  Datagram,
  LoginFailed,
  PersonalTell,
  PersonalTellEcho,
  PersonalQTell,
  WhoAmI,
  createDatagram
};
