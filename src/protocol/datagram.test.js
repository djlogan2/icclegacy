"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { DG } = require("./id");
const { Arrow, ChannelTell, ChannelQTell, Circle, Kibitz, LoginFailed, PersonalTell, PersonalTellEcho, PersonalQTell, UnArrow, WhoAmI } = require("./datagram");
const { KibitzType, TellType } = require("./const");

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
});
