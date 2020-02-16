"use strict";

const { Socket } = require("net");
const { describe, it } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const { Client, handleLoginPrompt, handleDatagram } = require("./client");
const { GuestCredentials } = require("./credentials");
const { DG, LoginFailed, WhoAmI } = require("./protocol");
const { STATE_CONNECTING, STATE_OFFLINE } = require("./state");

describe("Client", () => {
  it("can be constructed", () => {
    const client = new Client("localhost", 1234, new GuestCredentials());
    assert.isNotNull(client);
  });

  describe("start", () => {
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

      const client = newOfflineClient();
      client.socket = oldSocket;
      client.start(newSocket);

      assert.equal(oldSocket.destroy.callCount, 1);
    });
  });

  it("sends data to login prompt", () => {
    const socket = { write: sinon.spy() };
    const client = newOfflineClient();
    client.socket = socket;
    client.state.transition(STATE_CONNECTING);
    handleLoginPrompt(client);
    assert.equal(socket.write.callCount, 3);
    assert.sameMembers(socket.write.getCall(0).args, ["level1=5\n"]);
    assert.sameMembers(socket.write.getCall(1).args, [
      "level2settings=100000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000\n"
    ]);
    assert.sameMembers(socket.write.getCall(2).args, ["guest\n"]);
  });

  it("stop resets client state to initial", () => {
    const client = newOnlineClient();
    client.socket = { destroy: () => {} };
    client.protocol = { reset: sinon.spy() };
    client.stop();
    assert.isNull(client.whoAmI);
    assert.isTrue(client.protocol.reset.calledOnce);
    assert.equal(client.state.currentState, STATE_OFFLINE);
  });

  it("stops on socket error", () => {
    const socket = {
      setKeepAlive: sinon.spy(),
      setNoDelay: sinon.spy(),
      setEncoding: sinon.spy(),
      connect: sinon.spy(),
      destroy: sinon.spy(),
      on: sinon.spy()
    };
    const client = newOfflineClient();
    client.stop = sinon.spy();
    client.start(socket);

    const errCall = socket.on.getCall(1);
    assert.isTrue(errCall.calledWith("error", sinon.match.any));
    errCall.args[1](new Error()); // trigger registered error callback

    assert.equal(client.stop.callCount, 1);
  });

  it("stops on failed login", () => {
    const client = newOfflineClient();
    client.stop = sinon.spy();
    client.state.transition(STATE_CONNECTING);
    handleDatagram(client, new LoginFailed([]));
    assert.equal(client.stop.callCount, 1);
  });

  it("can transition to logged in state", () => {
    const client = newOnlineClient();
    assert.isNotNull(client.whoAmI);
    assert.isTrue(client.state.currentState.loggedIn);
  });

  describe("onDatagram", () => {
    it("adds listener and enables datagram", () => {
      const client = newOfflineClient();
      assert.isUndefined(client.datagramEvents[DG.UNUSED_54]);
      assert.equal(client.enabledDatagrams[DG.UNUSED_54], "0");

      client.onDatagram(DG.UNUSED_54, () => {});
      assert.isDefined(client.datagramEvents[DG.UNUSED_54]);
      assert.equal(client.enabledDatagrams[DG.UNUSED_54], "1");
    });

    it("sends set-2 when logged in", () => {
      const client = newOnlineClient();
      client.set2 = sinon.spy();
      client.onDatagram(DG.UNUSED_54, () => {});
      assert.equal(client.set2.callCount, 1);
      assert.sameMembers(client.set2.getCall(0).args, [DG.UNUSED_54, true]);
    });
  });

  describe("send", () => {
    it("is noop when inactive", () => {
      const client = newOfflineClient();
      client.socket = { write: sinon.spy() };
      client.send("foobar");
      assert.equal(client.socket.write.callCount, 0);
    });

    it("write given command as is when connecting", () => {
      const client = newOfflineClient();
      client.state.transition(STATE_CONNECTING);
      client.socket = { write: sinon.spy() };
      client.send("foobar");
      assert.isTrue(client.socket.write.calledOnceWith("foobar\n"));
    });

    it("adds logged user tag when nothing given", () => {
      const client = newOnlineClient();
      client.socket = { write: sinon.spy() };
      client.send("foobar");
      assert.isTrue(client.socket.write.calledOnceWith("`test-user`foobar\n"));
    });

    it("uses given tag", () => {
      const client = newOnlineClient();
      client.socket = { write: sinon.spy() };
      client.send("foobar", "custom-tag");
      assert.isTrue(client.socket.write.calledOnceWith("`custom-tag`foobar\n"));
    });

    it("throws when tag does not start with letter", () => {
      const client = newOnlineClient();
      for (let l of ["0", "9", "@", "["]) {
        assert.throws(() => client.send("foobar", l + "tag"));
      }
    });
  });

  describe("set2", () => {
    it("formats enable command", () => {
      const client = newOfflineClient();
      client.send = sinon.spy();
      client.set2(DG.UNUSED_54, true);
      assert.isTrue(client.send.calledOnceWith("set-2 54 1"));
    });

    it("formats disable command", () => {
      const client = newOfflineClient();
      client.send = sinon.spy();
      client.set2(DG.UNUSED_54, false);
      assert.isTrue(client.send.calledOnceWith("set-2 54 0"));
    });
  });
});

function newOfflineClient() {
  return new Client("localhost", 1234, new GuestCredentials());
}

function newOnlineClient() {
  const client = new Client("localhost", 1234, new GuestCredentials());
  client.socket = { write: () => {} };
  client.state.transition(STATE_CONNECTING);
  handleLoginPrompt(client);
  handleDatagram(client, new WhoAmI(["test-user", "gm sh"]));
  return client;
}
