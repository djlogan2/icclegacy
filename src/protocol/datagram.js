"use strict";

const { DG } = require("./id");
const { Param } = require("./param");
const { Color } = require("./const");

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

class Field extends Datagram {
  username() {
    return this.params[0].asString();
  }

  key() {
    return this.params[1].asString();
  }

  value() {
    return this.params[2].asString();
  }
}

class Note extends Datagram {
  username() {
    return this.params[0].asString();
  }

  index() {
    return this.params[1].asInt();
  }

  text() {
    return this.params[2].asString();
  }
}

class EndProfile extends Datagram {
  username() {
    return this.params[0].asString();
  }
}

class Sound extends Datagram {
  code() {
    return this.params[0].asInt();
  }
}

class Error extends Datagram {
  code() {
    return this.params[0].asInt();
  }

  language() {
    return this.params[1].asString();
  }

  message() {
    return this.params[2].asString();
  }

  url() {
    return this.params[3].asString();
  }
}

class Fail extends Datagram {
  // Returns enum CN.
  failedCommand() {
    return this.params[0].asInt();
  }

  message() {
    return this.params[1].asString();
  }
}

class ListHead extends Datagram {
  // One of the following: alias, message, channel, adjourned, history, library, games, notify, censor.
  listName() {
    return this.params[0].asString();
  }

  listOwner() {
    return this.params[1].asString();
  }
}

class ListEnd extends Datagram {}

class ListItem extends Datagram {
  constructor(id, params) {
    super(id, params);

    this.paramOffset = 0;
  }

  hasParams() {
    return this.params.length > this.paramOffset;
  }

  stringParam(atIndex) {
    return getListItemParam(this, atIndex).asString();
  }

  intParam(atIndex) {
    return getListItemParam(this, atIndex).asInt();
  }

  boolParam(atIndex) {
    return getListItemParam(this, atIndex).asBool();
  }

  durationParam(atIndex) {
    return getListItemParam(this, atIndex).asMsFromSeconds();
  }

  timestampParam(atIndex) {
    return getListItemParam(this, atIndex).asEpochFromISO8601();
  }

  colorParam(atIndex) {
    return getListItemParam(this, atIndex).asColor();
  }
}

class ListModified extends ListItem {
  constructor(id, params) {
    super(id, params);
    super.paramOffset = 2;
  }

  // One of the following: alias, message, channel, adjourned, history, library, games, notify, censor.
  listName() {
    return this.params[0].asString();
  }

  listOwner() {
    return this.params[1].asString();
  }
}

class ListAdded extends ListModified {}

class ListRemoved extends ListModified {}

function getListItemParam(dg, atIndex) {
  if (!(dg instanceof ListItem)) throw new Error("dg");
  if (typeof atIndex !== "number") throw new Error("atIndex");

  return dg.params[dg.paramOffset + atIndex];
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

class PastMoves extends SendMoves {}

class IllegalMove extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  move() {
    return this.params[1].asString();
  }

  reason() {
    return this.params[2].asString();
  }
}

class Backward extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  count() {
    return this.params[1].asInt();
  }
}

class Takeback extends Backward {}

class MyTurn extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }
}

class DisablePremove extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }
}

class Flip extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  flipTo() {
    // Fucked up - the color notation for this datagram is inverse of everywhere else.
    return this.params[1].asInt() === 1 ? Color.BLACK : Color.WHITE;
  }
}

class MSec extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  color() {
    // The value matches enum Color.
    return this.params[1].asString();
  }

  timeLeft() {
    return this.params[2].asMsFromMs();
  }

  run() {
    return this.params[3].asBool();
  }

  freeTimeToMove() {
    return this.params.length >= 6 ? this.params[4].asMsFromMs() : 0;
  }

  minMoveTime() {
    return this.params.length >= 6 ? this.params[5].asMsFromMs() : 0;
  }
}

class SetClock extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  whiteClock() {
    return this.params[1].asMsFromSeconds();
  }

  blackClock() {
    return this.params[2].asMsFromSeconds();
  }
}

class OffersInMyGame extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  whiteDraw() {
    return this.params[1].asBool();
  }

  blackDraw() {
    return this.params[2].asBool();
  }

  whiteAdjourn() {
    return this.params[3].asBool();
  }

  blackAdjourn() {
    return this.params[4].asBool();
  }

  whiteAbort() {
    return this.params[5].asBool();
  }

  blackAbort() {
    return this.params[6].asBool();
  }

  whiteTakeback() {
    return this.params[7].asBool();
  }

  blackTakeback() {
    return this.params[8].asBool();
  }
}

class PlayersInMyGame extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  handle() {
    return this.params[1].asString();
  }

  role() {
    return this.params[2].asString();
  }

  kib() {
    return this.params[3].asString();
  }
}

