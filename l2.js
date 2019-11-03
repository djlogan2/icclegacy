module.exports = Object.freeze({
    WHO_AM_I: 0,
    PLAYER_ARRIVED: 1,
    PLAYER_LEFT: 2,
    BULLET: 3,
    BLITZ: 4,
    STANDARD: 5,
    WILD: 6,
    BUGHOUSE: 7,
    TIMESTAMP: 8,
    TITLES: 9,
    OPEN: 10,
    STATE: 11,
    GAME_STARTED: 12,
    GAME_RESULT: 13,
    EXAMINED_GAME_IS_GONE: 14,
    MY_GAME_STARTED: 15,
    MY_GAME_RESULT: 16,
    MY_GAME_ENDED: 17,
    STARTED_OBSERVING: 18,
    STOP_OBSERVING: 19,
    PLAYERS_IN_MY_GAME: 20,
    OFFERS_IN_MY_GAME: 21,
    TAKEBACK: 22,
    BACKWARD: 23,
    SEND_MOVES: 24,
    MOVE_LIST: 25,
    KIBITZ: 26,
    PEOPLE_IN_MY_CHANNEL: 27,
    CHANNEL_TELL: 28,
    MATCH: 29,
    MATCH_REMOVED: 30,
    PERSONAL_TELL: 31,
    SHOUT: 32,
    MOVE_ALGEBRAIC: 33,
    MOVE_SMITH: 34,
    MOVE_TIME: 35,
    MOVE_CLOCK: 36,
    BUGHOUSE_HOLDINGS: 37,
    SET_CLOCK: 38,
    FLIP: 39,
    ISOLATED_BOARD: 40,
    REFRESH: 41,
    ILLEGAL_MOVE: 42,
    MY_RELATION_TO_GAME: 43,
    PARTNERSHIP: 44,
    SEES_SHOUTS: 45,
    CHANNELS_SHARED: 46,
    MY_VARIABLE: 47,
    MY_STRING_VARIABLE: 48,
    JBOARD: 49,
    SEEK: 50,
    SEEK_REMOVED: 51,
    MY_RATING: 52,
    SOUND: 53,
    UNUSED_54: 54,
    PLAYER_ARRIVED_SIMPLE: 55,
    MSEC: 56,
    BUGHOUSE_PASS: 57,
    UNUSED_58: 58,
    CIRCLE: 59,
    ARROW: 60,
    MORETIME: 61,
    PERSONAL_TELL_ECHO: 62,
    SUGGESTION: 63,
    NOTIFY_ARRIVED: 64,
    NOTIFY_LEFT: 65,
    NOTIFY_OPEN: 66,
    NOTIFY_STATE: 67,
    MY_NOTIFY_LIST: 68,
    LOGIN_FAILED: 69,
    FEN: 70,
    UNUSED_71: 71,
    GAMELIST_BEGIN: 72,
    GAMELIST_ITEM: 73,
    IDLE: 74,
    ACK_PING: 75,
    RATING_TYPE_KEY: 76,
    GAME_MESSAGE: 77,
    UNACCENTED: 78,
    STRINGLIST_BEGIN: 79,
    STRINGLIST_ITEM: 80,
    DUMMY_RESPONSE: 81,
    CHANNEL_QTELL: 82,
    PERSONAL_QTELL: 83,
    SET_BOARD: 84,
    MATCH_ASSESSMENT: 85,
    LOG_PGN: 86,
    NEW_MY_RATING: 87,
    LOSERS: 88,
    UNCIRCLE: 89,
    UNARROW: 90,
    WSUGGEST: 91,
    UNUSED_92: 92,
    UNUSED_93: 93,
    MESSAGELIST_BEGIN: 94,
    MESSAGELIST_ITEM: 95,
    LIST: 96,
    SJI_AD: 97,
    UNUSED_98: 98,
    QRETRACT: 99,
    MY_GAME_CHANGE: 100,
    POSITION_BEGIN: 101,
    UNUSED_102: 102,
    TOURNEY: 103,
    REMOVE_TOURNEY: 104,
    DIALOG_START: 105,
    DIALOG_DATA: 106,
    DIALOG_DEFAULT: 107,
    DIALOG_END: 108,
    DIALOG_RELEASE: 109,
    POSITION_BEGIN2: 110,
    PAST_MOVE: 111,
    PGN_TAG: 112,
    IS_VARIATION: 113,
    PASSWORD: 114,
    UNUSED_115: 115,
    WILD_KEY: 116,
    UNUSED_117: 117,
    UNUSED_118: 118,
    KEY_VERSION: 119,
    SWITCH_SERVERS: 120,
    CRAZYHOUSE: 121,
    UNUSED_122: 122,
    UNUSED_123: 123,
    SET2: 124,
    FIVEMINUTE: 125,
    ONEMINUTE: 126,
    UNUSED_127: 127,
    MUGSHOT: 128,
    TRANSLATION_OKAY: 129,
    UNUSED_130: 130,
    UID: 131,
    KNOWS_FISCHER_RANDOM: 132,
    UNUSED_133: 133,
    WEB_AUTH: 134,
    UNUSED_135: 135,
    COMMAND: 136,
    TOURNEY_GAME_STARTED: 137,
    TOURNEY_GAME_ENDED: 138,
    MY_TURN: 139,
    CORRESPONDENCE_RATING: 140,
    DISABLE_PREMOVE: 141,
    PSTAT: 142,
    BOARDINFO: 143,
    MOVE_LAG: 144,
    FIFTEENMINUTE: 145,
    UNUSED_146: 146,
    UNUSED_147: 147,
    UNUSED_148: 148,
    THREEMINUTE: 149,
    FORTYFIVEMINUTE: 150,
    CHESS960: 151,
    FCOUNTRY: 152,
    FEATURES: 153,
    ERROR: 154,
    DG_155: 155,
    DG_156: 156,
    DG_157: 157,
    DG_158: 158,
    DG_159: 159,
    DG_160: 160,
    DG_161: 161,
    DG_162: 162,
    DG_163: 163,
    DG_164: 164,
    DG_165: 165,
    DG_166: 166,
    DG_167: 167,
    DG_168: 168,
    DG_169: 169,
    DG_170: 170,
    DG_171: 171,
    DG_172: 172,
    DG_173: 173,
    DG_174: 174,
    DG_175: 175,
    DG_176: 176,
    DG_177: 177,
    DG_178: 178,
    DG_179: 179,
    DG_180: 180,
    DG_181: 181,
    DG_182: 182,
    DG_183: 183,
    DG_184: 184,
    DG_185: 185,
    DG_186: 186,
    DG_187: 187,
    DG_188: 188,
    DG_189: 189,
    DG_190: 190,
    DG_191: 191,
    DG_192: 192,
    DG_193: 193,
    DG_194: 194,
    DG_195: 195,
    DG_196: 196,
    DG_197: 197,
    DG_198: 198,
    DG_199: 199
});

/**
 * @return {string}
 */

function LEVEL2STRING(arg) {
    if (!Array.isArray(arg)) arg = [arg];
    arg.sort(function (a, b) {
        return a - b;
    });

    let max = arg[arg.length - 1];
    let y = 0;
    let str = "";

    for (let x = 0; x <= max; x++) {
        if (y < arg.length && x === arg[y]) {
            str += "1";
            y++;
        } else str += "0";
    }

    return str;
}
