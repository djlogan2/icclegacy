"use strict";

class Credentials {
  constructor() {
    this.isAnonymous = false;
  }
}

class UserPasswordCredentials extends Credentials {
  constructor(username, password) {
    if (typeof username !== "string") throw new Error("username");
    super();
    this.username = username;
    this.password = password;
  }

  formatLoginString() {
    return this.username + " " + this.password + anonymousString(this.isAnonymous);
  }
}

class GuestCredentials extends Credentials {
  constructor() {
    super();
  }

  formatLoginString() {
    return "guest" + anonymousString(this.isAnonymous);
  }
}

class AccessTokenCredentials extends Credentials {
  constructor(accessToken) {
    if (typeof accessToken !== "string") throw new Error("accessToken");
    super();
    this.accessToken = accessToken;
  }

  formatLoginString() {
    return "iccmd auth_code code=" + this.accessToken;
  }
}

function anonymousString(isAnonymous) {
  return isAnonymous ? "!" : "";
}

module.exports = {
  AccessTokenCredentials,
  GuestCredentials,
  UserPasswordCredentials
};