class PoolDatagram extends Datagram {
  name() {
    return this.params[0].asString();
  }
}

class PoolJoined extends PoolDatagram {}

class PoolLeft extends PoolDatagram {}

class Fen extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  fen() {
    return this.params[1].asString();
  }
}

class Refresh extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }
}

class Match extends Datagram {
  senderName() {
    return this.params[0].asString();
  }

  senderRating() {
    return this.params[1].asInt();
  }

  senderRatingType() {
    return this.params[2].asInt();
  }

  senderTitles() {
    return this.params[3].asStringList();
  }

  receiverName() {
    return this.params[4].asString();
  }

  receiverRating() {
    return this.params[5].asInt();
  }

  receiverRatingType() {
    return this.params[6].asInt();
  }

  receiverTitles() {
    return this.params[7].asStringList();
  }

  wildNumber() {
    return this.params[8].asInt();
  }

  ratingCategoryName() {
    return this.params[9].asString();
  }

  isRated() {
    return this.params[10].asBool();
  }

  isAdjourned() {
    return this.params[11].asBool();
  }

  senderInitialTime() {
    return this.params[12].asMsFromMinutes();
  }

  senderIncrement() {
    return this.params[13].asMsFromSeconds();
  }

  receiverInitialTime() {
    return this.params[14].asMsFromMinutes();
  }

  receiverIncrement() {
    return this.params[15].asMsFromSeconds();
  }

  requestedColor() {
    return this.params[16].asColor();
  }

  assessLoss() {
    return this.params.length > 17 ? this.params[17].asInt() : 0;
  }

  assessDraw() {
    return this.params.length > 18 ? this.params[18].asInt() : 0;
  }

  assessWin() {
    return this.params.length > 19 ? this.params[19].asInt() : 0;
  }
}

class MatchRemoved extends Datagram {
  senderName() {
    return this.params[0].asString();
  }

  receiverName() {
    return this.params[1].asString();
  }

  reason() {
    return this.params[2].asString();
  }
}

class LogPgn extends Datagram {
  pgn() {
    return this.params.map(p => p.asString()).join("\n");
  }
}

class PgnTag extends Datagram {
  gameNumber() {
    return this.params[0].asInt();
  }

  name() {
    return this.params[1].asString();
  }

  value() {
    return this.params[2].asString();
  }
}

class PlayerArrivedSimple extends Datagram {
  username() {
    return this.params[0].asString();
  }
}

class NotifyArrived extends Datagram {
  username() {
    return this.params[0].asString();
  }
}

class PlayerLeft extends Datagram {
  username() {
    return this.params[0].asString();
  }
}

class NotifyLeft extends Datagram {
  username() {
    return this.params[0].asString();
  }
}

class NotifyState extends Datagram {
  username() {
    return this.params[0].asString();
  }

  status() {
    return this.params[1].asString();
  }

  gameNumber() {
    return this.params[2].asInt();
  }
}

class MyNotifyList extends Datagram {
  username() {
    return this.params[0].asString();
  }

  added() {
    return this.params[1].asBool();
  }
}

class Country extends Datagram {
  username() {
    return this.params[0].asString();
  }

  gameNumber() {
    return this.params[1].asInt();
  }

  countryFlag() {
    return this.params[2].asString();
  }
}

class Mugshot extends Datagram {
  username() {
    return this.params[0].asString();
  }

  url() {
    return this.params[1].asString();
  }

  gameNumber() {
    return this.params[2].asInt();
  }
}

class PStat2 extends Datagram {
  ratingIndex() {
    return this.params[0].asInt();
  }

  username1() {
    return this.params[1].asString();
  }

  username2() {
    return this.params[2].asString();
  }

  winsAsWhite() {
    return this.params[3].asInt();
  }

  lossesAsWhite() {
    return this.params[4].asInt();
  }

  drawsAsWhite() {
    return this.params[5].asInt();
  }

  winsAsBlack() {
    return this.params[6].asInt();
  }

  lossesAsBlack() {
    return this.params[7].asInt();
  }

  drawsAsBlack() {
    return this.params[8].asInt();
  }
}

class RatingTypeKey extends Datagram {
  index() {
    return this.params[0].asInt();
  }

  ratingName() {
    return this.params[1].asString();
  }
}

class MyRating extends Datagram {
  ratings() {
    return this.params.map(p => p.asInt());
  }
}

class NewMyRating extends MyRating {}

class WildKey extends Datagram {
  index() {
    return this.params[0].asInt();
  }

  wildName() {
    return this.params[1].asString();
  }
}

class Rating extends Datagram {
  username() {
    return this.params[0].asString();
  }

