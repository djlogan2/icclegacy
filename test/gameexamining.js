const chai = require('chai');
const Legacy = require('../legacy').LegacyICC;

function log(n, data) {
    console.log("--- user" + n + " ---");
    console.log(data);
}

function unexamine(obj, n) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.players = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.players = resolve;
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
        obj["user1"].resolves.players = resolve;
    });
    let promise2;
    if (!!obj["user2"]) {
        promise2 = new Promise((resolve, reject) => {
            obj["user2"].resolves.players = resolve;
        });
    } else
        promise2 = Promise.resolve(obj);
    const otherguy = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
    obj["user" + n].mexamine("mex-" + otherguy, otherguy);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function backward_dg(n, data) {
    this["user" + n].resolves.backward(this);
}

function check_move(n, data) {
    if(!!this["user" + n].resolves.move_count)
        this["user" + n].resolves.move_count--;
    if(!this["user" + n].resolves.move_count)
        this["user" + n].resolves.move(this);
}

function make_move(obj, n, move) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.move = resolve;
    });
    let promise2;
    if (!!obj["user2"])
        promise2 = new Promise((resolve, reject) => {
            obj["user2"].resolves.move = resolve;
        });
    else
        promise2 = Promise.resolve(obj);
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
        obj["user1"].resolves.players = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.players = resolve;
    });
    const otherguy = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
    obj["user" + n].observe("observe-" + otherguy, otherguy);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function forward(obj, n, moves) {
    obj["user1"].resolves.move_count = moves;
    if(obj["user2"])
        obj["user2"].resolves.move_count = moves;
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.move = resolve;
    });
    let promise2;
    if (!!obj["user2"])
        promise2 = new Promise((resolve, reject) => {
            obj["user2"].resolves.move = resolve;
        });
    else
        promise2 = Promise.resolve(obj);
    obj["user" + n].forward("forward-" + moves, moves);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function backward_cmd(obj, n, moves) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.backward = resolve;
    });
    let promise2;
    if (!!obj["user2"])
        promise2 = new Promise((resolve, reject) => {
            obj["user2"].resolves.backward = resolve;
        });
    else
        promise2 = Promise.resolve(obj);
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
    if(this["user" + n].resolves.error) {
        this["user" + n].resolves.error(this);
        this["user" + n].resolves.error = undefined;
    } else {
        chai.assert.fail(data);
    }
}

function login(obj, n, username, password) {
    obj["user" + n] = new Legacy({
        sendpreprocessor: (data) => log(n, data),
        preprocessor: (data) => log(n, data),
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
        error: (data) => error.call(obj, n, data)
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
            .then((obj) => play_moves(obj, 1, ["e4", "e5", "Nf3", "Nc6", "Be2", "Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"]))
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
            .then((obj) => login(obj, 2, process.env.USERNAME2, process.env.PASSWORD2))
            .then((obj) => examine(obj, 1))
            .then((obj) => observe(obj, 2))
            .then((obj) => play_moves(obj, 1, ["e4", "e5", "Nf3", "Nc6", "Be2"]))
            .then((obj) => mexamine(obj, 1, 2))
            .then((obj) => play_moves(obj, 2, ["Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"]))
            .then((obj) => unexamine(obj, 1))
            .then((obj) => unexamine2(obj, 2))
            .then((obj) => logout(obj, 1))
            .then((obj) => logout(obj, 2));
    });
    it("returns an error correctly when mexamine fails", function () {
        return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
            .then((obj) => examine(obj, 1))
            .then((obj) => mexamine(obj, 1, 2))
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
    it.only("returns an error correctly if unexamine fails", function () {
        return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
            .then((obj) => {
                const promise = new Promise((resolve, reject) => obj["user1"].resolves.error = resolve);
                obj["user1"].unexamine("unexamine");
                return promise;
            })
            .then((obj) => logout(obj, 1));
    });
    it("executes a revert correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if revert fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a setwhiteclock correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if setwhiteclock fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a setblackclock correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if setblackclock fails", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if libkeepexam fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a circle correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if circle fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a arrow correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if arrow fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a clearboard correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if clearboard fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a 'result' commmand correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if 'result' fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a uncircle correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if uncircle fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a unarrow correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if unarrow fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a setwhitename correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if setwhitename fails", function () {
        chai.assert.fail("do me")
    });
    it("executes a setblackname correctly", function () {
        chai.assert.fail("do me")
    });
    it("returns an error correctly if setblackname fails", function () {
        chai.assert.fail("do me")
    });
    it("properly notifies client of players statuses (players in my game)", function () {
        chai.assert.fail("do me")
    });
    //   mexamine s.1.. CN_MEXAMINE​
    //   forward s.1.. CN_FORWARD​
    //   forward N.1.. CN_FORWARD0​
    //   backward s.1.. CN_BACK​
    //   backward N.1.. CN_BACK0​
    //   unexamine N.1.. CN_UNEXAMINE​
    //   examine N.1.. CN_UNEXAMINE​
    //   revert N.1.. CN_REVERT​
    //   moves N.1.. CN_MOVES​
    //   setwhiteclock s.1.. CN_SETCLOCK_WHITE​
    //   setblackclock s.1.. CN_SETCLOCK_BLACK​
    //   libkeepexam N.1.1 CN_LIBKEEPEXAM​
    //   circle S01.. CN_CIRCLE​
    //   arrow S01.. CN_ARROW​
    //   clearboard N.1.. CN_CLEARBOARD​
    //   result S.1.. CN_RESULT​
    //   uncircle S01.. CN_UNCIRCLE​
    //   unarrow S01.. CN_UNARROW​
    //   setwhitename S.1.. CN_SET_WHITE_NAME​
    //   setblackname S.1.. CN_SET_BLACK_NAME​
    //   settimecontrol S.1.. CN_SETGAMEPARAM​
    //   chessmove s.1.. SCN_MOVE​

    // 15 DG_MY_GAME_STARTED
    // 16 DG_MY_GAME_RESULT
    // 17 DG_MY_GAME_ENDED
    // 18 DG_STARTED_OBSERVING
    // 19 DG_STOP_OBSERVING
    // 20 DG_PLAYERS_IN_MY_GAME
    // 21 DG_OFFERS_IN_MY_GAME
    // 22 DG_TAKEBACK
    // 23 DG_BACKWARD
    // 33 DG_MOVE_ALGEBRAIC
    // 34 DG_MOVE_SMITH
    // 35 DG_MOVE_TIME
    // 36 DG_MOVE_CLOCK
    // 24 DG_SEND_MOVES
    // 25 DG_MOVE_LIST
    // 38 DG_SET_CLOCK
    // 39 DG_FLIP
    // 42 DG_ILLEGAL_MOVE
    // 70 DG_FEN
    // 56 DG_MSEC
    // 61 DG_MORETIME
    // 100 DG_MY_GAME_CHANGE
    // 59 DG_CIRCLE
    // 60 DG_ARROW
    // 89 DG_UNCIRCLE
    // 90 DG_UNARROW

    // From the help file for examine:
    // tag               "help tag"
    // wq@c4             (and other board-editing commands)
    // reverse
    // loadfen           "help loadfen"
    // copygame          "help copygame"
    // annotate          "help annotate"
});