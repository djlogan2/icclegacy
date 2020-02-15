"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { createCommand, Command, Meta, Observe, INVALID_GAME_ID } = require("./command");
const { CN } = require("./id");

const testMeta = new Meta(999, "test", null);

describe("Command", () => {
  describe("Observe", () => {
    it("parses game id", () => {
      const cmd = new Observe(testMeta, "You are now observing game 657.\r\n", null);
      assert.equal(cmd.gameId, "657");
    });

    it("game id is invalid on parse error", () => {
      const cmd = new Observe(testMeta, "1nv@lId 5tr1ng", null);
      assert.equal(cmd.gameId, INVALID_GAME_ID);
    });
  });

  describe("Command factory", () => {
    it("can create generic command", () => {
      const cmd = createCommand(new Meta(CN.S_UNKNOWN, "test"), "");
      assert.instanceOf(cmd, Command);
    });

    it("can create observe", () => {
      const cmd = createCommand(new Meta(CN.OBSERVE, "test"), "");
      assert.instanceOf(cmd, Observe);
    });
  });
});
