"use strict";

class EventEmitter {
  constructor() {
    this.subscribers = [];
  }

  on(cb) {
    if (typeof cb !== "function") throw new Error("cb");
    this.subscribers.push(cb);
  }

  off(cb) {
    if (typeof cb !== "function") throw new Error("cb");

    const idx = this.subscribers.indexOf(cb);
    if (idx !== -1) {
      this.subscribers.splice(idx, 1);
    }
  }

  emit(...args) {
    for (let sub of this.subscribers) {
      sub(...args);
    }
  }
}

module.exports = { EventEmitter };
