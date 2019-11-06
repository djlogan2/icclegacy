const chai = require('chai');
const Legacy = require('../legacy').LegacyICC;

function checkresult(obj, n, data) {
    obj.resultcheck += n;
    if(obj.resultcheck === 3)
        obj.resolve(obj);
}

function checkmove(obj, n, data) {
    obj.movecheck += n;
    if(obj.movecheck === 3)
        obj.resolve(obj);
}

function checkmovepromise(obj) {
    return new Promise((resolve) => {
        obj.resolve = resolve;
    });
}

function makemove(obj, move) {
    obj["user" + obj.n].move(move, move);
    obj.movecheck = 0;
    return checkmovepromise(obj);
}

function play_moves(obj, moves) {
    obj.n = 0;
    return moves.reduce((promiseChain, move) => {
        return promiseChain.then((obj) => {
            obj.n = (obj.n === 1 ? 2 : 1);
            return makemove(obj, move);
        });
    }, Promise.resolve(obj));
}

function get_a_game_started() {
    return new Promise((resolve) => {
        let loggedin = 0;
        let match = 0;
        let game = 0;
        const returnObject = {};

        function checkgame(n, data) {
            returnObject["game" + n] = data;
            returnObject.tomove = "w";
            game += n;
            if (game === 3)
                resolve(returnObject);
        }

        function checkmatch(n) {
            match += n;
            if (match === 3)
                returnObject.user2.accept("mi2", returnObject.username1);
        }

        function checkloggedin(n, data) {
            loggedin += n;
            returnObject["username" + n] = data.username;
            if (loggedin === 3) {
                returnObject.user1.resign("miresign", returnObject.username2); // Make sure any adjourned game is resigned
                returnObject.user1.match("mi1", returnObject.username2, 15, 0, null, null, false, 0, "white");
            }
        }

        function log(n, data) {
            console.log("--- " + returnObject["username" + n] + " ---");
            console.log(data);
        }

        returnObject.user1 = new Legacy({
            //sendpreprocessor: (data) => log(1, data),
            //preprocessor: (data) => log(1, data),
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: "queen.chessclub.com",
            loggedin: (data) => checkloggedin(1, data),
            match: () => checkmatch(1),
            my_game_started: (data) => checkgame(1, data),
            my_game_result: (data) => checkresult(returnObject, 1, data),
            move: (data) => checkmove(returnObject, 1, data)
        });
        returnObject.user2 = new Legacy({
            //sendpreprocessor: (data) => log(1, data),
            //preprocessor: (data) => log(2, data),
            username: process.env.USERNAME2,
            password: process.env.PASSWORD2,
            host: "queen.chessclub.com",
            loggedin: (data) => checkloggedin(2, data),
            match: () => checkmatch(2),
            my_game_started: (data) => checkgame(2, data),
            my_game_result: (data) => checkresult(returnObject, 2, data),
            move: (data) => checkmove(returnObject, 2, data)
        });
        returnObject.user1.login();
        returnObject.user2.login();
    });
}

describe("Games", function () {
    it("should work for basic happy path with resign", function (done) {
        this.timeout(500000);
        get_a_game_started()
            .then((obj) => {
                return play_moves(obj, ["e4", "e5", "Nf3", "Nc6", "Be2", "Be7", "Nc3", "Nf6", "d4", "d5", "Bd2", "Bd7"]);
            })
            .then((obj) => {
                obj.resultcheck = 0;
                return new Promise((resolve) => {
                    obj.resolve = resolve;
                    obj.user1.resign("killit!");
                });
            })
            .then((obj) => {
                obj.user1.logout();
                obj.user2.logout();
                done();
            });
    });
    //  adjourn N1..1 CN_ADJOURN​
    //  decline s1... CN_DECLINE​
    //  decline N1... CN_DECLINE​
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