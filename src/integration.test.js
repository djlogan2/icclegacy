"use strict";

const { Socket } = require("net");
const { describe, it } = require("mocha");
const { assert } = require("chai");
const { Client } = require("./client");
const { GuestCredentials } = require("./credentials");
const { DG } = require("./protocol");

describe("Integration", () => {
  it("can login to queen", done => {
    const client = new Client("queen.chessclub.com", 5000, new GuestCredentials());
    client.onDatagram(DG.WHO_AM_I, dg => {
      assert.equal(dg.id, DG.WHO_AM_I);
      done();
    });
    client.start(new Socket());
  });
});