  ratingCategoryIndex() {
    return this.params[1].asInt();
  }

  ratingRank() {
    return this.params[2].asInt();
  }

  ratingScore() {
    return this.params[3].asInt();
  }

  needsGames() {
    return this.params[4].asInt();
  }

  totalWins() {
    return this.params[5].asInt();
  }

  totalDraws() {
    return this.params[6].asInt();
  }

  totalLosses() {
    return this.params[7].asInt();
  }

  bestRatingScore() {
    return this.params[8].asInt();
  }

  bestRatingDate() {
    return this.params[9].asEpochFromISO8601();
  }
}

class FormFeedback extends Datagram {
  fieldName() {
    return this.params[0].asString();
  }

  code() {
    return this.params[1].asInt();
  }

  errorMessage() {
    return this.params[3].asString();
  }
}

class DummyResponse extends Datagram {}

class Seek extends Datagram {
  index() {
    return this.params[0].asInt();
  }

  username() {
    return this.params[1].asString();
  }

  titles() {
    return this.params[2].asStringList();
  }

  rating() {
    return this.params[3].asInt();
  }

  // Returns enum ProvisionalStatus.
  provisionalStatus() {
    return this.params[4].asInt();
  }

  // Returns enum Wild.
  wild() {
    return this.params[5].asInt();
  }

  ratingName() {
    return this.params[6].asString();
  }

  time() {
    return this.params[7].asMsFromMinutes();
  }

  increment() {
    return this.params[8].asMsFromSeconds();
  }

  rated() {
    return this.params[9].asBool();
  }

  color() {
    return this.params[10].asColor();
  }

  minRating() {
    return this.params[11].asInt();
  }

  maxRating() {
    return this.params[12].asInt();
  }

  autoAccept() {
    return this.params[13].asBool();
  }

  checksFormula() {
    return this.params[14].asBool();
  }
}

class SeekRemoved extends Datagram {
  index() {
    return this.params[0].asInt();
  }

  // Returns enum SeekRemovedReason.
  reason() {
    return this.params[1].asInt();
  }
}

