const chai = require("chai");
const Legacy = require("../legacy").LegacyICC;

function unexamine(obj, n) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.players = resolve;
  });
  const promise2 = new Promise((resolve, reject) => {
    obj.user2.resolves.players = resolve;
  });

  obj["user" + n].unexamine("unexamine");
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function examine_gone(n, data) {
  this["user" + n].resolves.unexamine(this);
}

function unexamine2(obj, n) {
  const promise = new Promise((resolve, reject) => {
    obj["user" + n].resolves.unexamine = resolve;
  });

  obj["user" + n].unexamine("unexamine");
  return promise;
}

function save_to_library(obj, n, slot) {
  obj["user" + n].libkeepexam("savetolib", "whitename", "blackname", "=", slot);
  return Promise.resolve(obj);
}

function delete_library_game(obj, n, slot) {
  obj["user" + n].libdelete("libdelete", slot);
  return Promise.resolve(obj);
}

function mexamine(obj, n) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.players = resolve;
  });
  let promise2;
  if (!!obj.user2) {
    promise2 = new Promise((resolve, reject) => {
      obj.user2.resolves.players = resolve;
    });
  } else promise2 = Promise.resolve(obj);
  const otherguy = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
  obj["user" + n].mexamine("mex-" + otherguy, otherguy);
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function mexamine2(obj, n) {
  const promise1 = new Promise((resolve, reject) => {
    obj["user" + n].resolves.error = resolve;
  });
  const otherguy = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
  obj["user" + n].mexamine("mex-" + otherguy, otherguy);
  return promise1;
}

function backward_dg(n, data) {
  this["user" + n].resolves.backward(this);
}

function check_move(n, data) {
  if (!!this["user" + n].resolves.move_count)
    this["user" + n].resolves.move_count--;
  if (!this["user" + n].resolves.move_count)
    this["user" + n].resolves.move(this);
}

function make_move(obj, n, move) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.move = resolve;
  });
  let promise2;
  if (!!obj.user2)
    promise2 = new Promise((resolve, reject) => {
      obj.user2.resolves.move = resolve;
    });
  else promise2 = Promise.resolve(obj);
  obj["user" + n].move("move-" + move, move);
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function play_moves(obj, n, moves) {
  return moves.reduce((promiseChain, move) => {
    return promiseChain.then((obj) => {
      return make_move(obj, n, move);
    });
  }, Promise.resolve(obj));
}

function check_players(n, data) {
  if (!!this["user" + n].resolves.players)
    this["user" + n].resolves.players(this);
}

function observe(obj, n) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.players = resolve;
  });
  const promise2 = new Promise((resolve, reject) => {
    obj.user2.resolves.players = resolve;
  });
  const otherguy = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
  obj["user" + n].observe("observe-" + otherguy, otherguy);
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function forward(obj, n, moves) {
  obj.user1.resolves.move_count = moves;
  if (obj.user2) obj.user2.resolves.move_count = moves;
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.move = resolve;
  });
  let promise2;
  if (!!obj.user2)
    promise2 = new Promise((resolve, reject) => {
      obj.user2.resolves.move = resolve;
    });
  else promise2 = Promise.resolve(obj);
  obj["user" + n].forward("forward-" + moves, moves);
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function backward_cmd(obj, n, moves) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.backward = resolve;
  });
  let promise2;
  if (!!obj.user2)
    promise2 = new Promise((resolve, reject) => {
      obj.user2.resolves.backward = resolve;
    });
  else promise2 = Promise.resolve(obj);
  obj["user" + n].backward("backward-" + moves, moves);
  return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function check_game_start(n, data) {
  this["user" + n].resolves.game_started(this);
}

function examine(obj, n, what) {
  const promise = new Promise((resolve, reject) => {
    obj["user" + n].resolves.game_started = resolve;
  });
  obj["user" + n].examine("examine", what);
  return promise;
}

function check_login(n, data) {
  if (n === 2) this["user" + n].resign(null, process.env.USERNAME);
  this["user" + n].resolves.login(this);
}

function error(n, data) {
  if (this["user" + n].resolves.error) {
    this["user" + n].resolves.error(this);
    this["user" + n].resolves.error = undefined;
  } else {
    chai.assert.fail(data);
  }
}

function revert(obj, n) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.backward = resolve;
  });
  obj["user" + n].revert("revert-" + n);
  return promise1;
}

function circle_dg(n, data) {
  this["user" + n].resolves.circle(this);
}
function uncircle_dg(n, data) {
  this["user" + n].resolves.uncircle(this);
}
function arrow_dg(n, data) {
  this["user" + n].resolves.arrow(this);
}
function unarrow_dg(n, data) {
  this["user" + n].resolves.unarrow(this);
}

function circle_cmd(obj, n, sq) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.circle = resolve;
  });
  obj["user" + n].circle("circle-" + n, "e5");
  return promise1;
}

function arrow_cmd(obj, n, sq1, sq2) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.arrow = resolve;
  });
  obj["user" + n].arrow("arrow-" + n, "d1", "e8");
  return promise1;
}

function uncircle_cmd(obj, n, sq) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.uncircle = resolve;
  });
  obj["user" + n].uncircle("uncircle-" + n, "e5");
  return promise1;
}

function unarrow_cmd(obj, n, sq1, sq2) {
  const promise1 = new Promise((resolve, reject) => {
    obj.user1.resolves.unarrow = resolve;
  });
  obj["user" + n].unarrow("arrow-" + n, "d1", "e8");
  return promise1;
}

