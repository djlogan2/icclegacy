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

describe("Legacy", function () {
    it("should parse a level 1 packet correctly", function (done) {
        const data = level1(10, "mi1", "this is text");
        const legacy = new Legacy({
            preprocessor: (packets) => {
                chai.assert.isDefined(packets);
                chai.assert.isDefined(packets.level1Packets);
                chai.assert.isArray(packets.level1Packets);
                chai.assert.equal(packets.level1Packets.length, 1);
                chai.assert.equal(packets.level1Packets[0], "10 * mi1\r\nthis is text");
                done();
                return true;
            }
        });
        legacy.test_socket_data(data);
    });

    it("should parse nested level 1 packets correctly", function (done) {
        const data = level1(10, "mi1", "this is 10 text" +
            level1(11, "mi2", "this is 11 text" +
                level1(12, "mi3", "this is 12 text")
            )
        );
        const legacy = new Legacy({
            preprocessor: (packets) => {
                chai.assert.isDefined(packets);
                chai.assert.isDefined(packets.level1Packets);
                chai.assert.isArray(packets.level1Packets);
                chai.assert.equal(packets.level1Packets.length, 3);
                chai.assert.equal(packets.level1Packets[0], "10 * mi1\r\nthis is 10 text");
                chai.assert.equal(packets.level1Packets[1], "11 * mi2\r\nthis is 11 text");
                chai.assert.equal(packets.level1Packets[2], "12 * mi3\r\nthis is 12 text");
                done();
                return true;
            }
        });
        legacy.test_socket_data(data);
    });

    it("should parse level 2 packets correctly", function (done) {
        const data =
            level1(10,
                "mi1",
                "level 2 test" +
                level2(100, "p1", B("p2 with spaces"), CB("{p3 with brackets and spaces}"))
            );
        const legacy = new Legacy({
            preprocessor: (packets) => {
                chai.assert.isDefined(packets);
                chai.assert.isDefined(packets.level2Packets);
                chai.assert.isArray(packets.level2Packets);
                chai.assert.equal(packets.level2Packets.length, 1);
                chai.assert.equal(packets.level2Packets[0].l1command, 10);
                chai.assert.equal(packets.level2Packets[0].l1user, "*");
                chai.assert.equal(packets.level2Packets[0].l1messageidentifier, "mi1");
                chai.assert.equal(packets.level2Packets[0].packet, "100 p1 {p2 with spaces} {{p3 with brackets and spaces}}");
                done();
                return true;
            }
        });
        legacy.test_socket_data(data);
    });
    it("should parse nested level 1 packets correctly", function (done) {
        const data = level1(10, "mi1",
            level1(11, "mi2",
                level1(12, "mi3",
                    "This is level1 command 12 text" +
                    level2(100, "l2_100", B("l2_100 with space"), CB("l2_100 with {brackets} and spaces")) +
                    level2(101, "l2_101", B("l2_101 with space"), CB("l2_101 with {brackets} and spaces"))
                ) +
                level2(102, "l2_102", B("l2_102 with space"), CB("l2_102 with {brackets} and spaces")) +
                level2(103, "l2_103", B("l2_103 with space"), CB("l2_103 with {brackets} and spaces"))
            ) +
            level2(104, "l2_104", B("l2_104 with space"), CB("l2_104 with {brackets} and spaces")) +
            level2(105, "l2_105", B("l2_105 with space"), CB("l2_105 with {brackets} and spaces"))
        );
        const legacy = new Legacy({
            preprocessor: (packets) => {
                chai.assert.isDefined(packets);
                chai.assert.isDefined(packets.level2Packets);
                chai.assert.isArray(packets.level2Packets);
                chai.assert.equal(packets.level2Packets.length, 6);
                chai.assert.equal(packets.level2Packets[0].l1command, 12);
                chai.assert.equal(packets.level2Packets[0].l1user, "*");
                chai.assert.equal(packets.level2Packets[0].l1messageidentifier, "mi3");
                chai.assert.equal(packets.level2Packets[0].packet, "100 l2_100 {l2_100 with space} {l2_100 with {brackets} and spaces}");
                chai.assert.equal(packets.level2Packets[1].l1command, 12);
                chai.assert.equal(packets.level2Packets[1].l1user, "*");
                chai.assert.equal(packets.level2Packets[1].l1messageidentifier, "mi3");
                chai.assert.equal(packets.level2Packets[1].packet, "101 l2_101 {l2_101 with space} {l2_101 with {brackets} and spaces}");
                chai.assert.equal(packets.level2Packets[2].l1command, 11);
                chai.assert.equal(packets.level2Packets[2].l1user, "*");
                chai.assert.equal(packets.level2Packets[2].l1messageidentifier, "mi2");
                chai.assert.equal(packets.level2Packets[2].packet, "102 l2_102 {l2_102 with space} {l2_102 with {brackets} and spaces}");
                chai.assert.equal(packets.level2Packets[3].l1command, 11);
                chai.assert.equal(packets.level2Packets[3].l1user, "*");
                chai.assert.equal(packets.level2Packets[3].l1messageidentifier, "mi2");
                chai.assert.equal(packets.level2Packets[3].packet, "103 l2_103 {l2_103 with space} {l2_103 with {brackets} and spaces}");
                chai.assert.equal(packets.level2Packets[4].l1command, 10);
                chai.assert.equal(packets.level2Packets[4].l1user, "*");
                chai.assert.equal(packets.level2Packets[4].l1messageidentifier, "mi1");
                chai.assert.equal(packets.level2Packets[4].packet, "104 l2_104 {l2_104 with space} {l2_104 with {brackets} and spaces}");
                chai.assert.equal(packets.level2Packets[5].l1command, 10);
                chai.assert.equal(packets.level2Packets[5].l1user, "*");
                chai.assert.equal(packets.level2Packets[5].l1messageidentifier, "mi1");
                chai.assert.equal(packets.level2Packets[5].packet, "105 l2_105 {l2_105 with space} {l2_105 with {brackets} and spaces}");
                done();
                return true;
            }
        });
        legacy.test_socket_data(data);
    });
});
