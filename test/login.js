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

describe("login functions", function(){
    it("should be called with a successful login when one is successful", function(done){
        const legacy = new Legacy({
            loggedin:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.username, "uuzz");
                chai.assert.isArray(data.titles);
                chai.assert.sameMembers(data.titles, ["TM", "C", "H", "GM"]);
                done();
            }
        });
        legacy.test_socket_data(level1(10, null, level2(0, "uuzz", B("TM C H GM"))));
    });
    it("should be called with a correct DG69 data when unsuccessful", function(done){
        const legacy = new Legacy({
            login_failed:(data) => {
                chai.assert.isDefined(data);
                chai.assert.equal(data.code, 11);
                chai.assert.equal(data.message, "Enter something valid");
                done();
            }
        });
        legacy.test_socket_data(level1(10, null, level2(69, 11, B("Enter something valid"))));
    });
    it("should set datagrams 0 and 69", function(){
        const legacy1 = new Legacy({loggedin: () => console.log("hi")});
        chai.assert.sameMembers(legacy1.active_level2(), [0, 69, 154, 168]);
        const legacy2 = new Legacy({login_failed: () => console.log("hi")});
        chai.assert.sameMembers(legacy2.active_level2(), [0, 69, 154, 168]);
    });
});