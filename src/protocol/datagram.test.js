"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { DG } = require("./id");
const { Param, LoginFailed, PersonalTell, PersonalTellEcho, WhoAmI } = require("./datagram");
const { TellType } = require("./const");

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
});
