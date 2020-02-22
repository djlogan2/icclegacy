"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { INVALID_GAME_ID, Command, Meta, Date, IllegalMove, Finger, List, Minus, Observe, Pgn, Plus, createCommand } = require("./command");
const { CN } = require("./id");

const testMeta = new Meta(999, "test", null);

describe("Command", () => {
  describe("Minus", () => {
    it("interprets real server output correctly", () => {
      const cmd = new Minus(testMeta, `Removing "player93248" from the list.`, null);
      assert.isTrue(cmd.success());
    });

    it("ignores new lines", () => {
      const tests = ["Removed player93248.\r\n", "Removed player93248.\r", "Removed player93248.\n", "Removed player93248."];
      for (let t of tests) {
        const cmd = new Minus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("allows multi-word args", () => {
      const cmd = new Minus(testMeta, "Removed some player9843.", null);
      assert.isTrue(cmd.success());
    });

    it("fails with invalid content", () => {
      const cmd = new Minus(testMeta, "Some random text.", null);
      assert.isFalse(cmd.success());
    });
  });

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

  describe("Plus", () => {
    it("interprets real server output correctly", () => {
      const tests = ["You have been added to player234's simul list.", "added to player98324 list"];
      for (let t of tests) {
        const cmd = new Plus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("ignores new lines", () => {
      const tests = ["player93248 added.\r\n", "player93248 added.\r", "player93248 added.\n", "player93248 added."];
      for (let t of tests) {
        const cmd = new Plus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("allows multi-word args", () => {
      const cmd = new Plus(testMeta, "some player9843 added.", null);
      assert.isTrue(cmd.success());
    });

    it("fails with invalid content", () => {
      const cmd = new Plus(testMeta, "Some random text.", null);
      assert.isFalse(cmd.success());
    });
  });

  describe("Command factory can create", () => {
    it("S_UNKNOWN", () => {
      const cmd = createCommand(new Meta(CN.S_UNKNOWN, "test"), "");
      assert.instanceOf(cmd, Command);
    });

    it("DATE", () => {
      const cmd = createCommand(new Meta(CN.DATE, "test"), "");
      assert.instanceOf(cmd, Date);
    });

    it("FINGER", () => {
      const cmd = createCommand(new Meta(CN.FINGER, "test"), "");
      assert.instanceOf(cmd, Finger);
    });

    it("LIST", () => {
      const cmd = createCommand(new Meta(CN.LIST, "test"), "");
      assert.instanceOf(cmd, List);
    });

    it("MINUS", () => {
      const cmd = createCommand(new Meta(CN.MINUS, "test"), "");
      assert.instanceOf(cmd, Minus);
    });

    it("OBSERVE", () => {
      const cmd = createCommand(new Meta(CN.OBSERVE, "test"), "");
      assert.instanceOf(cmd, Observe);
    });

    it("PGN", () => {
      const cmd = createCommand(new Meta(CN.PGN, "test"), "");
      assert.instanceOf(cmd, Pgn);
    });

    it("PLUS", () => {
      const cmd = createCommand(new Meta(CN.PLUS, "test"), "");
      assert.instanceOf(cmd, Plus);
    });

    it("S_ILLEGAL_MOVE", () => {
      const cmd = createCommand(new Meta(CN.S_ILLEGAL_MOVE, "test"), "");
      assert.instanceOf(cmd, IllegalMove);
    });
  });
});
