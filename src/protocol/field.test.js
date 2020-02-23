"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { Field } = require("./field");

describe("Field", () => {
  it("can format string", () => {
    const p = new Field("foobar");
    assert.equal(p.asString(), "foobar");
  });

  describe("can format string list", () => {
    it("no items", () => {
      const p = new Field("");
      assert.sameMembers(p.asStringList(), []);
    });

    it("single item", () => {
      const p = new Field("one");
      assert.sameMembers(p.asStringList(), ["one"]);
    });

    it("multiple items", () => {
      const p = new Field("one two three");
      assert.sameMembers(p.asStringList(), ["one", "two", "three"]);
    });
  });

  describe("can format bool", () => {
    it("truthy", () => {
      const p = new Field("1");
      assert.equal(p.asBool(), true);
    });

    it("falsy", () => {
      const falsy = ["0", "true", "false"];
      for (let v of falsy) {
        const p = new Field(v);
        assert.equal(p.asBool(), false);
      }
    });
  });

  describe("can format int", () => {
    it("-42", () => {
      const p = new Field("-42");
      assert.equal(p.asInt(), -42);
    });

    it("-1", () => {
      const p = new Field("-1");
      assert.equal(p.asInt(), -1);
    });

    it("0", () => {
      const p = new Field("0");
      assert.equal(p.asInt(), 0);
    });

    it("1", () => {
      const p = new Field("1");
      assert.equal(p.asInt(), 1);
    });

    it("42", () => {
      const p = new Field("42");
      assert.equal(p.asInt(), 42);
    });

    it("invalid is NaN", () => {
      const p = new Field("invalid");
      assert.isNaN(p.asInt());
    });
  });

  describe("can format ms from ms", () => {
    it("0", () => {
      const p = new Field("0");
      assert.equal(p.asMsFromMs(), 0);
    });

    it("1", () => {
      const p = new Field("1");
      assert.equal(p.asMsFromMs(), 1);
    });

    it("42", () => {
      const p = new Field("42");
      assert.equal(p.asMsFromMs(), 42);
    });

    it("invalid is NaN", () => {
      const p = new Field("invalid");
      assert.isNaN(p.asMsFromMs());
    });
  });

  describe("can format ms from seconds", () => {
    it("0", () => {
      const p = new Field("0");
      assert.equal(p.asMsFromSeconds(), 0);
    });

    it("1", () => {
      const p = new Field("1");
      assert.equal(p.asMsFromSeconds(), 1000);
    });

    it("42", () => {
      const p = new Field("42");
      assert.equal(p.asMsFromSeconds(), 42000);
    });

    it("invalid is NaN", () => {
      const p = new Field("invalid");
      assert.isNaN(p.asMsFromSeconds());
    });
  });

  describe("can format ms from minutes", () => {
    it("0", () => {
      const p = new Field("0");
      assert.equal(p.asMsFromMinutes(), 0);
    });

    it("1", () => {
      const p = new Field("1");
      assert.equal(p.asMsFromMinutes(), 60000);
    });

    it("42", () => {
      const p = new Field("42");
      assert.equal(p.asMsFromMinutes(), 2520000);
    });

    it("invalid is NaN", () => {
      const p = new Field("invalid");
      assert.isNaN(p.asMsFromMinutes());
    });
  });

  describe("can format color", () => {
    it("white", () => {
      const p = new Field("1");
      assert.equal(p.asColor(), "w");
    });

    it("black", () => {
      const falsy = ["b", "black", "white"];
      for (let v of falsy) {
        const p = new Field(v);
        assert.equal(p.asColor(), "b");
      }
    });

    it("none", () => {
      const p = new Field("-1");
      assert.isNull(p.asColor());
    });
  });
});
