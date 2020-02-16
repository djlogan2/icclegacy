"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const { EventEmitter } = require("./event");

describe("EventEmitter", () => {
  it("can add subscriber", () => {
    const e = new EventEmitter();
    e.on(() => {});
    assert.lengthOf(e.subscribers, 1);
  });

  it("can add duplicate subscribers", () => {
    const cb = () => {};
    const e = new EventEmitter();
    e.on(cb);
    e.on(cb);
    assert.lengthOf(e.subscribers, 2);
  });

  it("remove is noop when empty", () => {
    const e = new EventEmitter();
    e.off(() => {});
  });

  it("can remove subscriber", () => {
    const cb = () => {};
    const e = new EventEmitter();
    e.on(cb);
    assert.lengthOf(e.subscribers, 1);
    e.off(cb);
    assert.lengthOf(e.subscribers, 0);
  });

  it("can remove duplicate subscribers", () => {
    const cb = () => {};
    const e = new EventEmitter();
    e.on(cb);
    e.on(cb);
    assert.lengthOf(e.subscribers, 2);
    e.off(cb);
    assert.lengthOf(e.subscribers, 1);
    e.off(cb);
    assert.lengthOf(e.subscribers, 0);
  });

  it("remove not existing subscriber is noop", () => {
    const e = new EventEmitter();
    e.on(() => {});
    e.off(() => {});
    assert.lengthOf(e.subscribers, 1);
  });

  it("can emit when empty", () => {
    const e = new EventEmitter();
    e.emit();
  });

  it("emit calls single subscriber", () => {
    const spy = sinon.spy();
    const e = new EventEmitter();
    e.on(spy);
    e.emit();
    assert.isTrue(spy.calledOnceWith());
  });

  it("emit calls multiple subscribers", () => {
    const spy0 = sinon.spy();
    const spy1 = sinon.spy();
    const e = new EventEmitter();
    e.on(spy0);
    e.on(spy1);
    e.emit();
    assert.isTrue(spy0.calledOnceWith());
    assert.isTrue(spy1.calledOnceWith());
  });

  it("emit passes arguments", () => {
    const spy = sinon.spy();
    const e = new EventEmitter();
    e.on(spy);
    e.emit("foobar", 42);
    assert.isTrue(spy.calledOnceWith("foobar", 42));
  });

  it("emit calls multiple subscribers multiple times with different arguments", () => {
    const spy0 = sinon.spy();
    const spy1 = sinon.spy();
    const e = new EventEmitter();
    e.on(spy0);
    e.on(spy1);
    e.emit("first", 1);
    e.emit("second", 2);
    assert.isTrue(spy0.calledTwice);
    assert.isTrue(spy0.calledWith("first", 1));
    assert.isTrue(spy0.calledWith("second", 2));
    assert.isTrue(spy1.calledTwice);
    assert.isTrue(spy1.calledWith("first", 1));
    assert.isTrue(spy1.calledWith("second", 2));
  });

  it("emit does not call when unsubscribed", () => {
    const spy0 = sinon.spy();
    const spy1 = sinon.spy();
    const e = new EventEmitter();
    e.on(spy0);
    e.on(spy1);
    e.off(spy0);
    e.emit();
    assert.isTrue(spy0.notCalled);
    assert.isTrue(spy1.calledOnce);
  });
});
