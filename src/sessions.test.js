const { describe, it } = require("mocha");
const { assert } = require("chai");
const { expectThrowsAsync, testError } = require("./test");
const { Session, Sessions } = require("./sessions");

describe("Sessions", () => {
  it("can be constructed", () => {
    const ss = new Sessions();
    assert.exists(ss);
    assert.isEmpty(ss.inprogress);
  });

  describe("can create", () => {
    it("single session", () => {
      const ss = new Sessions();
      const s = ss.create();
      assert.instanceOf(s, Session);
      assert.equal(Object.keys(ss.inprogress).length, 1);
    });

    it("multiple sessions", () => {
      const ss = new Sessions();
      const s0 = ss.create();
      const s1 = ss.create();
      const s2 = ss.create();
      assert.equal(Object.keys(ss.inprogress).length, 3);
    });
  });

  describe("can resolve session", () => {
    it("without arg", async () => {
      const ss = new Sessions();
      const s = ss.create();
      ss.success(s.id);
      const result = await s.promise;
      assert.isUndefined(result);
    });

    it("with arg", async () => {
      const ss = new Sessions();
      const s = ss.create();
      ss.success(s.id, 42);
      const result = await s.promise;
      assert.equal(result, 42);
    });

    it("all sessions", async () => {
      const ss = new Sessions();

      const s0 = ss.create();
      const s1 = ss.create();
      assert.lengthOf(Object.keys(ss.inprogress), 2);
      ss.success(s0.id, 0);
      assert.lengthOf(Object.keys(ss.inprogress), 1);

      const s2 = ss.create();
      assert.lengthOf(Object.keys(ss.inprogress), 2);
      ss.success(s1.id, 1);
      assert.lengthOf(Object.keys(ss.inprogress), 1);
      ss.success(s2.id, 2);
      assert.lengthOf(Object.keys(ss.inprogress), 0);

      assert.equal(await s0.promise, 0);
      assert.equal(await s1.promise, 1);
      assert.equal(await s2.promise, 2);
    });
  });

  it("can reject session", async () => {
    const ss = new Sessions();
    const s = ss.create();
    ss.error(s.id, testError);
    const err = await expectThrowsAsync(() => s.promise);
    assert.equal(err, testError);
  });

  it("can reject all sessions", async () => {
    const ss = new Sessions();
    const s0 = ss.create();
    const s1 = ss.create();
    const s2 = ss.create();
    ss.errorAll(testError);
    assert.lengthOf(Object.keys(ss.inprogress), 0);
    assert.equal(await expectThrowsAsync(() => s0.promise), testError);
    assert.equal(await expectThrowsAsync(() => s1.promise), testError);
    assert.equal(await expectThrowsAsync(() => s2.promise), testError);
  });
});
