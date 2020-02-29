"use strict";

const { DateTime } = require("luxon");
const { SERVER_TIMEZONE, Color } = require("./const");

class Param {
  constructor(value) {
    if (typeof value !== "string") throw new Error("value");
    this.value = value;
  }

  asString() {
    return this.value;
  }

  asStringList() {
    return /^\s*$/.test(this.value) ? [] : this.value.split(" ");
  }

  asBool() {
    return this.value === "1";
  }

  asInt() {
    return parseInt(this.value);
  }

  asMsFromMs() {
    return this.asInt();
  }

  asMsFromSeconds() {
    return this.asInt() * 1000;
  }

  asMsFromMinutes() {
    return this.asInt() * 1000 * 60;
  }

  asEpochFromISO8601() {
    return DateTime.fromISO(this.asString(), { zone: SERVER_TIMEZONE }).toMillis();
  }

  asColor() {
    return this.value === "-1" ? null : this.value === "1" ? Color.WHITE : Color.BLACK;
  }
}

module.exports = { Param };