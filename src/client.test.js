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
  describe("login", () => {
    it("configures socket", async () => {
      const socket = mockSocket();
      const client = new Client();
      client.login(socket, "localhost", 1234, new GuestCredentials());

      assert.isTrue(socket.setKeepAlive.calledOnceWith(true));
      assert.isTrue(socket.setNoDelay.calledOnceWith(true));
      assert.isTrue(socket.setEncoding.calledOnceWith("latin1"));
      assert.isTrue(socket.on.calledTwice);
      assert.isTrue(socket.on.calledWith("data", sinon.match.any));
      assert.isTrue(socket.on.calledWith("error", sinon.match.any));
    });

    it("connects to server", () => {
      const socket = mockSocket();
      const client = new Client();
      client.login(socket, "localhost", 1234, new GuestCredentials());
      socket.connect.calledOnceWith({ host: "localhost", port: 1234 });
    });

    it("sets state to connecting", () => {
      const socket = mockSocket();
      const client = new Client();
      client.login(socket, "localhost", 1234, new GuestCredentials());
      assert.equal(client.state.currentState, STATE_CONNECTING);
    });

    it("logs out previous session before starting new", async () => {
      const socket = mockSocket();
      const client = await newOnlineClient(socket);
      client.logout = sinon.stub().callsFake(() => {
        client.state.transition(STATE_OFFLINE);
        return Promise.resolve();
      });
      client.login(socket, "localhost", 1234, new GuestCredentials());
      assert.equal(client.logout.callCount, 1);
    });
  });

  it("sends data to login prompt", () => {
    const client = new Client();
    client.socket = mockSocket();

    client.state.transition(STATE_CONNECTING);
    client.credentials = new GuestCredentials();

    handleLoginPrompt(client);
    assert.equal(client.socket.write.callCount, 3);
    assert.sameMembers(client.socket.write.getCall(0).args, ["level1=5\n"]);
    assert.sameMembers(client.socket.write.getCall(1).args, [
      "level2settings=100000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000\n"
    ]);
    assert.sameMembers(client.socket.write.getCall(2).args, ["guest\n"]);
  });

  it("logout resets client state to initial", async () => {
    const client = await newOnlineClient(mockSocket());
    client.protocol = { reset: sinon.spy() };
    client.logout();
    assert.isNull(client.whoAmI);
    assert.isTrue(client.protocol.reset.calledOnce);
    assert.equal(client.state.currentState, STATE_OFFLINE);
  });

  it("logs out on socket error", async () => {
    const socket = mockSocket();
    const client = await newOnlineClient(socket);
    client.logout = sinon.spy();

    const errCall = socket.on.getCall(1);
    assert.isTrue(errCall.calledWith("error", sinon.match.any));
    errCall.args[1](new Error()); // trigger registered error callback

    assert.equal(client.logout.callCount, 1);
  });

  it("can transition to logged in state", async () => {
    const client = await newOnlineClient(mockSocket());
    assert.exists(client.whoAmI);
    assert.isTrue(client.state.currentState.loggedIn);
  });

  describe("onDatagram", () => {
    it("adds listener and enables datagram", () => {
      const client = new Client();
      assert.isUndefined(client.datagramEvents[DG.UNUSED_54]);
      assert.equal(client.enabledDatagrams[DG.UNUSED_54], "0");

      client.onDatagram(DG.UNUSED_54, () => {});
      assert.isDefined(client.datagramEvents[DG.UNUSED_54]);
      assert.equal(client.enabledDatagrams[DG.UNUSED_54], "1");
    });

    it("sends set-2 when logged in", async () => {
      const client = await newOnlineClient(mockSocket());
      client.set2 = sinon.spy();
      client.onDatagram(DG.UNUSED_54, () => {});
      assert.equal(client.set2.callCount, 1);
      assert.sameMembers(client.set2.getCall(0).args, [DG.UNUSED_54, true]);
    });
  });

  describe("send", () => {
    it("is noop when inactive", () => {
      const client = new Client();
      client.socket = mockSocket();
      client.send("foobar");
      assert.equal(client.socket.write.callCount, 0);
    });

    it("does not set tag when logging in", () => {
      const client = new Client();
      client.socket = mockSocket();
      client.state.transition(STATE_CONNECTING);
      client.send("foobar");
      assert.isTrue(client.socket.write.calledOnceWith("foobar\n"));
    });

    it("sets session tag when logged in", async () => {
      const client = await newOnlineClient(mockSocket());
      client.socket = { write: sinon.spy() };
      client.send("foobar");
      assert.isTrue(client.socket.write.calledOnceWith("`s0`foobar\n"));
    });
  });

  describe("set2", () => {
    it("formats enable command", async () => {
      const client = new Client();
      client.send = sinon.spy();
      await client.set2(DG.UNUSED_54, true);
      assert.isTrue(client.send.calledOnceWith("set-2 54 1"));
    });

    it("formats disable command", async () => {
      const client = new Client();
      client.send = sinon.spy();
      await client.set2(DG.UNUSED_54, false);
      assert.isTrue(client.send.calledOnceWith("set-2 54 0"));
    });
  });

  describe("can format command", () => {
    it("admin", async () => {
      const client = new Client();
      client.send = sinon.spy();
      await client.admin("p@s5w0rd");
      assert.isTrue(client.send.calledOnceWith("admin p@s5w0rd"));
    });

    it("date", async () => {
      const client = new Client();
      client.send = sinon.spy();
      await client.date();
      assert.isTrue(client.send.calledOnceWith("date"));
    });

    describe("vars", () => {
      it("without player", async () => {
        const client = new Client();
        client.send = sinon.spy();
        await client.vars();
        assert.isTrue(client.send.calledOnceWith("vars"));
      });

      it("with player", async () => {
        const client = new Client();
        client.send = sinon.spy();
        await client.vars("test-user");
        assert.isTrue(client.send.calledOnceWith("vars test-user"));
      });
    });
  });
});

async function newOnlineClient(socket) {
  if (!(socket instanceof Object)) throw new Error("socket");

  const client = new Client();
  const promise = client.login(socket, "localhost", 1234, new GuestCredentials());

  handleLoginPrompt(client);
  handleDatagram(client, new WhoAmI(DG.WHO_AM_I, ["test-user", "gm sh"]));

  // Must be resolved already.
  await promise;

  assert.isTrue(client.state.currentState.loggedIn);
  return client;
}

function mockSocket() {
  return {
    connect: sinon.spy(),
    destroy: sinon.spy(),
    on: sinon.spy(),
    setKeepAlive: sinon.spy(),
    setNoDelay: sinon.spy(),
    setEncoding: sinon.spy(),
    write: sinon.spy()
  };
}
