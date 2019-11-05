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
                chai.assert.equal(data.challenger_time_control, "challenger-time-control");
                chai.assert.equal(data.receiver_time_control, "receiver-time-control");
                chai.assert.equal(data.challenger_color_request, "-1");
                chai.assert.equal(data.assess_loss, -30);
                chai.assert.equal(data.assess_draw, -10);
                chai.assert.equal(data.assess_win, 20);
                chai.assert.equal(data.fancy_time_control, "fancy-time-control");
                done();
            }
        });
        legacy.test_socket_data(level1(999, null, level2(29, "challenger-name", 1111, B("C DM"), "receiver-name", 2222, B("GM H"), "0", "Standard", "1" ,"0", "challenger-time-control", "receiver-time-control", "-1", -30, -10, 20, "fancy-time-control")));
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
        chai.assert.sameMembers(legacy1.active_level2(), [29]);
        const legacy2 = new Legacy({match_removed: () => console.log("hi")});
        chai.assert.sameMembers(legacy2.active_level2(), [30]);
    });
});