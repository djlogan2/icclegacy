"use strict";

const { EventEmitter } = require("./event");

const OFFLINE = "Offline";
const CONNECTING = "Connecting";
const AUTHENTICATING = "Authenticating";
const LOGGED_IN = "Logged in";

const STATE_OFFLINE = Object.freeze({
  name: OFFLINE,
  transitions: [CONNECTING],

  active: false,
  transient: false,
  connected: false,
  authenticating: false,
  loggedIn: false
});

const STATE_CONNECTING = Object.freeze({
  name: CONNECTING,
  transitions: [OFFLINE, AUTHENTICATING],

  active: true,
  transient: true,
  connected: false,
  authenticating: false,
  loggedIn: false
});

const STATE_AUTHENTICATING = Object.freeze({
  name: AUTHENTICATING,
  transitions: [OFFLINE, LOGGED_IN],

  active: true,
  transient: true,
  connected: true,
  authenticating: true,
  loggedIn: false
});

const STATE_LOGGED_IN = Object.freeze({
  name: LOGGED_IN,
  transitions: [OFFLINE],

  active: true,
  transient: false,
  connected: true,
  authenticating: false,
  loggedIn: true
});

class StateMachine {
  constructor() {
    this.currentState = STATE_OFFLINE;
    this.onStateChange = new EventEmitter();
  }

  transition(toState) {
    if (!(toState instanceof Object)) throw new Error("toState");

    if (this.currentState === toState) {
      return;
    }

    if (this.currentState.transitions.indexOf(toState.name) === -1) {
      throw new Error(`Invalid transition ${this.currentState.name} => ${toState.name}`);
    }

    const fromState = this.currentState;
    this.currentState = toState;
    this.onStateChange.emit(fromState, toState);
  }
}

module.exports = {
  STATE_OFFLINE,
  STATE_CONNECTING,
  STATE_AUTHENTICATING,
  STATE_LOGGED_IN,
  StateMachine
};
