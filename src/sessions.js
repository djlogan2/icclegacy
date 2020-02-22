class Session {
  constructor(id) {
    if (typeof id !== "string") throw new Error("id");

    this.id = id;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const ID_PREFIX = "s";

class Sessions {
  static currentID = 0;

  constructor() {
    this.inprogress = {};
  }

  create() {
    const id = ID_PREFIX + Sessions.currentID++;
    const session = new Session(id);
    this.inprogress[id] = session;
    return session;
  }

  success(id, value) {
    if (typeof id !== "string") throw new Error("id");

    const session = this.inprogress[id];
    if (session) {
      delete this.inprogress[id];
      session.resolve(value);
    }
  }

  error(id, err) {
    if (typeof id !== "string") throw new Error("id");
    if (!err) throw new Error("err");

    const session = this.inprogress[id];
    if (session) {
      delete this.inprogress[id];
      session.reject(err);
    }
  }

  errorAll(err) {
    if (!err) throw new Error("err");

    for (let id in this.inprogress) {
      this.error(id, err);
    }
  }
}

module.exports = { Session, Sessions };
