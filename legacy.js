const L2 = require('./l2');
if (typeof require != "undefined") {

}

/*
 * The packets the admin user will receive for saving and publishing.
 */
const ADMIN_LEVEL2_PACKETS = [
    L2.WHO_AM_I,
    L2.LOGIN_FAILED,
    L2.CHANNEL_QTELL,
    L2.CHANNEL_TELL
];

/*
 * The packets a normal legacy user will receive for saving and publishing.
 */
const USER_LEVEL2_PACKETS = [
    L2.WHO_AM_I,
    L2.LOGIN_FAILED,
    L2.MOVE_ALGEBRAIC,
    L2.MOVE_CLOCK,
    L2.MOVE_LIST,
    //    L2.MOVE_SMITH,
    //    L2.MOVE_TIME,
    L2.IS_VARIATION,
    L2.SET2,
    L2.ERROR,
    L2.MESSAGELIST_BEGIN,
    L2.MESSAGELIST_ITEM,
    L2.PERSONAL_QTELL,
    L2.PERSONAL_TELL,
    L2.PERSONAL_TELL_ECHO,
    L2.STARTED_OBSERVING,
    L2.STOP_OBSERVING,
    L2.PLAYERS_IN_MY_GAME,
    L2.OFFERS_IN_MY_GAME,
    L2.TAKEBACK,
    L2.BACKWARD,
    L2.SEND_MOVES,
    L2.MY_GAME_CHANGE,
    L2.MY_GAME_ENDED,
    L2.MY_GAME_RESULT,
    L2.MY_GAME_STARTED,
    L2.MSEC,
    L2.PLAYER_ARRIVED,
    L2.OPEN,
    L2.TITLES,
    L2.STATE,
    L2.BULLET,
    L2.BLITZ,
    L2.STANDARD,
    L2.WILD,
    L2.BUGHOUSE,
    L2.LOSERS,
    L2.CRAZYHOUSE,
    L2.FIVEMINUTE,
    L2.ONEMINUTE,
    L2.CORRESPONDENCE_RATING,
    L2.FIFTEENMINUTE,
    L2.THREEMINUTE,
    L2.FORTYFIVEMINUTE,
    L2.CHESS960,
    L2.PLAYER_LEFT,
    L2.MUGSHOT,
    L2.MATCH,
    L2.SEEK,
    L2.SEEK_REMOVED
];

