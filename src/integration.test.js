"use strict";

const { Socket } = require("net");
const { describe, it } = require("mocha");
const { assert } = require("chai");
const { expectThrowsAsync } = require("./test");
const { Client } = require("./client");
const { GuestCredentials, UserPasswordCredentials } = require("./credentials");
const { Bad, Date, Vars, LoginFailed, WhoAmI } = require("./protocol");

const QUEEN_HOST = "queen.chessclub.com";
const QUEEN_PORT = 5000;

const UNEXISTING_USERNAME = "nodechessclient";

describe("Integration", function() {
  this.timeout(10000);

  describe("queen server", () => {
    it("can login as guest", async () => {
      const client = new Client();
      const login = await client.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());
      assert.instanceOf(login, WhoAmI);
      client.logout();
    });

    it("can fail to login", async () => {
      const client = new Client();
      const credentials = new UserPasswordCredentials(UNEXISTING_USERNAME, "p@s5w0rD");
      const err = await expectThrowsAsync(() => client.login(new Socket(), QUEEN_HOST, QUEEN_PORT, credentials));
      assert.instanceOf(err, LoginFailed);
    });

    it("can reuse client for multiple logins", async () => {
      const client = new Client();

      const login0 = await client.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());
      client.logout();
      const login1 = await client.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());
      client.logout();

      assert.instanceOf(login0, WhoAmI);
      assert.instanceOf(login1, WhoAmI);
    });

    it("can login to multiple accounts", async () => {
      const client0 = new Client();
      const login0 = await client0.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());

      const client1 = new Client();
      const login1 = await client1.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());

      assert.notEqual(login0.username(), login1.username());

      client0.logout();
      client1.logout();
    });

    describe("can interpret command", () => {
      const clientP = newGuestClient();

      it("admin", async () => {
        const client = await clientP;
        const cmd = await client
          .cli()
          .admin("p@s5w0rd")
          .send();
        assert.instanceOf(cmd, Bad); // Guests can't use the command.
      });

      it("date", async () => {
        const client = await clientP;
        const cmd = await client
          .cli()
          .date()
          .send();
        assert.instanceOf(cmd, Date);
      });

      it("me", async () => {
        const client = await clientP;
        const cmd = await client
          .cli()
          .vars()
          .send();
        assert.instanceOf(cmd, Vars);
        assert.isTrue(cmd.isMyVars());
      });

      it("other", async () => {
        const client = await clientP;
        const cmd = await client
          .cli()
          .vars("asido")
          .send();
        assert.instanceOf(cmd, Vars);
        assert.isFalse(cmd.isMyVars());
        assert.equal(cmd.username(), "Asido");
      });

      it("unexisting players", async () => {
        const client = await clientP;
        const cmd = await client
          .cli()
          .vars(UNEXISTING_USERNAME)
          .send();
        assert.isTrue(cmd.notFound());
        assert.instanceOf(cmd, Vars);
      });
    });
  });
});

async function newGuestClient() {
  const client = new Client();
  const login = await client.login(new Socket(), QUEEN_HOST, QUEEN_PORT, new GuestCredentials());
  assert.instanceOf(login, WhoAmI);
  return client;
}
