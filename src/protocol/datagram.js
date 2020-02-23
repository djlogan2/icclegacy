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

class ChannelQTell extends Datagram {
  static id = DG.CHANNEL_QTELL;

  constructor(params) {
    super(ChannelQTell.id, params);
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
}

class Kibitz extends Datagram {
  static id = DG.KIBITZ;

  constructor(params) {
    super(Kibitz.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  senderUsername() {
    return this.params[1].asString();
  }

  senderTitles() {
    return this.params[2].asStringList();
  }

  // Returns enum KibitzType.
  type() {
    return this.params[3].asInt();
  }

  message() {
    return this.params[4].asString();
  }
}

class Arrow extends Datagram {
  static id = DG.ARROW;

  constructor(params) {
    super(Arrow.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  examiner() {
    return this.params[1].asString();
  }

  from() {
    return this.params[2].asString();
  }

  to() {
    return this.params[3].asString();
  }
}

class UnArrow extends Datagram {
  static id = DG.UNARROW;

  constructor(params) {
    super(UnArrow.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  examiner() {
    return this.params[1].asString();
  }

  from() {
    return this.params[2].asString();
  }

  to() {
    return this.params[3].asString();
  }
}

class Circle extends Datagram {
  static id = DG.CIRCLE;

  constructor(params) {
    super(Circle.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  examiner() {
    return this.params[1].asString();
  }

  square() {
    return this.params[2].asString();
  }
}

class UnCircle extends Datagram {
  static id = DG.UNCIRCLE;

  constructor(params) {
    super(UnCircle.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  examiner() {
    return this.params[1].asString();
  }

  square() {
    return this.params[2].asString();
  }
}

class BoardInfo extends Datagram {
  static id = DG.BOARDINFO;

  constructor(params) {
    super(BoardInfo.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  examiner() {
    return this.params[1].asString();
  }

  // Returns enum MarkerType.
  markerType() {
    return this.params[2].asInt();
  }

  from() {
    return this.params[3].asString();
  }

  to() {
    return this.params[4].asString();
  }

  // Returns enum MarkerBrush.
  markerBrush() {
    return this.params[5].asInt();
  }
}

class GameMessage extends Datagram {
  static id = DG.GAME_MESSAGE;

  constructor(params) {
    super(GameMessage.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  message() {
    return this.params[1].asString();
  }
}

class ExaminersInGame extends Datagram {
  static id = DG.EXAMINERS_IN_GAME;

  constructor(params) {
    super(ExaminersInGame.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  username() {
    return this.params[1].asString();
  }

  titles() {
    return this.params[2].asStringList();
  }

  joined() {
    return this.params[3].asBool();
  }
}

class GameStarted extends Datagram {
  static id = DG.GAME_STARTED;

  constructor(params) {
    super(GameStarted.id, params);
  }

  gameNumber() {
    return this.params[0].asInt();
  }

  whiteUsername() {
    return this.params[1].asString();
  }

  blackUsername() {
    return this.params[2].asString();
  }

  // Returns enum Wild.
  wild() {
    return this.params[3].asInt();
  }

  ratingCategoryName() {
    return this.params[4].asString();
  }

  rated() {
    return this.params[5].asBool();
  }

  whiteInitial() {
    return this.params[6].asMsFromMinutes();
  }

  whiteIncrement() {
    return this.params[7].asMsFromSeconds();
  }

  blackInitial() {
    return this.params[8].asMsFromMinutes();
  }

  blackIncrement() {
    return this.params[9].asMsFromSeconds();
  }

  playedGame() {
    return this.params[10].asBool();
  }

  exString() {
    return this.params[11].asString();
  }

  whiteRating() {
    return this.params[12].asInt();
  }

  blackRating() {
    return this.params[13].asInt();
  }

  gameId() {
    return this.params[14].asString();
  }

  whiteTitles() {
    return this.params[15].asStringList();
  }

  blackTitles() {
    return this.params[16].asStringList();
  }

  irregularLegality() {
    return this.params[17].asBool();
  }

  irregularSemantics() {
    return this.params[18].asBool();
  }

  usesPlunkers() {
    return this.params[19].asBool();
  }

  fancyTimeControl() {
    return this.params[20].asString();
  }

  promoteToKing() {
    return this.params[21].asBool();
  }
}

const datagramFactory = [];
datagramFactory.length = DG.COUNT;
datagramFactory[Arrow.id] = Arrow;
datagramFactory[BoardInfo.id] = BoardInfo;
datagramFactory[ChannelTell.id] = ChannelTell;
datagramFactory[ChannelQTell.id] = ChannelQTell;
datagramFactory[Circle.id] = Circle;
datagramFactory[ExaminersInGame.id] = ExaminersInGame;
datagramFactory[GameMessage.id] = GameMessage;
datagramFactory[GameStarted.id] = GameStarted;
datagramFactory[Kibitz.id] = Kibitz;
datagramFactory[LoginFailed.id] = LoginFailed;
datagramFactory[PersonalTell.id] = PersonalTell;
datagramFactory[PersonalTellEcho.id] = PersonalTellEcho;
datagramFactory[PersonalQTell.id] = PersonalQTell;
datagramFactory[UnArrow.id] = UnArrow;
datagramFactory[UnCircle.id] = UnCircle;
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
  Arrow,
  BoardInfo,
  ChannelTell,
  ChannelQTell,
  Circle,
  Datagram,
  ExaminersInGame,
  GameMessage,
  GameStarted,
  Kibitz,
  LoginFailed,
  PersonalTell,
  PersonalTellEcho,
  PersonalQTell,
  UnArrow,
  UnCircle,
  WhoAmI,
  createDatagram
};
