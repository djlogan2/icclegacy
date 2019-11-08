const L2 = require('./l2');
const CN = require("./cn");
const net = require("net");

const PACKET_FUNCTIONS = {
    "loggedin": [L2.WHO_AM_I],
    "login_failed": [L2.LOGIN_FAILED],
    "match": [L2.MATCH, L2.MATCH_ASSESSMENT],
    "match_removed": [L2.MATCH_REMOVED],
    "seek": [L2.SEEK],
    "seek_removed": [L2.SEEK_REMOVED],
    "my_game_started": [L2.MY_GAME_STARTED],
    "my_game_result": [L2.MY_GAME_RESULT],
    "move": [L2.SEND_MOVES, L2.MOVE_ALGEBRAIC, L2.MOVE_SMITH, L2.MOVE_TIME, L2.MOVE_CLOCK],
    "offers_in_my_game": [L2.OFFERS_IN_MY_GAME],
    "seek_failed": []
};

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

    let save_offers = {};
    let my_username;
    let game_play_color = {};

    let user = options.username || "g";
    let password = options.password || "";
    let host = options.host || "chessclub.com";
    let port = options.port || 23;
    let error_function = options.error || generic_error;
    let preprocessor = options.preprocessor || null;
    let sendpreprocessor = options.sendpreprocessor || null;
    let preparser = options.preparser || null;
    let functions = {
        error: options.error || generic_error,
        fail: options.fail || generic_error,
    };
    let level2values = [L2.WHO_AM_I, L2.LOGIN_FAILED, L2.ERROR, L2.FAIL];

    for (const k in PACKET_FUNCTIONS) {
        if (PACKET_FUNCTIONS.hasOwnProperty(k)) {
            if (typeof options[k] === "function") {
                functions[k] = options[k];
                PACKET_FUNCTIONS[k].forEach(l2 => addl2(l2));
            }
        }
    }

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

    function addl2(l2v) {
        if (level2values.indexOf(l2v) === -1)
            level2values.push(l2v);
    }

    function login(test_callback_for_replacing_socket_with_a_stub) {
        let new_socket = new net.Socket();
        if (test_callback_for_replacing_socket_with_a_stub)
            socket = test_callback_for_replacing_socket_with_a_stub(new_socket);
        else
            socket = new_socket;
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
            try {
                packets = _parse();
            } catch (e) {
                error_function(e);
            }
            if (packets) {
                if (packets.level2Packets.length && packets.level2Packets[0].packet.indexOf("69 5") === 0) {
                    socket.write(password + "\n");
                } else {
                    if (!preprocessor || !preprocessor(packets))
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
        if (preparser && preparser(databuffer)) {
            databuffer = "";
            return;
        }
        if (state === "login") {
            if (databuffer.indexOf("login") !== -1) {
                databuffer = "";
                socket.write("level1=13\n");
                socket.write(
                    "level2settings=" + L2.LEVEL2STRING(level2values) + "\n"
                );
                socket.write(user + "\n");
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
                            let hdrstr = currentLevel1.split("\r\n")[0];
                            //hdrstr.replace(/([\n\r])+$/, "");
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

    function ratingtype(v) {
        switch (v) {
            case "0":
                return "no games";
            case "1":
                return "provisional";
            case "2":
                return "established";
            default:
                return "?";
        }
    }

    function colorrequest(v) {
        switch (v) {
            case "-1":
                return null;
            case "0":
                return "black";
            case "1":
                return "white";
        }
    }

    function _processPackets(packets) {
        packets.level2Packets.forEach(function (p) {
            const p2 = _parseLevel2(p);
            switch (parseInt(p2.shift())) {
                case L2.ERROR:
                    if (functions.error) {
                        functions.error({
                            error_number: parseInt(p2[0]),
                            iso_language: p2[1],
                            error_text: p2[2],
                            url: p2[3]
                        });
                    }
                    break;
                case L2.FAIL:
                    if (functions.fail) {
                        functions.fail({
                            command_id: parseInt(p2[0]),
                            error_message: p2[1]
                        });
                    }
                    break;
                case L2.OFFERS_IN_MY_GAME:
                    if (functions.offers_in_my_game) {
                        save_offers[parseInt(p2[0])] = {
                            gamenumber: parseInt(p2[0]),
                            wdraw: p2[1] === "1",
                            bdraw: p2[2] === "1",
                            wadjourn: p2[3] === "1",
                            badjourn: p2[4] === "1",
                            wabort: p2[5] === "1",
                            babort: p2[6] === "1",
                            wtakeback: parseInt(p2[7]),
                            btakeback: parseInt(p2[8])
                        };
                        functions.offers_in_my_game(save_offers[parseInt(p2[0])]);
                    }
                    break;
                case L2.SEND_MOVES:
                    if (functions.move) {
                        functions.move({
                            gamenumber: parseInt(p2[0]),
                            algebraic_move: p2[1],
                            smith_move: p2[2],
                            time: parseInt(p2[3]),
                            clock: parseInt(p2[4]),
                            is_variation: p2[5] === "1"
                        });
                    }
                    break;
                case L2.MY_GAME_RESULT:
                    delete game_play_color[parseInt(p2[0])];
                    delete save_offers[parseInt(p2[0])];
                    if (functions.my_game_result) {
                        functions.my_game_result({
                            gamenumber: parseInt(p2[0]),
                            become_examined: p2[1] === "1",
                            game_result_code: p2[2],
                            score_string2: p2[3],
                            description_string: p2[4],
                            ECO: p2[5]
                        });
                    }
                    break;
                case L2.MY_GAME_STARTED:
                    game_play_color[parseInt(p2[0])] = (p2[1] === my_username ? "w" : "b");
                    if (functions.my_game_started) {
                        functions.my_game_started({
                            gamenumber: parseInt(p2[0]),
                            whitename: p2[1],
                            blackname: p2[2],
                            wild_number: parseInt(p2[3]),
                            rating_type: p2[4],
                            rated: p2[5] === "1",
                            white_initial: parseInt(p2[6]),
                            white_increment: parseInt(p2[7]),
                            black_initial: parseInt(p2[8]),
                            black_increment: parseInt(p2[9]),
                            played_game: p2[10] === "1",
                            ex_string: p2[11],
                            white_rating: parseInt(p2[12]),
                            black_rating: parseInt(p2[13]),
                            game_id: p2[14],
                            white_titles: p2[15].split(" "),
                            black_titles: p2[16].split(" "),
                            irregular_legality: p2[17],
                            irregular_semantics: p2[18],
                            uses_plunkers: p2[19],
                            fancy_timecontrol: p2[20],
                            promote_to_king: p2[21] === "1"
                        });
                    }
                    break;
                case L2.SEEK_REMOVED:
                    if (functions.seek_removed)
                        functions.seek_removed({
                            message_identifier: p.l1messageidentifier,
                            index: parseInt(p2[0]),
                            reasoncode: parseInt(p2[1])
                        });
                    break;
                case L2.SEEK:
                    //
                    if (functions.seek)
                        functions.seek({
                            message_identifier: p.l1messageidentifier,
                            index: parseInt(p2[0]),
                            name: p2[1],
                            titles: p2[2].split(" "),
                            rating: parseInt(p2[3]),
                            provisional_status: parseInt(p2[4]),
                            wild: parseInt(p2[5]),
                            rating_type: p2[6],
                            time: parseInt(p2[7]),
                            inc: parseInt(p2[8]),
                            rated: p2[9] === "1",
                            color: p2[10] === "-1" ? null : p2[10] === "0" ? "black" : "white",
                            minrating: parseInt(p2[11]),
                            maxrating: parseInt(p2[12]),
                            autoaccept: p2[13] === "1",
                            formula: p2[14],
                            fancy_time_control: p2[15]
                        });
                    break;
                case L2.WHO_AM_I:
                    my_username = p2[0];
                    write(null, "set style 13");
                    write(null, "set width 255");
                    if (functions.messages)
                        write(null, "messages");
                    if (functions.loggedin)
                        functions.loggedin({username: p2[0], titles: p2[1].split(" ")});
                    break;
                case L2.LOGIN_FAILED:
                    if (functions.login_failed)
                        functions.login_failed({code: parseInt(p2[0]), message: p2[1]});
                    break;
                case L2.MATCH:
                    if (functions.match)
                        functions.match({
                            message_identifier: p.l1messageidentifier,
                            challenger_name: p2[0],
                            challenger_rating: parseInt(p2[1]),
                            challenger_rating_type: ratingtype(p2[2]),
                            challenger_titles: p2[3].split(" "),
                            receiver_name: p2[4],
                            receiver_rating: parseInt(p2[5]),
                            receiver_rating_type: ratingtype(p2[6]),
                            receiver_titles: p2[7].split(" "),
                            wild_number: parseInt(p2[8]),
                            rating_type: p2[9],
                            is_it_rated: p2[10] === "1",
                            is_it_adjourned: p2[11] === "1",
                            challenger_time: p2[12],
                            challenger_inc: p2[13],
                            receiver_time: p2[14],
                            receiver_inc: p2[15],
                            challenger_color_request: colorrequest(p2[16]),
                            assess_loss: parseInt(p2[17]),
                            assess_draw: parseInt(p2[18]),
                            assess_win: parseInt(p2[19]),
                            fancy_time_control: p2[20]
                        });
                    break;
                case L2.MATCH_REMOVED:
                    if (functions.match_removed)
                        functions.match_removed({
                            message_identifier: p.l1messageidentifier,
                            challenger_name: p2[0],
                            receiver_name: p2[1],
                            explanation_string: p2[2]
                        });
                    break;
                default:
                    error_function("Unknown packet: " + p2);
            }
        });

        packets.level1Packets.forEach(function (p) {
            const p1 = _parseLevel1(p);
            const hdrstring = p1[0].split(" ");
            const cmd = parseInt(hdrstring[0]);
            const who = hdrstring[1];
            const arbitrary_string = hdrstring.length > 2 ? hdrstring[2] : undefined;
            switch (cmd) {
                case CN.SEEKING:
                    if(!functions.seek_failed)
                        return;
                    if(p1[1].indexOf("Your ad") !== -1)
                        return;
                    functions.seek_failed(p1[1]);
                    break;
                case CN.DECLINE:
                    if (save_offers) {
                        if (p1[1].indexOf("declines your draw offer") !== -1) {
                            update_offers_from_decline("draw", true);
                        } else if (p1[1].indexOf("draw declined") !== -1) {
                            update_offers_from_decline("draw", false);
                        } else if (p1[1].indexOf("declines to abort") !== -1) {
                            update_offers_from_decline("abort", true);
                        } else if (p1[1].indexOf("abort declined") !== -1) {
                            update_offers_from_decline("abort", false);
                        } else if (p1[1].indexOf("declines to adjourn") !== -1) {
                            update_offers_from_decline("adjourn", true);
                        } else if (p1[1].indexOf("adjourn declined") !== -1) {
                            update_offers_from_decline("adjourn", false);
                        } else if (p1[1].indexOf("declines your request to takeback") !== -1) {
                            update_offers_from_decline("takeback", true);
                        } else if (p1[1].indexOf("takeback declined") !== -1) {
                            update_offers_from_decline("takeback", false);
                        }
                    }
                    //write(null, "pending");
                    break;
            }
        });
    }

    //                            wdraw: p2[1] === "1",
    //                             bdraw: p2[2] === "1",
    //                             wadjourn: p2[3] === "1",
    //                             badjourn: p2[4] === "1",
    //                             wabort: p2[5] === "1",
    //                             babort: p2[6] === "1",
    //                             wtakeback: parseInt(p2[7]),
    //                             btakeback: parseInt(p2[8])
    function update_offers_from_decline(type, decliner) {
        if (functions.offers_in_my_game) {
            for (k in save_offers) {
                if (game_play_color[k]) {
                    const color = game_play_color[k];
                    const prefix = decliner ? color : (color === "w" ? "b" : "w");
                    if (save_offers[k][prefix + type]) {
                        if(type === "takeback")
                            save_offers[k][prefix + type] = 0;
                        else
                            save_offers[k][prefix + type] = false;
                        functions.offers_in_my_game(save_offers[k]);
                        return;
                    }
                }
            }
        }
    }

    function _parseLevel1(packet) {
        return packet.split("\r\n");
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

    function write(message_identifier, cmd) {
        if (sendpreprocessor && sendpreprocessor((!!message_identifier ? "`" + message_identifier + "`/" : "/") + cmd))
            return;
        if (!!message_identifier)
            socket.write("`" + message_identifier + "`");
        socket.write(cmd);
        socket.write("\n");
    }

    function match(message_identifier, name, time, increment, time2, increment2, rated, wild, color) {
        write(message_identifier, "match " + name + " " + time + " " + increment + " " + (time2 ? time2 : "") + " " + (increment2 ? increment2 : "") + " " + (rated ? "r" : "u") + " w" + wild + " " + (color ? color : "") + "\n");
    }

    // TODO: The match function assumes all parameters exist, the seek function does not. Which to do?
    function seek(message_identifier, time, inc, rated, wild, color, auto, minrating, maxrating) {
        let cmd = "seek";
        if (!!time) cmd += " " + time;
        if (!!inc) cmd += " " + inc;
        cmd += !!rated ? " r" : " u";
        cmd += " w" + (!!wild ? wild : "0");
        if (!!color) cmd += " " + color;
        cmd += (!!auto ? " a" : " m");
        cmd += " " + (!!minrating ? minrating : "0");
        cmd += "-" + (!!maxrating ? maxrating : "9999");
        write(message_identifier, cmd);
    }

    function unseek(message_identifier, index) {
        write(message_identifier, "unseek" + (!!index ? " " + index : ""));
    }

    function remove_all_matches_and_seeks(message_identifier) {
        write(message_identifier, "match");
    }

    function play(message_identifier, who) {
        write(message_identifier, "play" + (!!who ? " " + who : ""));
    }

    function accept(message_identifier, who) {
        write(message_identifier, "accept" + (!!who ? " " + who : ""));
    }

    function move(message_identifier, move) {
        write(message_identifier, "chessmove " + move);
    }

    function resign(message_identifier, who) {
        write(message_identifier, "resign" + (!!who ? " " + who : ""));
    }

    function decline(message_identifier, who_or_what) {
        write(message_identifier, "decline" + (!!who_or_what ? " " + who_or_what : ""));
    }

    function adjourn(message_identifier) {
        write(message_identifier, "adjourn");
    }

    function resume(message_identifier) {
        write(message_identifier, "resume");
    }

    function draw(message_identifier) {
        write(message_identifier, "draw");
    }

    function abort(message_identifier) {
        write(message_identifier, "abort");
    }

    function takeback(message_identifier, count) {
        write(message_identifier, "takeback" + (!!count ? " " + count : ""));
    }

    // noinspection JSUnusedGlobalSymbols
    return {
        /*
            Public API
         */
        login: function () {
            login();
        },
        test_login: function (test_callback_for_replacing_socket_with_a_stub) {
            login(test_callback_for_replacing_socket_with_a_stub);
        },
        logout: function () {
            logout();
        },

        match: function (message_identifier, name, time, increment, time2, increment2, rated, wild, color) {
            match(message_identifier, name, time, increment, time2, increment2, rated, wild, color);
        },
        seek: function (message_identifier, time, inc, rated, wild, color, auto, minrating, maxrating) {
            seek(message_identifier, time, inc, rated, wild, color, auto, minrating, maxrating);
        },
        unseek: function (message_identifier, index) {
            unseek(message_identifier, index);
        },
        remove_all_matches_and_seeks: function (message_identifier) {
            remove_all_matches_and_seeks(message_identifier);
        },
        accept: function (message_identifier, who) {
            accept(message_identifier, who);
        },
        play: function (message_identifier, who) {
            play(message_identifier, who);
        },
        move: function (message_identifier, _move) {
            move(message_identifier, _move);
        },
        resign: function (message_identifier, who) {
            resign(message_identifier, who);
        },
        decline: function (message_identifier, who) {
            decline(message_identifier, who);
        },
        adjourn: function (message_identifier) {
            adjourn(message_identifier);
        },
        resume: function (message_identifier) {
            resume(message_identifier);
        },
        draw: function (message_identifier) {
            draw(message_identifier);
        },
        abort: function (message_identifier) {
            abort(message_identifier);
        },
        takeback: function (message_identifier, count) {
            takeback(message_identifier, count);
        },

        test_socket_data: function (data) {
            socket_data(data);
        },

        active_level2: function () {
            return level2values.slice(0);
        }
    }
};

exports.LegacyICC = LegacyICC;
