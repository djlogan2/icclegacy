const chai = require('chai');
const Legacy = require('../legacy').LegacyICC;

function check_offers(n, data) {
    this["user" + n].resolves.offers(this);
}

function request_adjourn(obj, n) {
    const promise1 = new Promise((resolve, reject) => {
            obj["user1"].resolves.offers = resolve;
        });
    const promise2 = new Promise((resolve, reject) => {
            obj["user2"].resolves.offers = resolve;
        });
    obj["user" + n].adjourn("request-adjourn");
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function accept_adjourn(obj, n) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.game_result = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.game_result = resolve;
    });
    obj["user" + n].adjourn("accept-adjourn");
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function check_move(n, data) {
    this["user" + n].resolves.move(this);
}

function make_move(obj, n, move) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.move = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.move = resolve;
    });
    obj["user" + n].move("move-" + move, move);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function play_moves(obj, moves) {
    let n = 0;
    return moves.reduce((promiseChain, move) => {
        return promiseChain.then((obj) => {
            n = (n === 1 ? 2 : 1);
            return make_move(obj, n, move);
        });
    }, Promise.resolve(obj));
}

function log(n, data) {
    console.log("--- user" + n + " ---");
    console.log(data);
}

function check_match(n, data) {
    this["user" + n].resolves.match(this);
}

function check_game_start(n, data) {
    this["user" + n].resolves.game_start(this);
}

function accept_match(obj, n) {
    const username = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.game_start = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.game_start = resolve;
    });
    obj["user" + n].accept("accept-" + n + "-" + username, username);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function check_result(n, data) {
    this["user" + n].resolves.game_result(this);
}

function resign(obj, n) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.game_result = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.game_result = resolve;
    });
    obj["user" + n].resign("resigning");
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function issue_match(obj, n) {
    const username = n === 1 ? process.env.USERNAME2 : process.env.USERNAME;
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.match = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.match = resolve;
    });
    obj["user" + n].match("match-" + n + "-" + username, username, 15, 0, null, null, false, 0, "white");
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function resume_game(obj, n) {
    const promise1 = new Promise((resolve, reject) => {
        obj["user1"].resolves.match = resolve;
    });
    const promise2 = new Promise((resolve, reject) => {
        obj["user2"].resolves.match = resolve;
    });
    obj["user" + n].resume("resume-" + n);
    return Promise.all([promise1, promise2]).then(() => Promise.resolve(obj));
}

function check_login(n, data) {
    if (n === 2) this["user" + n].resign(null, process.env.USERNAME);
    this["user" + n].resolves.login(this);
}

function login(obj, n, username, password) {
    obj["user" + n] = new Legacy({
        sendpreprocessor: (data) => log(n, data),
        preprocessor: (data) => log(n, data),
        username: username,
        password: password,
        host: "queen.chessclub.com",
        loggedin: (data) => check_login.call(obj, n, data),
        match: (data) => check_match.call(obj, n, data),
        my_game_started: (data) => check_game_start.call(obj, n, data),
        offers_in_my_game: (data) => check_offers.call(obj, n, data),
        my_game_result: (data) => check_result.call(obj, n, data),
        move: (data) => check_move.call(obj, n, data)
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

describe("Games", function () {
    it("should work for basic happy path with resign", function () {
        this.timeout(60000);
        return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
            .then((obj) => login(obj, 2, process.env.USERNAME2, process.env.PASSWORD2))
            .then((obj) => issue_match(obj, 1))
            .then((obj) => accept_match(obj, 2))
            .then((obj) => play_moves(obj, ["e4", "e5", "Nf3", "Nc6", "Be2", "Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"]))
            .then((obj) => resign(obj, 1))
            .then((obj) => logout(obj, 1))
            .then((obj) => logout(obj, 2))
            ;
    });

    it.only("should adjourn and resume correctly", function () {
        this.timeout(60000);
        return login({}, 1, process.env.USERNAME, process.env.PASSWORD)
            .then((obj) => login(obj, 2, process.env.USERNAME2, process.env.PASSWORD2))
            .then((obj) => issue_match(obj, 1))
            .then((obj) => accept_match(obj, 2))
            .then((obj) => play_moves(obj, ["e4", "e5", "Nf3", "Nc6", "Be2", "Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"]))
            .then((obj) => request_adjourn(obj, 1))
            .then((obj) => accept_adjourn(obj, 2))
            .then((obj) => resume_game(obj, 1))
            .then((obj) => accept_match(obj, 2))
            .then((obj) => resign(obj, 1))
            .then((obj) => logout(obj, 1))
            .then((obj) => logout(obj, 2)) ;
    });

    it.only("should decline an adjourn correctly", function () {/*There is no message when a user declines an adjourn. (There is an L1, but no L2*/});
    //  draw N1... CN_DRAW​
    //  moves N1... CN_MOVES​
    //  abort N1...X CN_ABORT​
    //  takeback N1... CN_TAKEBACK0​
    //  takeback s1... CN_TAKEBACK​
    //  setwhiteclock s1... CN_SETCLOCK_WHITE​
    //  setblackclock s1... CN_SETCLOCK_BLACK​
    //  chessmove s1... SCN_MOVE​

    // 17 DG_MY_GAME_ENDED
    // 18 DG_STARTED_OBSERVING
    // 19 DG_STOP_OBSERVING
    // 20 DG_PLAYERS_IN_MY_GAME
    // 21 DG_OFFERS_IN_MY_GAME
    // 22 DG_TAKEBACK
    // 23 DG_BACKWARD
    // 25 DG_MOVE_LIST
    // 38 DG_SET_CLOCK
    // 39 DG_FLIP
    // 42 DG_ILLEGAL_MOVE
    // 70 DG_FEN
    // 56 DG_MSEC
    // 61 DG_MORETIME
    // 100 DG_MY_GAME_CHANGE
});