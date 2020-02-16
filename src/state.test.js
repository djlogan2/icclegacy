"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const { STATE_CONNECTING, STATE_AUTHENTICATING, STATE_OFFLINE, STATE_LOGGED_IN, StateMachine } = require("./state");

describe("StateMachine", () => {
  it("starts offline", () => {
    const state = new StateMachine();
    assert.equal(state.currentState, STATE_OFFLINE);
  });

  it("can transition", () => {
    const state = new StateMachine();
    state.transition(STATE_CONNECTING);
    assert.equal(state.currentState, STATE_CONNECTING);
  });

  it("can transition from beginning to the end", () => {
    const state = new StateMachine();
    const transitions = [STATE_CONNECTING, STATE_AUTHENTICATING, STATE_LOGGED_IN];
    for (let t of transitions) {
      state.transition(t);
      assert.equal(state.currentState, t);
    }
  });

  it("throws on state bypass", () => {
    const state = new StateMachine();
    assert.throws(() => state.transition(STATE_LOGGED_IN));
    assert.equal(state.currentState, STATE_OFFLINE);
  });

  it("transition to current state is noop", () => {
    const spy = sinon.spy();
    const state = new StateMachine();
    state.onStateChange.on(spy);
    state.transition(STATE_OFFLINE);
    assert.equal(state.currentState, STATE_OFFLINE);
    assert.isTrue(spy.notCalled);
  });

  it("emits on state change", () => {
    const spy = sinon.spy();
    const state = new StateMachine();
    state.onStateChange.on(spy);
    state.transition(STATE_CONNECTING);
    assert.isTrue(spy.calledOnceWith(STATE_OFFLINE, STATE_CONNECTING));
  });
});