const datagramFactory = [];
datagramFactory.length = DG.COUNT;
datagramFactory[DG.ARROW] = Arrow;
datagramFactory[DG.BACKWARD] = Backward;
datagramFactory[DG.BOARDINFO] = BoardInfo;
datagramFactory[DG.CHANNEL_TELL] = ChannelTell;
datagramFactory[DG.CHANNEL_QTELL] = ChannelQTell;
datagramFactory[DG.CIRCLE] = Circle;
datagramFactory[DG.COUNTRY] = Country;
datagramFactory[DG.DISABLE_PREMOVE] = DisablePremove;
datagramFactory[DG.DUMMY_RESPONSE] = DummyResponse;
datagramFactory[DG.END_PROFILE] = EndProfile;
datagramFactory[DG.ERROR] = Error;
datagramFactory[DG.EXAMINED_GAME_IS_GONE] = ExaminedGameIsGone;
datagramFactory[DG.EXAMINERS_IN_GAME] = ExaminersInGame;
datagramFactory[DG.FAIL] = Fail;
datagramFactory[DG.FEN] = Fen;
datagramFactory[DG.FIELD] = Field;
datagramFactory[DG.FLIP] = Flip;
datagramFactory[DG.FORM_FEEDBACK] = FormFeedback;
datagramFactory[DG.GAME_MESSAGE] = GameMessage;
datagramFactory[DG.GAME_RESULT] = GameResult;
datagramFactory[DG.GAME_STARTED] = GameStarted;
datagramFactory[DG.ILLEGAL_MOVE] = IllegalMove;
datagramFactory[DG.KIBITZ] = Kibitz;
datagramFactory[DG.LIST_ADDED] = ListAdded;
datagramFactory[DG.LIST_END] = ListEnd;
datagramFactory[DG.LIST_HEAD] = ListHead;
datagramFactory[DG.LIST_ITEM] = ListItem;
datagramFactory[DG.LIST_REMOVED] = ListRemoved;
datagramFactory[DG.LOG_PGN] = LogPgn;
datagramFactory[DG.LOGIN_FAILED] = LoginFailed;
datagramFactory[DG.MATCH] = Match;
datagramFactory[DG.MATCH_REMOVED] = MatchRemoved;
datagramFactory[DG.MSEC] = MSec;
datagramFactory[DG.MUGSHOT] = Mugshot;
datagramFactory[DG.MY_GAME_CHANGE] = MyGameChanged;
datagramFactory[DG.MY_GAME_ENDED] = MyGameEnded;
datagramFactory[DG.MY_GAME_RESULT] = MyGameResult;
datagramFactory[DG.MY_GAME_STARTED] = MyGameStarted;
datagramFactory[DG.MY_NOTIFY_LIST] = MyNotifyList;
datagramFactory[DG.MY_RATING] = MyRating;
datagramFactory[DG.MY_RELATION_TO_GAME] = MyRelationToGame;
datagramFactory[DG.MY_TURN] = MyTurn;
datagramFactory[DG.NEW_MY_RATING] = NewMyRating;
datagramFactory[DG.NOTE] = Note;
datagramFactory[DG.NOTIFY_ARRIVED] = NotifyArrived;
datagramFactory[DG.NOTIFY_LEFT] = NotifyLeft;
datagramFactory[DG.NOTIFY_STATE] = NotifyState;
datagramFactory[DG.OFFERS_IN_MY_GAME] = OffersInMyGame;
datagramFactory[DG.PAST_MOVE] = PastMoves;
datagramFactory[DG.PERSONAL_TELL] = PersonalTell;
datagramFactory[DG.PERSONAL_TELL_ECHO] = PersonalTellEcho;
datagramFactory[DG.PERSONAL_QTELL] = PersonalQTell;
datagramFactory[DG.PGN_TAG] = PgnTag;
datagramFactory[DG.PLAYER_ARRIVED_SIMPLE] = PlayerArrivedSimple;
datagramFactory[DG.PLAYER_LEFT] = PlayerLeft;
datagramFactory[DG.PLAYERS_IN_MY_GAME] = PlayersInMyGame;
datagramFactory[DG.POOL_JOINED] = PoolJoined;
datagramFactory[DG.POOL_LEFT] = PoolLeft;
datagramFactory[DG.POSITION_BEGIN] = PositionBegin;
datagramFactory[DG.POSITION_BEGIN2] = PositionBegin2;
datagramFactory[DG.PSTAT2] = PStat2;
datagramFactory[DG.RATING] = Rating;
datagramFactory[DG.RATING_TYPE_KEY] = RatingTypeKey;
datagramFactory[DG.REFRESH] = Refresh;
datagramFactory[DG.SEEK] = Seek;
datagramFactory[DG.SEEK_REMOVED] = SeekRemoved;
datagramFactory[DG.SEND_MOVES] = SendMoves;
datagramFactory[DG.SET_CLOCK] = SetClock;
datagramFactory[DG.SOUND] = Sound;
datagramFactory[DG.STOP_OBSERVING] = StopObserving;
datagramFactory[DG.STARTED_OBSERVING] = StartedObserving;
datagramFactory[DG.TAKEBACK] = Takeback;
datagramFactory[DG.TOURNEY_GAME_ENDED] = TourneyGameEnded;
datagramFactory[DG.TOURNEY_GAME_STARTED] = TourneyGameStarted;
datagramFactory[DG.UNARROW] = UnArrow;
datagramFactory[DG.UNCIRCLE] = UnCircle;
datagramFactory[DG.WHO_AM_I] = WhoAmI;
datagramFactory[DG.WILD_KEY] = WildKey;

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
  Backward,
  BoardInfo,
  ChannelTell,
  ChannelQTell,
  Circle,
  Country,
  Datagram,
  DisablePremove,
  DummyResponse,
  EndProfile,
  Error,
  ExaminedGameIsGone,
  ExaminersInGame,
  Fail,
  Fen,
  Flip,
  Field,
  FormFeedback,
  GameMessage,
  GameResult,
  GameStarted,
  IllegalMove,
  Kibitz,
  ListAdded,
  ListEnd,
  ListHead,
  ListItem,
  ListRemoved,
  LogPgn,
  LoginFailed,
  Match,
  MatchRemoved,
  MSec,
  Mugshot,
  MyGameChanged,
  MyGameEnded,
  MyGameResult,
  MyGameStarted,
  MyNotifyList,
  MyRating,
  MyRelationToGame,
  MyTurn,
  NewMyRating,
  Note,
  NotifyArrived,
  NotifyLeft,
  NotifyState,
  OffersInMyGame,
  PastMoves,
  PersonalTell,
  PersonalTellEcho,
  PersonalQTell,
  PgnTag,
  PlayerArrivedSimple,
  PlayerLeft,
  PlayersInMyGame,
  PoolJoined,
  PoolLeft,
  PositionBegin,
  PositionBegin2,
  PStat2,
  Rating,
  RatingTypeKey,
  Refresh,
  Seek,
  SeekRemoved,
  SendMoves,
  SetClock,
  Sound,
  StartedObserving,
  StopObserving,
  Takeback,
  TourneyGameEnded,
  TourneyGameStarted,
  UnArrow,
  UnCircle,
  WhoAmI,
  WildKey,
  createDatagram
};
