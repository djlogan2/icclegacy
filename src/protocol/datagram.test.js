"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { DG } = require("./id");
const {
  Arrow,
  BoardInfo,
  ChannelTell,
  ChannelQTell,
  Circle,
  ExaminedGameIsGone,
  ExaminersInGame,
  GameMessage,
  GameResult,
  GameStarted,
  IllegalMove,
  Kibitz,
  LoginFailed,
  MyGameChanged,
  MyGameEnded,
  MyGameResult,
  MyGameStarted,
  MyRelationToGame,
  PastMoves,
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
} = require("./datagram");
const { KibitzType, MarkerBrush, MarkerType, MoveVariation, TellType, Wild } = require("./const");

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
});
