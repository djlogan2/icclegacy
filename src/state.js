"use strict";

const { EventEmitter } = require("./event");

const OFFLINE = "Offline";
const CONNECTING = "Connecting";
const LOGIN_PROMPT = "Login prompt";
const LOGIN_SENT = "Logging in";
const LOGGED_IN = "Logged in";

const STATE_OFFLINE = Object.freeze({
  name: OFFLINE,
  transitions: [CONNECTING],

  active: false,
  transient: false,
  connected: false,
  waitingForLoginPrompt: false,
  waitingForAuthentication: false,
  loggedIn: false
});

const STATE_CONNECTING = Object.freeze({
  name: CONNECTING,
  transitions: [OFFLINE, LOGIN_PROMPT],

  active: true,
  transient: true,
  connected: false,
  waitingForLoginPrompt: false,
  waitingForAuthentication: false,
  loggedIn: false
});

const STATE_LOGIN_PROMPT = Object.freeze({
  name: LOGIN_PROMPT,
  transitions: [OFFLINE, LOGIN_SENT],

  active: true,
  transient: true,
  connected: true,
  waitingForLoginPrompt: true,
  waitingForAuthentication: false,
  loggedIn: false
});

const STATE_LOGIN_SENT = Object.freeze({
  name: LOGIN_SENT,
  transitions: [OFFLINE, LOGGED_IN],

  active: true,
  transient: true,
  connected: true,
  waitingForLoginPrompt: false,
  waitingForAuthentication: true,
  loggedIn: false
});

const STATE_LOGGED_IN = Object.freeze({
  name: LOGGED_IN,
  transitions: [OFFLINE],

  active: true,
  transient: false,
  connected: true,
  waitingForLoginPrompt: false,
  waitingForAuthentication: false,
  loggedIn: true
});

class StateMachine {
  constructor() {
    this.currentState = STATE_OFFLINE;
    this.onStateChange = new EventEmitter();
  }

  transition(toState) {
    if (!(toState instanceof Object)) throw new Error("toState");

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
  STATE_LOGIN_PROMPT,
  STATE_LOGIN_SENT,
  STATE_LOGGED_IN,
  StateMachine
};
