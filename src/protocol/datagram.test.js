"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { CN, DG } = require("./id");
const {
  Arrow,
  Backward,
  BoardInfo,
  ChannelTell,
  ChannelQTell,
  Circle,
  DisablePremove,
  EndProfile,
  Error,
  ExaminedGameIsGone,
  ExaminersInGame,
  Fail,
  Fen,
  Field,
  Flip,
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
  LoginFailed,
  Match,
  MSec,
  MyGameChanged,
  MyGameEnded,
  MyGameResult,
  MyGameStarted,
  MyRelationToGame,
  MyTurn,
  Note,
  OffersInMyGame,
  PastMoves,
  PersonalTell,
  PersonalTellEcho,
  PersonalQTell,
  PlayersInMyGame,
  PoolJoined,
  PoolLeft,
  PositionBegin,
  PositionBegin2,
  Refresh,
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
  createDatagram
} = require("./datagram");
const { Color, KibitzType, MarkerBrush, MarkerType, MoveVariation, TellType, Wild } = require("./const");

describe("Datagram", () => {
  describe("WhoAmI", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.WHO_AM_I, ["usr", "gm sh"]);
      assert.instanceOf(dg, WhoAmI);
      assert.equal(dg.id, DG.WHO_AM_I);
      assert.equal(dg.username(), "usr");
      assert.sameMembers(dg.titles(), ["gm", "sh"]);
    });
  });

  describe("LoginFailed", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.LOGIN_FAILED, ["42", "test reason"]);
      assert.instanceOf(dg, LoginFailed);
      assert.equal(dg.id, DG.LOGIN_FAILED);
      assert.equal(dg.code(), 42);
      assert.equal(dg.reason(), "test reason");
    });
  });

  describe("PersonalTell", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.PERSONAL_TELL, ["test-user", "gm sh", "bla bla bla", "3"]);
      assert.instanceOf(dg, PersonalTell);
      assert.equal(dg.id, DG.PERSONAL_TELL);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
      assert.equal(dg.tellType(), TellType.QTELL);
    });
  });

  describe("PersonalTellEcho", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.PERSONAL_TELL_ECHO, ["test-user", "3", "bla bla bla"]);
      assert.instanceOf(dg, PersonalTellEcho);
      assert.equal(dg.id, DG.PERSONAL_TELL_ECHO);
      assert.equal(dg.senderUsername(), "test-user");
      assert.equal(dg.tellType(), TellType.QTELL);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("PersonalQTell", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.PERSONAL_QTELL, ["test-user", "gm sh", "bla bla bla"]);
      assert.instanceOf(dg, PersonalQTell);
      assert.equal(dg.id, DG.PERSONAL_QTELL);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("ChannelTell", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.CHANNEL_TELL, ["42", "test-user", "gm sh", "bla bla bla", "1"]);
      assert.instanceOf(dg, ChannelTell);
      assert.equal(dg.id, DG.CHANNEL_TELL);
      assert.equal(dg.channel(), 42);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
      assert.equal(dg.tellType(), TellType.TELL);
    });
  });

  describe("ChannelQTell", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.CHANNEL_QTELL, ["42", "test-user", "gm sh", "bla bla bla"]);
      assert.instanceOf(dg, ChannelQTell);
      assert.equal(dg.id, DG.CHANNEL_QTELL);
      assert.equal(dg.channel(), 42);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("Kibitz", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.KIBITZ, ["42", "test-user", "gm sh", "1", "bla bla bla"]);
      assert.instanceOf(dg, Kibitz);
      assert.equal(dg.id, DG.KIBITZ);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.type(), KibitzType.KIBITZ);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("Arrow", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.ARROW, ["42", "test-user", "e2", "e4"]);
      assert.instanceOf(dg, Arrow);
      assert.equal(dg.id, DG.ARROW);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.from(), "e2");
      assert.equal(dg.to(), "e4");
    });
  });

  describe("UnArrow", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.UNARROW, ["42", "test-user", "e2", "e4"]);
      assert.instanceOf(dg, UnArrow);
      assert.equal(dg.id, DG.UNARROW);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.from(), "e2");
      assert.equal(dg.to(), "e4");
    });
  });

  describe("Circle", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.CIRCLE, ["42", "test-user", "e2"]);
      assert.instanceOf(dg, Circle);
      assert.equal(dg.id, DG.CIRCLE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.square(), "e2");
    });
  });

  describe("UnCircle", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.UNCIRCLE, ["42", "test-user", "e2"]);
      assert.instanceOf(dg, UnCircle);
      assert.equal(dg.id, DG.UNCIRCLE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.square(), "e2");
    });
  });

  describe("BoardInfo", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.BOARDINFO, ["42", "test-user", "5", "e2", "e4", "6"]);
      assert.instanceOf(dg, BoardInfo);
      assert.equal(dg.id, DG.BOARDINFO);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.markerType(), MarkerType.RECTANGLE);
      assert.equal(dg.from(), "e2");
      assert.equal(dg.to(), "e4");
      assert.equal(dg.markerBrush(), MarkerBrush.LIGHT_BLUE);
    });
  });

  describe("GameMessage", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.GAME_MESSAGE, ["42", "foobar"]);
      assert.instanceOf(dg, GameMessage);
      assert.equal(dg.id, DG.GAME_MESSAGE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.message(), "foobar");
    });
  });

  describe("ExaminersInGame", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.EXAMINERS_IN_GAME, ["42", "test-user", "gm sh", "1"]);
      assert.instanceOf(dg, ExaminersInGame);
      assert.equal(dg.id, DG.EXAMINERS_IN_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.username(), "test-user");
      assert.sameMembers(dg.titles(), ["gm", "sh"]);
      assert.isTrue(dg.joined());
    });
  });

  describe("GameStarted", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.GAME_STARTED, [
        "42",
        "white-user",
        "black-user",
        "27",
        "bul",
        "1",
        "2",
        "1",
        "3",
        "2",
        "1",
        "foobar",
        "1001",
        "1002",
        "g42",
        "gm",
        "sh",
        "1",
        "1",
        "1",
        "tc",
        "1"
      ]);
      assert.instanceOf(dg, GameStarted);
      assert.equal(dg.id, DG.GAME_STARTED);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.whiteUsername(), "white-user");
      assert.equal(dg.blackUsername(), "black-user");
      assert.equal(dg.wild(), Wild.ATOMIC);
      assert.equal(dg.ratingCategoryName(), "bul");
      assert.isTrue(dg.rated());
      assert.equal(dg.whiteInitial(), 120000);
      assert.equal(dg.whiteIncrement(), 1000);
      assert.equal(dg.blackInitial(), 180000);
      assert.equal(dg.blackIncrement(), 2000);
      assert.isTrue(dg.playedGame());
      assert.equal(dg.exString(), "foobar");
      assert.equal(dg.whiteRating(), 1001);
      assert.equal(dg.blackRating(), 1002);
      assert.equal(dg.gameId(), "g42");
      assert.sameMembers(dg.whiteTitles(), ["gm"]);
      assert.sameMembers(dg.blackTitles(), ["sh"]);
      assert.isTrue(dg.irregularLegality());
      assert.isTrue(dg.irregularSemantics());
      assert.isTrue(dg.usesPlunkers());
      assert.equal(dg.fancyTimeControl(), "tc");
      assert.isTrue(dg.promoteToKing());
    });
  });

  describe("MyGameStarted", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_GAME_STARTED, [
        "42",
        "white-user",
        "black-user",
        "27",
        "bul",
        "1",
        "2",
        "1",
        "3",
        "2",
        "1",
        "foobar",
        "1001",
        "1002",
        "g42",
        "gm",
        "sh",
        "1",
        "1",
        "1",
        "tc",
        "1"
      ]);
      assert.instanceOf(dg, MyGameStarted);
      assert.equal(dg.id, DG.MY_GAME_STARTED);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.whiteUsername(), "white-user");
      assert.equal(dg.blackUsername(), "black-user");
      assert.equal(dg.wild(), Wild.ATOMIC);
      assert.equal(dg.ratingCategoryName(), "bul");
      assert.isTrue(dg.rated());
      assert.equal(dg.whiteInitial(), 120000);
      assert.equal(dg.whiteIncrement(), 1000);
      assert.equal(dg.blackInitial(), 180000);
      assert.equal(dg.blackIncrement(), 2000);
      assert.isTrue(dg.playedGame());
      assert.equal(dg.exString(), "foobar");
      assert.equal(dg.whiteRating(), 1001);
      assert.equal(dg.blackRating(), 1002);
      assert.equal(dg.gameId(), "g42");
      assert.sameMembers(dg.whiteTitles(), ["gm"]);
      assert.sameMembers(dg.blackTitles(), ["sh"]);
      assert.isTrue(dg.irregularLegality());
      assert.isTrue(dg.irregularSemantics());
      assert.isTrue(dg.usesPlunkers());
      assert.equal(dg.fancyTimeControl(), "tc");
      assert.isTrue(dg.promoteToKing());
    });
  });

  describe("MyGameChanged", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_GAME_CHANGE, [
        "42",
        "white-user",
        "black-user",
        "27",
        "bul",
        "1",
        "2",
        "1",
        "3",
        "2",
        "1",
        "foobar",
        "1001",
        "1002",
        "g42",
        "gm",
        "sh",
        "1",
        "1",
        "1",
        "tc",
        "1"
      ]);
      assert.instanceOf(dg, MyGameChanged);
      assert.equal(dg.id, DG.MY_GAME_CHANGE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.whiteUsername(), "white-user");
      assert.equal(dg.blackUsername(), "black-user");
      assert.equal(dg.wild(), Wild.ATOMIC);
      assert.equal(dg.ratingCategoryName(), "bul");
      assert.isTrue(dg.rated());
      assert.equal(dg.whiteInitial(), 120000);
      assert.equal(dg.whiteIncrement(), 1000);
      assert.equal(dg.blackInitial(), 180000);
      assert.equal(dg.blackIncrement(), 2000);
      assert.isTrue(dg.playedGame());
      assert.equal(dg.exString(), "foobar");
      assert.equal(dg.whiteRating(), 1001);
      assert.equal(dg.blackRating(), 1002);
      assert.equal(dg.gameId(), "g42");
      assert.sameMembers(dg.whiteTitles(), ["gm"]);
      assert.sameMembers(dg.blackTitles(), ["sh"]);
      assert.isTrue(dg.irregularLegality());
      assert.isTrue(dg.irregularSemantics());
      assert.isTrue(dg.usesPlunkers());
      assert.equal(dg.fancyTimeControl(), "tc");
      assert.isTrue(dg.promoteToKing());
    });
  });

  describe("StartedObserving", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.STARTED_OBSERVING, [
        "42",
        "white-user",
        "black-user",
        "27",
        "bul",
        "1",
        "2",
        "1",
        "3",
        "2",
        "1",
        "foobar",
        "1001",
        "1002",
        "g42",
        "gm",
        "sh",
        "1",
        "1",
        "1",
        "tc",
        "1"
      ]);
      assert.instanceOf(dg, StartedObserving);
      assert.equal(dg.id, DG.STARTED_OBSERVING);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.whiteUsername(), "white-user");
      assert.equal(dg.blackUsername(), "black-user");
      assert.equal(dg.wild(), Wild.ATOMIC);
      assert.equal(dg.ratingCategoryName(), "bul");
      assert.isTrue(dg.rated());
      assert.equal(dg.whiteInitial(), 120000);
      assert.equal(dg.whiteIncrement(), 1000);
      assert.equal(dg.blackInitial(), 180000);
      assert.equal(dg.blackIncrement(), 2000);
      assert.isTrue(dg.playedGame());
      assert.equal(dg.exString(), "foobar");
      assert.equal(dg.whiteRating(), 1001);
      assert.equal(dg.blackRating(), 1002);
      assert.equal(dg.gameId(), "g42");
      assert.sameMembers(dg.whiteTitles(), ["gm"]);
      assert.sameMembers(dg.blackTitles(), ["sh"]);
      assert.isTrue(dg.irregularLegality());
      assert.isTrue(dg.irregularSemantics());
      assert.isTrue(dg.usesPlunkers());
      assert.equal(dg.fancyTimeControl(), "tc");
      assert.isTrue(dg.promoteToKing());
    });
  });

  describe("GameResult", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.GAME_RESULT, ["42", "1", "a", "b", "c", "d"]);
      assert.instanceOf(dg, GameResult);
      assert.equal(dg.id, DG.GAME_RESULT);
      assert.equal(dg.gameNumber(), 42);
      assert.isTrue(dg.becomeExamined());
      assert.equal(dg.resultCode(), "a");
      assert.equal(dg.scoreString(), "b");
      assert.equal(dg.description(), "c");
      assert.equal(dg.eco(), "d");
    });
  });

  describe("MyGameResult", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_GAME_RESULT, ["42", "1", "a", "b", "c", "d"]);
      assert.instanceOf(dg, MyGameResult);
      assert.equal(dg.id, DG.MY_GAME_RESULT);
      assert.equal(dg.gameNumber(), 42);
      assert.isTrue(dg.becomeExamined());
      assert.equal(dg.resultCode(), "a");
      assert.equal(dg.scoreString(), "b");
      assert.equal(dg.description(), "c");
      assert.equal(dg.eco(), "d");
    });
  });

  describe("MyGameEnded", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_GAME_ENDED, ["42"]);
      assert.instanceOf(dg, MyGameEnded);
      assert.equal(dg.id, DG.MY_GAME_ENDED);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("ExaminedGameIsGone", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.EXAMINED_GAME_IS_GONE, ["42"]);
      assert.instanceOf(dg, ExaminedGameIsGone);
      assert.equal(dg.id, DG.EXAMINED_GAME_IS_GONE);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("StopObserving", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.STOP_OBSERVING, ["42"]);
      assert.instanceOf(dg, StopObserving);
      assert.equal(dg.id, DG.STOP_OBSERVING);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("MyRelationToGame", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_RELATION_TO_GAME, ["42", "X"]);
      assert.instanceOf(dg, MyRelationToGame);
      assert.equal(dg.id, DG.MY_RELATION_TO_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.isTrue(dg.isLeaving());
      assert.isFalse(dg.isPlaying());
      assert.isFalse(dg.isPlayingSimul());
      assert.isFalse(dg.isObserving());
    });
  });

  describe("TourneyGameStarted", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.TOURNEY_GAME_STARTED, ["foobar", "black-user", "white-user", "g42", "42"]);
      assert.instanceOf(dg, TourneyGameStarted);
      assert.equal(dg.id, DG.TOURNEY_GAME_STARTED);
      assert.equal(dg.eventLabel(), "foobar");
      assert.equal(dg.black(), "black-user");
      assert.equal(dg.white(), "white-user");
      assert.equal(dg.gameId(), "g42");
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("TourneyGameEnded", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.TOURNEY_GAME_ENDED, ["foobar", "black-user", "white-user", "g42", "42"]);
      assert.instanceOf(dg, TourneyGameEnded);
      assert.equal(dg.id, DG.TOURNEY_GAME_ENDED);
      assert.equal(dg.eventLabel(), "foobar");
      assert.equal(dg.black(), "black-user");
      assert.equal(dg.white(), "white-user");
      assert.equal(dg.gameId(), "g42");
      assert.equal(dg.scoreString(), "42");
    });
  });

  describe("PositionBegin", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.POSITION_BEGIN, ["42", "fen-string", "42"]);
      assert.instanceOf(dg, PositionBegin);
      assert.equal(dg.id, DG.POSITION_BEGIN);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.initialFen(), "fen-string");
      assert.equal(dg.numberOfMovesToFollow(), 42);
    });
  });

  describe("PositionBegin2", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.POSITION_BEGIN2, ["42", "fen-string", "42"]);
      assert.instanceOf(dg, PositionBegin2);
      assert.equal(dg.id, DG.POSITION_BEGIN2);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.initialFen(), "fen-string");
      assert.equal(dg.numberOfMovesToFollow(), 42);
    });
  });

  describe("SendMoves", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.SEND_MOVES, ["42", "e2e4", "3"]);
      assert.instanceOf(dg, SendMoves);
      assert.equal(dg.id, DG.SEND_MOVES);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.move(), "e2e4");
      assert.equal(dg.variation(), MoveVariation.EXAMINE);
    });
  });

  describe("PastMoves", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.PAST_MOVE, ["42", "e2e4", "3"]);
      assert.instanceOf(dg, PastMoves);
      assert.equal(dg.id, DG.PAST_MOVE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.move(), "e2e4");
      assert.equal(dg.variation(), MoveVariation.EXAMINE);
    });
  });

  describe("IllegalMove", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.ILLEGAL_MOVE, ["42", "e2e4", "foobar"]);
      assert.instanceOf(dg, IllegalMove);
      assert.equal(dg.id, DG.ILLEGAL_MOVE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.move(), "e2e4");
      assert.equal(dg.reason(), "foobar");
    });
  });

  describe("Backward", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.BACKWARD, ["42", "3"]);
      assert.instanceOf(dg, Backward);
      assert.equal(dg.id, DG.BACKWARD);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.count(), 3);
    });
  });

  describe("Takeback", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.TAKEBACK, ["42", "3"]);
      assert.instanceOf(dg, Takeback);
      assert.equal(dg.id, DG.TAKEBACK);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.count(), 3);
    });
  });

  describe("MyTurn", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MY_TURN, ["42"]);
      assert.instanceOf(dg, MyTurn);
      assert.equal(dg.id, DG.MY_TURN);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("DisablePremove", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.DISABLE_PREMOVE, ["42"]);
      assert.instanceOf(dg, DisablePremove);
      assert.equal(dg.id, DG.DISABLE_PREMOVE);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("Flip", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.FLIP, ["42", "0"]);
      assert.instanceOf(dg, Flip);
      assert.equal(dg.id, DG.FLIP);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.flipTo(), Color.WHITE);
    });
  });

  describe("MSec", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MSEC, ["42", "w", "42000", "1", "80", "82"]);
      assert.instanceOf(dg, MSec);
      assert.equal(dg.id, DG.MSEC);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.color(), Color.WHITE);
      assert.equal(dg.timeLeft(), 42000);
      assert.isTrue(dg.run());
      assert.equal(dg.freeTimeToMove(), 80);
      assert.equal(dg.minMoveTime(), 82);
    });
  });

  describe("SetClock", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.SET_CLOCK, ["42", "10", "20"]);
      assert.instanceOf(dg, SetClock);
      assert.equal(dg.id, DG.SET_CLOCK);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.whiteClock(), 10000);
      assert.equal(dg.blackClock(), 20000);
    });
  });

  describe("OffersInMyGame", () => {
    it("all true", () => {
      const dg = createDatagram(DG.OFFERS_IN_MY_GAME, ["42", "1", "1", "1", "1", "1", "1", "1", "1"]);
      assert.instanceOf(dg, OffersInMyGame);
      assert.equal(dg.id, DG.OFFERS_IN_MY_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.isTrue(dg.whiteDraw());
      assert.isTrue(dg.blackDraw());
      assert.isTrue(dg.whiteAdjourn());
      assert.isTrue(dg.blackAdjourn());
      assert.isTrue(dg.whiteAbort());
      assert.isTrue(dg.blackAbort());
      assert.isTrue(dg.whiteTakeback());
      assert.isTrue(dg.blackTakeback());
    });

    it("all false", () => {
      const dg = createDatagram(DG.OFFERS_IN_MY_GAME, ["42", "0", "0", "0", "0", "0", "0", "0", "0"]);
      assert.instanceOf(dg, OffersInMyGame);
      assert.equal(dg.id, DG.OFFERS_IN_MY_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.isFalse(dg.whiteDraw());
      assert.isFalse(dg.blackDraw());
      assert.isFalse(dg.whiteAdjourn());
      assert.isFalse(dg.blackAdjourn());
      assert.isFalse(dg.whiteAbort());
      assert.isFalse(dg.blackAbort());
      assert.isFalse(dg.whiteTakeback());
      assert.isFalse(dg.blackTakeback());
    });
  });

  describe("PlayersInMyGame", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.PLAYERS_IN_MY_GAME, ["42", "some-handle", "some-role", "some-kib"]);
      assert.instanceOf(dg, PlayersInMyGame);
      assert.equal(dg.id, DG.PLAYERS_IN_MY_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.handle(), "some-handle");
      assert.equal(dg.role(), "some-role");
      assert.equal(dg.kib(), "some-kib");
    });
  });

  describe("PoolJoined", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.POOL_JOINED, ["pool-name"]);
      assert.instanceOf(dg, PoolJoined);
      assert.equal(dg.id, DG.POOL_JOINED);
      assert.equal(dg.name(), "pool-name");
    });
  });

  describe("PoolLeft", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.POOL_LEFT, ["pool-name"]);
      assert.instanceOf(dg, PoolLeft);
      assert.equal(dg.id, DG.POOL_LEFT);
      assert.equal(dg.name(), "pool-name");
    });
  });

  describe("Fen", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.FEN, ["42", "some-fen"]);
      assert.instanceOf(dg, Fen);
      assert.equal(dg.id, DG.FEN);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.fen(), "some-fen");
    });
  });

  describe("Refresh", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.REFRESH, ["42"]);
      assert.instanceOf(dg, Refresh);
      assert.equal(dg.id, DG.REFRESH);
      assert.equal(dg.gameNumber(), 42);
    });
  });

  describe("Field", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.FIELD, ["some-user", "some-key", "some-value"]);
      assert.instanceOf(dg, Field);
      assert.equal(dg.id, DG.FIELD);
      assert.equal(dg.username(), "some-user");
      assert.equal(dg.key(), "some-key");
      assert.equal(dg.value(), "some-value");
    });
  });

  describe("Note", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.NOTE, ["some-user", "42", "some-text"]);
      assert.instanceOf(dg, Note);
      assert.equal(dg.id, DG.NOTE);
      assert.equal(dg.username(), "some-user");
      assert.equal(dg.index(), 42);
      assert.equal(dg.text(), "some-text");
    });
  });

  describe("EndProfile", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.END_PROFILE, ["some-user"]);
      assert.instanceOf(dg, EndProfile);
      assert.equal(dg.id, DG.END_PROFILE);
      assert.equal(dg.username(), "some-user");
    });
  });

  describe("Sound", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.SOUND, ["42"]);
      assert.instanceOf(dg, Sound);
      assert.equal(dg.id, DG.SOUND);
      assert.equal(dg.code(), 42);
    });
  });

  describe("Error", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.ERROR, ["42", "english", "some-msg", "http://foobar"]);
      assert.instanceOf(dg, Error);
      assert.equal(dg.id, DG.ERROR);
      assert.equal(dg.code(), 42);
      assert.equal(dg.language(), "english");
      assert.equal(dg.message(), "some-msg");
      assert.equal(dg.url(), "http://foobar");
    });
  });

  describe("Fail", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.FAIL, ["101", "some-msg"]);
      assert.instanceOf(dg, Fail);
      assert.equal(dg.id, DG.FAIL);
      assert.equal(dg.failedCommand(), CN.TELL);
      assert.equal(dg.message(), "some-msg");
    });
  });

  describe("ListItem", () => {
    it("with params", () => {
      const dg = createDatagram(DG.LIST_ITEM, ["param-1", "42", "1", "2", "2020-02-25T12:04:11Z", "1"]);
      assert.instanceOf(dg, ListItem);
      assert.equal(dg.id, DG.LIST_ITEM);
      assert.isTrue(dg.hasParams());
      assert.equal(dg.stringParam(0), "param-1");
      assert.equal(dg.intParam(1), 42);
      assert.equal(dg.boolParam(2), true);
      assert.equal(dg.durationParam(3), 2000);
      assert.equal(dg.timestampParam(4), 1582632251000);
      assert.equal(dg.colorParam(5), Color.WHITE);
    });

    it("without params", () => {
      const dg = createDatagram(DG.LIST_ITEM, []);
      assert.instanceOf(dg, ListItem);
      assert.equal(dg.id, DG.LIST_ITEM);
      assert.isFalse(dg.hasParams());
    });
  });

  describe("ListHead", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.LIST_HEAD, ["some-name", "some-owner"]);
      assert.instanceOf(dg, ListHead);
      assert.equal(dg.id, DG.LIST_HEAD);
      assert.equal(dg.listName(), "some-name");
      assert.equal(dg.listOwner(), "some-owner");
    });
  });

  describe("ListEnd", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.LIST_END, []);
      assert.instanceOf(dg, ListEnd);
      assert.equal(dg.id, DG.LIST_END);
    });
  });

  describe("ListAdded", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.LIST_ADDED, ["some-name", "some-owner", "some-param"]);
      assert.instanceOf(dg, ListAdded);
      assert.equal(dg.id, DG.LIST_ADDED);
      assert.equal(dg.listName(), "some-name");
      assert.equal(dg.listOwner(), "some-owner");
      assert.equal(dg.stringParam(0), "some-param");
    });
  });

  describe("ListRemoved", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.LIST_REMOVED, ["some-name", "some-owner", "some-param"]);
      assert.instanceOf(dg, ListRemoved);
      assert.equal(dg.id, DG.LIST_REMOVED);
      assert.equal(dg.listName(), "some-name");
      assert.equal(dg.listOwner(), "some-owner");
      assert.equal(dg.stringParam(0), "some-param");
    });
  });

  describe("Match", () => {
    it("assigns params correctly", () => {
      const dg = createDatagram(DG.MATCH, [
        "sender-name",
        "1000",
        "1",
        "sh",
        "receiver-name",
        "2000",
        "2",
        "gm",
        "2",
        "rat-cat",
        "1",
        "1",
        "1",
        "10",
        "2",
        "20",
        "1",
        "1",
        "2",
        "3"
      ]);
      assert.instanceOf(dg, Match);
      assert.equal(dg.id, DG.MATCH);
      assert.equal(dg.senderName(), "sender-name");
      assert.equal(dg.senderRating(), 1000);
      assert.equal(dg.senderRatingType(), 1);
      assert.sameMembers(dg.senderTitles(), ["sh"]);
      assert.equal(dg.receiverName(), "receiver-name");
      assert.equal(dg.receiverRating(), 2000);
      assert.equal(dg.receiverRatingType(), 2);
      assert.sameMembers(dg.receiverTitles(), ["gm"]);
      assert.equal(dg.wildNumber(), 2);
      assert.equal(dg.ratingCategoryName(), "rat-cat");
      assert.isTrue(dg.isRated());
      assert.isTrue(dg.isAdjourned());
      assert.equal(dg.senderInitialTime(), 60000);
      assert.equal(dg.senderIncrement(), 10000);
      assert.equal(dg.receiverInitialTime(), 120000);
      assert.equal(dg.receiverIncrement(), 20000);
      assert.equal(dg.requestedColor(), Color.WHITE);
      assert.equal(dg.assessLoss(), 1);
      assert.equal(dg.assessDraw(), 2);
      assert.equal(dg.assessWin(), 3);
    });
  });
});
