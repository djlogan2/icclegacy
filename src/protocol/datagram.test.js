"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { DG } = require("./id");
const { Param, LoginFailed, WhoAmI } = require("./datagram");

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
});
