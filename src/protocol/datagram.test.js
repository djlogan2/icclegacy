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
  WhoAmI
} = require("./datagram");
const { KibitzType, MarkerBrush, MarkerType, TellType, Wild } = require("./const");

describe("Datagram", () => {
  describe("WhoAmI", () => {
    it("assigns params correctly", () => {
      const dg = new WhoAmI(["usr", "gm sh"]);
      assert.equal(dg.id, DG.WHO_AM_I);
      assert.equal(dg.username(), "usr");
      assert.sameMembers(dg.titles(), ["gm", "sh"]);
    });
  });

  describe("LoginFailed", () => {
    it("assigns params correctly", () => {
      const dg = new LoginFailed(["42", "test reason"]);
      assert.equal(dg.id, DG.LOGIN_FAILED);
      assert.equal(dg.code(), 42);
      assert.equal(dg.reason(), "test reason");
    });
  });

  describe("PersonalTell", () => {
    it("assigns params correctly", () => {
      const dg = new PersonalTell(["test-user", "gm sh", "bla bla bla", "3"]);
      assert.equal(dg.id, DG.PERSONAL_TELL);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
      assert.equal(dg.tellType(), TellType.QTELL);
    });
  });

  describe("PersonalTellEcho", () => {
    it("assigns params correctly", () => {
      const dg = new PersonalTellEcho(["test-user", "3", "bla bla bla"]);
      assert.equal(dg.id, DG.PERSONAL_TELL_ECHO);
      assert.equal(dg.senderUsername(), "test-user");
      assert.equal(dg.tellType(), TellType.QTELL);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("PersonalQTell", () => {
    it("assigns params correctly", () => {
      const dg = new PersonalQTell(["test-user", "gm sh", "bla bla bla"]);
      assert.equal(dg.id, DG.PERSONAL_QTELL);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("ChannelTell", () => {
    it("assigns params correctly", () => {
      const dg = new ChannelTell(["42", "test-user", "gm sh", "bla bla bla", "1"]);
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
      const dg = new ChannelQTell(["42", "test-user", "gm sh", "bla bla bla"]);
      assert.equal(dg.id, DG.CHANNEL_QTELL);
      assert.equal(dg.channel(), 42);
      assert.equal(dg.senderUsername(), "test-user");
      assert.sameMembers(dg.senderTitles(), ["gm", "sh"]);
      assert.equal(dg.message(), "bla bla bla");
    });
  });

  describe("Kibitz", () => {
    it("assigns params correctly", () => {
      const dg = new Kibitz(["42", "test-user", "gm sh", "1", "bla bla bla"]);
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
      const dg = new Arrow(["42", "test-user", "e2", "e4"]);
      assert.equal(dg.id, DG.ARROW);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.from(), "e2");
      assert.equal(dg.to(), "e4");
    });
  });

  describe("UnArrow", () => {
    it("assigns params correctly", () => {
      const dg = new UnArrow(["42", "test-user", "e2", "e4"]);
      assert.equal(dg.id, DG.UNARROW);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.from(), "e2");
      assert.equal(dg.to(), "e4");
    });
  });

  describe("Circle", () => {
    it("assigns params correctly", () => {
      const dg = new Circle(["42", "test-user", "e2"]);
      assert.equal(dg.id, DG.CIRCLE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.square(), "e2");
    });
  });

  describe("UnCircle", () => {
    it("assigns params correctly", () => {
      const dg = new UnCircle(["42", "test-user", "e2"]);
      assert.equal(dg.id, DG.UNCIRCLE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.examiner(), "test-user");
      assert.equal(dg.square(), "e2");
    });
  });

  describe("BoardInfo", () => {
    it("assigns params correctly", () => {
      const dg = new BoardInfo(["42", "test-user", "5", "e2", "e4", "6"]);
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
      const dg = new GameMessage(["42", "foobar"]);
      assert.equal(dg.id, DG.GAME_MESSAGE);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.message(), "foobar");
    });
  });

  describe("ExaminersInGame", () => {
    it("assigns params correctly", () => {
      const dg = new ExaminersInGame(["42", "test-user", "gm sh", "1"]);
      assert.equal(dg.id, DG.EXAMINERS_IN_GAME);
      assert.equal(dg.gameNumber(), 42);
      assert.equal(dg.username(), "test-user");
      assert.sameMembers(dg.titles(), ["gm", "sh"]);
      assert.isTrue(dg.joined());
    });
  });

  describe("GameStarted", () => {
    it("assigns params correctly", () => {
      const dg = new GameStarted([
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
});