const LegacyICC = function (options) {

    options = options || {};
    const LEVEL1EMPTY = -1;
    const LEVEL1ENDED = -2;

    const IN_BETWEEN = 0;
    const IN_SIMPLE_PARM = 1;
    const IN_BRACKETS_PARM = 2;
    const IN_CONTROL_BRACKETS_PARM = 3;

    const CONTROL_Y = String.fromCharCode(25);
    const CONTROL_Z = String.fromCharCode(26);

    let user = options.username || "g";
    let password = options.password || "";
    let host = options.host || "chessclub.com";
    let port = options.port || 23;
    let error_function = options.error || generic_error;
    let packet_processor = options.processpackets || eat_packets;
    let preprocessor = options.preprocessor || null;

    let state = "login";
    let databuffer = "";
    let ctrl = false;
    let level2 = false;
    let level1 = LEVEL1EMPTY;
    let level1Array = [];
    let level2Array = [];
    let currentLevel1 = "";
    let currentLevel2 = "";
    let socket;

    function generic_error(error) {
        console.log(error);
    }

    function eat_packets() {
        console.log("Eating packets - Define options.processpackets");
    }

    function login() {
        socket = new net.Socket();
        socket.on("data", socket_data);
        socket.on("error", error_function);
        socket.setEncoding("utf8");
        socket.connect({
            host: host,
            port: port
        });
    }

    function socket_data(data) {
        databuffer += data;
        let packets = null;
        do {
            packets = _parse();
            if (packets) {
                if (packets.level2Packets.length && packets.level2Packets[0].packet.indexOf("69 5") === 0) {
                    socket.write(password + "\n");
                } else {
                    if(!preprocessor || !preprocessor(packets))
                        _processPackets(packets);
                }
            }
        } while (packets);
    }

    function logout() {
        socket.write("quit\n");
        socket.destroy();
    }

    function _parse() {
        if (state === "login") {
            if (databuffer.indexOf("login") !== -1) {
                databuffer = "";
                socket.write("level1=13\n");
                socket.write(
                    "level2settings=" + L2.LEVEL2STRING(USER_LEVEL2_PACKETS) + "\n"
                );
                socket.write(user.profile.legacy.username + "\n");
                state = "password";
                return;
            }
        }

        try {
            for (let bx = 0; bx < databuffer.length; bx++) {
                let by = databuffer.charAt(bx);
                // noinspection FallThroughInSwitchStatementJS
                switch (by) {
                    case CONTROL_Y:
                        ctrl = true;
                        break;
                    case "[":
                        // TODO: This isn't exactly right either. We shouldn't be processing any level 1 ever if we are in a level 2. Fix me.
                        if (ctrl) {
                            ctrl = false;
                            if (level1 > LEVEL1EMPTY) {
                                if (level1Array.length > level1) {
                                    level1Array[level1] = currentLevel1;
                                } else {
                                    level1Array.push(currentLevel1);
                                }
                            }
                            level1++;
                            if (level1Array.length > level1) {
                                currentLevel1 = level1Array[level1];
                            } else {
                                currentLevel1 = "";
                            }
                        } else if (level2) {
                            currentLevel2 += "[";
                        } else {
                            currentLevel1 += "[";
                        }
                        break;
                    // I think ^Z is when we "overflow ICC's buffer", which is a very bad thing. Using this hack will get you through
                    // the hole (and processing continues), but it LOSES DATA!!
                    case CONTROL_Z:
                        // ^Z Means ICC and their dumb decsions have hit us again. They had some sort of "buffer overrun",
                        // and can't send us the rest of our data, even though there should be no earthly reason that they have
                        // this problem. Nevertheless, we have to RESET and RECOVER.
                        ctrl = true;
                        level1 = LEVEL1EMPTY + 1;
                    // eslint-disable-next-line no-fallthrough
                    case "]":
                        // TODO: This isn't exactly right either. We shouldn't be processing any level 1 ever if we are in a level 2. Fix me.
                        if (ctrl) {
                            ctrl = false;
                            if (level1 === LEVEL1ENDED) {
                                error_function("We are in the logout section of having no packets left!!!");
                                return; // We get here when we close our last packet (i.e. logging/logged off!)
                                //TODO: We have to figure out how to convey that, then clean up
                            }
                            if (level1Array.length > level1) {
                                level1Array[level1] = currentLevel1;
                            } else {
                                level1Array.push(currentLevel1);
                            }
                            if (--level1 === LEVEL1EMPTY) {
                                currentLevel1 = "";
                                databuffer = databuffer.substr(bx + 1);
                                let ret = {
                                    level1Packets: level1Array,
                                    level2Packets: level2Array
                                };
                                level1Array = [];
                                level2Array = [];
                                return ret;
                            } else currentLevel1 = level1Array[level1];
                        } else if (level2) {
                            currentLevel2 += "]";
                        } else {
                            currentLevel1 += "]";
                        }
                        break;
                    case "(":
                        if (ctrl) {
                            ctrl = false;
                            level2 = true;
                            currentLevel2 = "";
                        } else if (level2) {
                            currentLevel2 += "(";
                        } else {
                            currentLevel1 += "(";
                        }
                        break;
                    case ")":
                        if (ctrl) {
                            ctrl = false;
                            level2 = false;
                            let hdrstr = currentLevel1;
                            hdrstr.replace(/([\n\r])+$/, "");
                            let cl1 = hdrstr.split(/\s+/);
                            level2Array.push({
                                l1command: cl1.length > 0 ? parseInt(cl1[0]) : null,
                                l1user: cl1.length > 1 ? cl1[1] : null,
                                l1messageidentifier: cl1.length > 2 ? cl1[2] : "server",
                                packet: currentLevel2
                            });
                            currentLevel2 = "";
                        } else if (level2) {
                            currentLevel2 += ")";
                        } else {
                            currentLevel1 += ")";
                        }
                        break;
                    default:
                        if (ctrl) {
                            // noinspection StatementWithEmptyBodyJS
                            if (level2) {
                                currentLevel2 += CONTROL_Y;
                            } else {
                                currentLevel1 += CONTROL_Y;
                            }
                            ctrl = false;
                        }
                        if (level2) {
                            currentLevel2 += by;
                        } else {
                            currentLevel1 += by;
                        }
                        break;
                }
            }
            databuffer = "";
        } catch (e) {
            error_function(e);
        }
    }

    function _processPackets(packets) {
        packets.level2Packets.forEach(function (p) {
            const p2 = _parseLevel2(p);
            packet_processor(p2);
        });
    }

    function _parseLevel2(packet) {
        /*
            --- The level 1 stuff ... we will deal with that later right now --
            TODO: Do this later
            this.l1PacketData = new String[ours];
            for (int x = 0; x < ours; x++) {
                l1PacketData[x] = level1Packets.get(x);
            }
            this.l1key = pl1key;
            this.packet = ppacket;
    */
        let ctrl = false;
        let currentparm = "";
        let state = IN_BETWEEN;
        let parms = [];

        for (let x = 0; x < packet.packet.length; x++) {
            let by = packet.packet.charAt(x);
            switch (by) {
                case CONTROL_Y: // ^Y
                    ctrl = true;
                    break;
                case "{":
                    if (ctrl && state === IN_BETWEEN) {
                        state = IN_CONTROL_BRACKETS_PARM;
                    } else if (state === IN_BETWEEN) {
                        state = IN_BRACKETS_PARM;
                    } else if (ctrl) {
                        currentparm += CONTROL_Y;
                        currentparm += "{";
                    } else {
                        currentparm += "{";
                    }
                    ctrl = false;
                    break;
                case "}":
                    if (
                        (state === IN_CONTROL_BRACKETS_PARM && ctrl) ||
                        state === IN_BRACKETS_PARM
                    ) {
                        parms.push(currentparm);
                        currentparm = "";
                        state = IN_BETWEEN;
                    } else if (ctrl) {
                        currentparm += CONTROL_Y;
                        currentparm += "}";
                    } else {
                        currentparm += "}";
                    }
                    ctrl = false;
                    break;
                case " ":
                    if (ctrl) {
                        ctrl = false;
                        currentparm += CONTROL_Y;
                    }
                    if (state > IN_SIMPLE_PARM) {
                        currentparm += " ";
                    } else if (state === IN_SIMPLE_PARM) {
                        parms.push(currentparm);
                        currentparm = "";
                        state = IN_BETWEEN;
                    }
                    break;
                default:
                    if (ctrl) {
                        ctrl = false;
                        currentparm += CONTROL_Y;
                    }
                    currentparm += by;
                    if (state === IN_BETWEEN) {
                        state = IN_SIMPLE_PARM;
                    }
                    break;
            }
        }

        if (currentparm.length !== 0) {
            parms.push(currentparm);
        }

        return parms;
    }

    return {
        //user: options.username || "g",
        //password: options.password || "",
        //host: options.host || "chessclub.com",
        //port: options.port || 23,
        //socket_error: options.error || generic_error,
        //packet_processor: options.processpackets || eat_packets,
        /*
            Public API
         */
        test_socket_data: function (data) {
            socket_data(data);
        }
    }
};
/* export Legacy object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.LegacyICC = LegacyICC;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
    define(function () {
        return LegacyICC;
    });
