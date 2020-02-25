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
  username() {
    return this.params[0].asString();
  }

  titles() {
    return this.params[1].asStringList();
  }
}

class LoginFailed extends Datagram {
  code() {
    return this.params[0].asInt();
  }

  reason() {
    return this.params[1].asString();
  }
}

class PersonalTell extends Datagram {
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

class UnArrow extends Arrow {}

class Circle extends Datagram {
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

class UnCircle extends Circle {}

class BoardInfo extends Datagram {
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
  gameNumber() {
    return this.params[0].asInt();
  }

  message() {
    return this.params[1].asString();
  }
}

class ExaminersInGame extends Datagram {
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

class MyGameStarted extends GameStarted {}

class MyGameChanged extends MyGameStarted {}

class StartedObserving extends MyGameStarted {}

class GameResult extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  becomeExamined() {
    return this.params[1].asBool();
  }

  resultCode() {
    return this.params[2].asString();
  }

  scoreString() {
    return this.params[3].asString();
  }

  description() {
    return this.params[4].asString();
  }

  eco() {
    return this.params[5].asString();
  }
}

class MyGameResult extends GameResult {}

class MyGameEnded extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }
}

class ExaminedGameIsGone extends MyGameEnded {}

class StopObserving extends MyGameEnded {}

class MyRelationToGame extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  isLeaving() {
    return this.params[1].asString() === "X";
  }

  isPlaying() {
    const val = this.params[1].asString();
    return val === "PW" || val === "PB" || this.isPlayingSimul();
  }

  isPlayingSimul() {
    const val = this.params[1].asString();
    return val === "SW" || val === "SB";
  }

  isObserving() {
    return this.params[1].asString() === "O";
  }
}

class TourneyGameStarted extends Datagram {
  eventLabel() {
    return this.params[0].asString();
  }

  black() {
    return this.params[1].asString();
  }

  white() {
    return this.params[2].asString();
  }

  gameId() {
    return this.params[3].asString();
  }

  gameNumber() {
    return this.params[4].asInt();
  }
}

class TourneyGameEnded extends Datagram {
  eventLabel() {
    return this.params[0].asString();
  }

  black() {
    return this.params[1].asString();
  }

  white() {
    return this.params[2].asString();
  }

  gameId() {
    return this.params[3].asString();
  }

  scoreString() {
    return this.params[4].asString();
  }
}

class PositionBegin extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  initialFen() {
    return this.params[1].asString();
  }

  numberOfMovesToFollow() {
    return this.params[2].asInt();
  }
}

class PositionBegin2 extends PositionBegin {}

// CAUTION: This datagram is highly configurable.
// It will arrive with the defined properties with a specific datagram configuration only.
// The configuration is:
//  Enable  datagrams: MoveSmith
//  Disable datagrams: MoveAlgebraic, MoveTime, MoveClock
class SendMoves extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  move() {
    return this.params[1].asString();
  }

  // Returns enum MoveVariation.
  variation() {
    return this.params[2].asInt();
  }
}

const datagramFactory = [];
datagramFactory.length = DG.COUNT;
datagramFactory[DG.ARROW] = Arrow;
datagramFactory[DG.BOARDINFO] = BoardInfo;
datagramFactory[DG.CHANNEL_TELL] = ChannelTell;
datagramFactory[DG.CHANNEL_QTELL] = ChannelQTell;
datagramFactory[DG.CIRCLE] = Circle;
datagramFactory[DG.EXAMINED_GAME_IS_GONE] = ExaminedGameIsGone;
datagramFactory[DG.EXAMINERS_IN_GAME] = ExaminersInGame;
datagramFactory[DG.GAME_MESSAGE] = GameMessage;
datagramFactory[DG.GAME_RESULT] = GameResult;
datagramFactory[DG.GAME_STARTED] = GameStarted;
datagramFactory[DG.KIBITZ] = Kibitz;
datagramFactory[DG.LOGIN_FAILED] = LoginFailed;
datagramFactory[DG.MY_GAME_CHANGE] = MyGameChanged;
datagramFactory[DG.MY_GAME_ENDED] = MyGameEnded;
datagramFactory[DG.MY_GAME_RESULT] = MyGameResult;
datagramFactory[DG.MY_GAME_STARTED] = MyGameStarted;
datagramFactory[DG.MY_RELATION_TO_GAME] = MyRelationToGame;
datagramFactory[DG.PERSONAL_TELL] = PersonalTell;
datagramFactory[DG.PERSONAL_TELL_ECHO] = PersonalTellEcho;
datagramFactory[DG.PERSONAL_QTELL] = PersonalQTell;
datagramFactory[DG.POSITION_BEGIN] = PositionBegin;
datagramFactory[DG.POSITION_BEGIN2] = PositionBegin2;
datagramFactory[DG.SEND_MOVES] = SendMoves;
datagramFactory[DG.STOP_OBSERVING] = StopObserving;
datagramFactory[DG.STARTED_OBSERVING] = StartedObserving;
datagramFactory[DG.TOURNEY_GAME_ENDED] = TourneyGameEnded;
datagramFactory[DG.TOURNEY_GAME_STARTED] = TourneyGameStarted;
datagramFactory[DG.UNARROW] = UnArrow;
datagramFactory[DG.UNCIRCLE] = UnCircle;
datagramFactory[DG.WHO_AM_I] = WhoAmI;

function createDatagram(id, params) {
  if (typeof id !== "number") throw new Error("id");
  if (!Array.isArray(params)) throw new Error("params");

  const factory = datagramFactory[id];
  if (factory) {
    return new factory(id, params);
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
  ExaminedGameIsGone,
  ExaminersInGame,
  GameMessage,
  GameResult,
  GameStarted,
  Kibitz,
  LoginFailed,
  MyGameChanged,
  MyGameEnded,
  MyGameResult,
  MyGameStarted,
  MyRelationToGame,
  PersonalTell,
  PersonalTellEcho,
  PersonalQTell,
  PositionBegin,
  PositionBegin2,
  SendMoves,
  StartedObserving,
  StopObserving,
  TourneyGameEnded,
  TourneyGameStarted,
  UnArrow,
  UnCircle,
  WhoAmI,
  createDatagram
};
