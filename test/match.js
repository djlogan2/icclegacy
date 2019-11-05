const chai = require('chai');
const Legacy = require('../legacy').LegacyICC;


const CONTROL_Y = String.fromCharCode(25);
const CONTROL_Z = String.fromCharCode(26);

/**
 * @return {string}
 */
function B(parameter) {
    return "{" + parameter + "}";
}

/**
 * @return {string}
 */
function CB(parameter) {
    return CONTROL_Y + "{" + parameter + CONTROL_Y + "}";
}

function level1(command_number, message_identifier, command_text) {
    let l1 = CONTROL_Y + "[" + command_number + " *";
    if (!!message_identifier) l1 += " " + message_identifier;
    l1 += "\r\n" + command_text + CONTROL_Y + "]";
    return l1;
}

/**
 * @param command number
 * @param arguments: string, B(string), CB(string)
 * @return {string}
 */
function level2() {
    let l2 = CONTROL_Y + "(";
    space = "";
    for (let x = 0; x < arguments.length; x++) {
        l2 += space + arguments[x];
        space = " ";
    }
    l2 += CONTROL_Y + ")";
    return l2;
}

describe("match functions", function(done){
    it("should be called with a successful match", function(done){
        const legacy = new Legacy({
            match:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.challenger_name, "challenger-name");
                chai.assert.equal(data.challenger_rating, 1111);
                chai.assert.sameMembers(data.challenger_titles, ["C", "DM"]);
                chai.assert.equal(data.receiver_name, "receiver-name");
                chai.assert.equal(data.receiver_rating, 2222);
                chai.assert.sameMembers(data.receiver_titles, ["GM", "H"]);
                chai.assert.equal(data.wild_number, 0);
                chai.assert.equal(data.rating_type, "Standard");
                chai.assert.equal(data.is_it_rated, true);
                chai.assert.equal(data.is_it_adjourned, false);
                chai.assert.equal(data.challenger_time, 20);
                chai.assert.equal(data.receiver_time, 40);
                chai.assert.equal(data.challenger_inc, 30);
                chai.assert.equal(data.receiver_inc, 50);
                chai.assert.equal(data.challenger_color_request, "white");
                chai.assert.equal(data.assess_loss, -30);
                chai.assert.equal(data.assess_draw, -10);
                chai.assert.equal(data.assess_win, -20);
                chai.assert.equal(data.fancy_time_control, "fancy-time-control");
                done();
            }
        });
        legacy.test_socket_data(level1(999, null, level2(29, "challenger-name", "1111", "0", B("C DM"), "receiver-name", "2222", "0", B("GM H"), "0", "Standard", "1", "0", "20", "30", "40", "50", "1", "-30", "-10", "-20", "fancy-time-control")));
    });
    it("should be called with a match removed", function(done){
        const legacy = new Legacy({
            match_removed:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.challenger_name, "challenger-name");
                chai.assert.equal(data.receiver_name, "receiver-name");
                chai.assert.equal(data.explanation_string, "Explanation");
                done();
            }
        });
        legacy.test_socket_data(level1(10, null, level2(30, "challenger-name", "receiver-name", CB("Explanation"))));
    });
    it("should set datagrams 29 and 30", function(){
        const legacy1 = new Legacy({match: () => console.log("hi")});
        chai.assert.sameMembers(legacy1.active_level2(), [0, 69, 29, 85]);
        const legacy2 = new Legacy({match_removed: () => console.log("hi")});
        chai.assert.sameMembers(legacy2.active_level2(), [0, 69, 30]);
    });
});

describe("The match command", function(){
    let user1;
    let user2;
    let username1;
    let username2;
    let match1;
    let match2;

    it("should work", function(done){
        function checklogin() {
            if(username1 && username2) {
                user1.match("mi1", username2, 20, 30, 40, 50, true, 0, "white");
            }
        }

        function checkmatch() {
            if(match1 && match2) {
                user1.remove_all_matches_and_seeks("mi2");
            }
        }

        function checkunmatch() {
            if(!match1 && !match2) {
                user1.logout();
                user2.logout();
                done();
            }
        }

        user1 = new Legacy({
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: "queen.chessclub.com",
            port: 23,
            loggedin: (data) => {
                username1 = data.username;
                checklogin();
            },
            match: (data) => {
                match1 = data;
                    chai.assert.equal(data.message_identifier, 'mi1');
                    chai.assert.equal(data.challenger_name, username1);
                    chai.assert.equal(data.receiver_name, username2);
                    chai.assert.equal(data.wild_number, 0);
                    chai.assert.equal(data.rating_type, 'Standard');
                    chai.assert.equal(data.is_it_rated, false); // Forced unless we remove time2 and inc2
                    chai.assert.equal(data.is_it_adjourned, false);
                    chai.assert.equal(data.challenger_time, 20);
                    chai.assert.equal(data.challenger_inc, 30);
                    chai.assert.equal(data.receiver_time, 40);
                    chai.assert.equal(data.receiver_inc, 50);
                    chai.assert.equal(data.challenger_color_request, 'white');
                    chai.assert.equal(data.fancy_time_control, '');
                    checkmatch();
            },
            match_removed: (data) => {
                match1 = undefined;
                chai.assert.equal(data.message_identifier,"mi2");
                chai.assert.equal(data.challenger_name,username1);
                chai.assert.equal(data.receiver_name,username2);
                chai.assert.isDefined(data.explanation_string);
                checkunmatch();
            }
        });
        user2 = new Legacy({
            username: process.env.USERNAME2,
            password: process.env.PASSWORD2,
            host: "queen.chessclub.com",
            port: 23,
            loggedin: (data) => {
                username2 = data.username;
                checklogin();
            },
            match: (data) => {
                match2 = data;
                checkmatch();
            },
            match_removed: (data) => {
                match2 = undefined;
                checkunmatch();
            }
        });
        user1.login();
        user2.login();
    });
});