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

describe("seek functions", function(done){
    it("should be called with a successful seek", function(done){
        const legacy = new Legacy({
            seek:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.index, 123);
                chai.assert.equal(data.name, "iccguy");
                chai.assert.sameMembers(data.titles, ["GM", "C", "H", "TD"]);
                chai.assert.equal(data.rating, 1234);
                chai.assert.equal(data.provisional_status, 2);
                chai.assert.equal(data.wild, 5);
                chai.assert.equal(data.rating_type, "rating-type");
                chai.assert.equal(data.time, 15);
                chai.assert.equal(data.inc, 0);
                chai.assert.equal(data.rated, true);
                chai.assert.equal(data.color, "white");
                chai.assert.equal(data.minrating, 1000);
                chai.assert.equal(data.maxrating, 2000);
                chai.assert.equal(data.autoaccept, true);
                chai.assert.equal(data.formula, "formula");
                chai.assert.equal(data.fancy_time_control, "fancy-time-control");
                done();
            }
        });
        legacy.test_socket_data(level1(999, null, level2(50, "123", "iccguy", B("GM C H TD"), "1234", "2", "5", "rating-type", "15", "0", "1", "2", "1000", "2000", "1", "formula", "fancy-time-control")));
    });
    it("should be called with a seek removed", function(done){
        const legacy = new Legacy({
            seek_removed:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.index, 11);
                chai.assert.equal(data.reasoncode, 12);
                done();
            }
        });
        legacy.test_socket_data(level1(10, null, level2(51, 11, 12)));
    });
    it("should set datagrams 50 and 51", function(){
        const legacy1 = new Legacy({seek: () => console.log("hi")});
        chai.assert.sameMembers(legacy1.active_level2(), [50]);
        const legacy2 = new Legacy({seek_removed: () => console.log("hi")});
        chai.assert.sameMembers(legacy2.active_level2(), [51]);
    });
});

describe("The seek command", function() {
    //  time           The initial time of the match (taken from your time
    //                  variable if omitted)
    it("should fail if time is missing or not a number", function () {
    });
    //
    //   increment      The increment of the match (taken from your increment
    //                  variable if omitted)
    it("should fail if increment is missing or not a number", function () {
    });
    //
    //   r/u            Indicates if the match should be rated or not.
    //                  It must be "r" or "u".
    it("should fail if rated is missing or not a boolean", function () {
    });
    //
    //   w#             The wild number of the match.  (taken from your wild
    //                  variable if omitted).  For example, "w5" for wild 5.
    //
    it("should fail if wild is missing or not a number", function () {
    });
    //   white/black    Specifies if the seeker will get white or black.
    //                  It must be "white", "black" or "w" or "b".
    //
    it("should fail if color is not 'null', 'white', or 'black'", function () {
    });
    it("should not send a color if color is null", function () {
    });
    it("should not send send the correct color if it's not null", function () {
    });
    //   auto/manual    Specifies if the match should start automatically
    //                  when another player issues a play command.  In auto
    //                  mode (the default) the match starts immediately.  In
    //                  manual mode an ordinary match command is issued.  It
    //                  must be "auto" or "manual" or "a" or "m" for short.
    //
    it("should fail if auto is missing or not a boolean", function () {
    });
    //   rating-range   This is simply two numbers with a "-" between them.
    //                  The minimum is 0 and the maximum is 9999.
    it("should fail if minimum rating is missing or not a number, or less than zero", function () {
    });
    it("should fail if maximum rating is missing or not a number, or less than or equal to minrating", function () {
    });
});