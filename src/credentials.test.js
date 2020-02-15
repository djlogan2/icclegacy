"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { AccessTokenCredentials, GuestCredentials, UserPasswordCredentials } = require("./credentials");

describe("Credentials", () => {
  describe("AccessTokenCredentials", () => {
    it("formats correct login string", () => {
      const credentials = new AccessTokenCredentials("test-access-token");
      assert.equal(credentials.formatLoginString(), "iccmd auth_code code=test-access-token");
    });

    it("cannot login anonymously", () => {
      const credentials = new AccessTokenCredentials("test-access-token");
      credentials.isAnonymous = true;
      assert.equal(credentials.formatLoginString(), "iccmd auth_code code=test-access-token");
    });
  });

  describe("GuestCredentials", () => {
    it("formats correct login string", () => {
      const credentials = new GuestCredentials();
      assert.equal(credentials.formatLoginString(), "guest");
    });

    it("can login anonymously", () => {
      const credentials = new GuestCredentials();
      credentials.isAnonymous = true;
      assert.equal(credentials.formatLoginString(), "guest!");
    });
  });

  describe("UserPasswordCredentials", () => {
    it("formats correct login string", () => {
      const credentials = new UserPasswordCredentials("usr", "psw");
      assert.equal(credentials.formatLoginString(), "usr psw");
    });

    it("can login anonymously", () => {
      const credentials = new UserPasswordCredentials("usr", "psw");
      credentials.isAnonymous = true;
      assert.equal(credentials.formatLoginString(), "usr psw!");
    });
  });
});