function login(obj, n, username, password) {
  obj["user" + n] = new Legacy({
    //sendpreprocessor: (data) => log(n, data),
    //preprocessor: (data) => log(n, data),
    username: username,
    password: password,
    host: "queen.chessclub.com",
    loggedin: (data) => check_login.call(obj, n, data),
    my_game_started: (data) => check_game_start.call(obj, n, data),
    players_in_my_game: (data) => check_players.call(obj, n, data),
    my_game_result: (data) => check_result.call(obj, n, data),
    move: (data) => check_move.call(obj, n, data),
    my_game_ended: (data) => examine_gone.call(obj, n, data),
    backward: (data) => backward_dg.call(obj, n, data),
    error: (data) => error.call(obj, n, data),
    circle: (data) => circle_dg.call(obj, n, data),
    uncircle: (data) => uncircle_dg.call(obj, n, data),
    arrow: (data) => arrow_dg.call(obj, n, data),
    unarrow: (data) => unarrow_dg.call(obj, n, data),
  });
  obj["user" + n].resolves = {};
  const promise = new Promise((resolve) => {
    obj["user" + n].resolves.login = resolve;
  });
  obj["user" + n].login();
  return promise;
}

function logout(obj, n) {
  obj["user" + n].logout();
  return Promise.resolve(obj);
}

describe("Examining games", function () {
  this.timeout(60000);
  before(function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => delete_library_game(obj, 1, 10))
      .then((obj) => examine(obj, 1))
      .then((obj) =>
        play_moves(obj, 1, [
          "e4",
          "e5",
          "Nf3",
          "Nc6",
          "Be2",
          "Be7",
          "Nc3",
          "Nf6",
          "d4",
          "d5",
          "Bd2",
          "Bd7",
        ])
      )
      .then((obj) => save_to_library(obj, 1, 10))
      .then((obj) => logout(obj, 1));
  });

  after(function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => delete_library_game(obj, 1, 10))
      .then((obj) => logout(obj, 1));
  });

  it("adds an examiner with mexamine and unexamine correctly", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) =>
        login(obj, 2, process.env.USERNAME2, process.env.PASSWORD2)
      )
      .then((obj) => examine(obj, 1))
      .then((obj) => observe(obj, 2))
      .then((obj) => play_moves(obj, 1, ["e4", "e5", "Nf3", "Nc6", "Be2"]))
      .then((obj) => mexamine(obj, 1, 2))
      .then((obj) =>
        play_moves(obj, 2, ["Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"])
      )
      .then((obj) => unexamine(obj, 1))
      .then((obj) => unexamine2(obj, 2))
      .then((obj) => logout(obj, 1))
      .then((obj) => logout(obj, 2));
  });
  it("returns an error correctly when mexamine fails", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => examine(obj, 1))
      .then((obj) => mexamine2(obj, 1, 2))
      .then((obj) => logout(obj, 1));
  });
  it("executes forward and backward commands correctly", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => examine(obj, 1, "%10"))
      .then((obj) => forward(obj, 1, 8))
      .then((obj) => backward_cmd(obj, 1, 5))
      .then((obj) => forward(obj, 1, 3))
      .then((obj) => backward_cmd(obj, 1, 5))
      .then((obj) => logout(obj, 1));
  });
  it("returns an error correctly if unexamine fails", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => {
        const promise = new Promise(
          (resolve, reject) => (obj.user1.resolves.error = resolve)
        );
        obj.user1.unexamine("unexamine");
        return promise;
      })
      .then((obj) => logout(obj, 1));
  });
  it("executes a revert correctly", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => examine(obj, 1, "%10"))
      .then((obj) => forward(obj, 1, 8))
      .then((obj) => play_moves(obj, 1, ["a4", "a5", "b4", "b5"]))
      .then((obj) => revert(obj, 1, 3))
      .then((obj) => logout(obj, 1));
  });
  // it("returns an error correctly if revert fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("executes a setwhiteclock correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if setwhiteclock fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("executes a setblackclock correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if setblackclock fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if libkeepexam fails", function () {
  //     chai.assert.fail("do me")
  // });
  it("executes circles and arrows correctly", function () {
    return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
      .then((obj) => examine(obj, 1, "%10"))
      .then((obj) => circle_cmd(obj, 1, "a4"))
      .then((obj) => uncircle_cmd(obj, 1, "a4"))
      .then((obj) => arrow_cmd(obj, 1, "a4", "h5"))
      .then((obj) => unarrow_cmd(obj, 1, "a4", "h5"))
      .then((obj) => logout(obj, 1));
  });
  // it("executes a clearboard correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if clearboard fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("executes a 'result' commmand correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if 'result' fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("executes a setwhitename correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if setwhitename fails", function () {
  //     chai.assert.fail("do me")
  // });
  // it("executes a setblackname correctly", function () {
  //     chai.assert.fail("do me")
  // });
  // it("returns an error correctly if setblackname fails", function () {
  //     chai.assert.fail("do me")
  // });
  //   setwhiteclock s.1.. CN_SETCLOCK_WHITE​
  //   setblackclock s.1.. CN_SETCLOCK_BLACK​
  //   clearboard N.1.. CN_CLEARBOARD​
  //   result S.1.. CN_RESULT​
  //   setwhitename S.1.. CN_SET_WHITE_NAME​
  //   setblackname S.1.. CN_SET_BLACK_NAME​
  //   settimecontrol S.1.. CN_SETGAMEPARAM​

  // 18 DG_STARTED_OBSERVING
  // 19 DG_STOP_OBSERVING
  // 39 DG_FLIP
  // 42 DG_ILLEGAL_MOVE
  // 70 DG_FEN
  // 100 DG_MY_GAME_CHANGE

  // From the help file for examine:
  // tag               "help tag"
  // wq@c4             (and other board-editing commands)
  // reverse
  // loadfen           "help loadfen"
  // copygame          "help copygame"
  // annotate          "help annotate"
});
