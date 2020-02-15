"use strict";

const { Socket } = require("net");
const { describe, it } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const { Client } = require("./client");
const { GuestCredentials } = require("./credentials");

describe("Client", () => {
  it("can be constructed", () => {
    const client = new Client("localhost", 1234, new GuestCredentials());
    assert.isNotNull(client);
  });

  it("configures and connects socket", () => {
    const socket = {
      setKeepAlive: sinon.spy(),
      setNoDelay: sinon.spy(),
      setEncoding: sinon.spy(),
      connect: sinon.spy(),
      on: sinon.spy()
    };

    const client = new Client("localhost", 1234, new GuestCredentials());
    client.start(socket);

    assert.isTrue(socket.setKeepAlive.calledOnceWith(true));
    assert.isTrue(socket.setNoDelay.calledOnceWith(true));
    assert.isTrue(socket.setEncoding.calledOnceWith("latin1"));
    assert.isTrue(socket.connect.calledOnceWith({ host: "localhost", port: 1234 }));
    assert.isTrue(socket.on.calledTwice);
    assert.isTrue(socket.on.calledWith("data", sinon.match.any));
    assert.isTrue(socket.on.calledWith("error", sinon.match.any));
  });

  it("destroys previous socket before connecting new", () => {
    const oldSocket = {
      destroy: sinon.spy()
    };
    const newSocket = {
      setKeepAlive: sinon.spy(),
      setNoDelay: sinon.spy(),
      setEncoding: sinon.spy(),
      connect: sinon.spy(),
      on: sinon.spy()
    };

    const client = new Client("localhost", 1234, new GuestCredentials());
    client.socket = oldSocket;
    client.start(newSocket);

    assert.isTrue(oldSocket.destroy.calledOnce);
  });
});
