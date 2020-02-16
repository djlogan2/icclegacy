"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { STATE_CONNECTING, STATE_LOGIN_PROMPT, STATE_LOGIN_SENT, STATE_OFFLINE, STATE_LOGGED_IN, StateMachine } = require("./state");

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

  it("can transition from offline to logged in", () => {
    const state = new StateMachine();
    const transitions = [STATE_CONNECTING, STATE_LOGIN_PROMPT, STATE_LOGIN_SENT, STATE_LOGGED_IN];
    for (let t of transitions) {
      state.transition(t);
      assert.equal(state.currentState, t);
    }
  });

  it("throws on required state bypass", () => {
    const state = new StateMachine();
    assert.throws(() => state.transition(STATE_LOGGED_IN));
    assert.equal(state.currentState, STATE_OFFLINE);
  });
});
