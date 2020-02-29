"use strict";

module.exports = {
  CN: Object.freeze({
    S_UNKNOWN: 0,
    S_ILLEGAL_MOVE: 1,
    S_MOVE: 2,
    S_EDIT_EXAMINED: 3,
    S_PING_RESPONSE: 10,
    S_WEIRD: 11,
    S_REALLY_LOG_IN: 12,
    S_MOED: 13,
    S_EVENTS: 14,
    S_NEWS: 15,
    S_LOGOUT: 16,
    S_TIMEOUT: 17,
    S_CONNECT: 18,
    S_REALLY_QUIT: 19,
    S_LOGIN: 20,
    S_PASSWORD: 21,
    S_REGISTRATION: 22,
    S_EXTENSION: 23,
    S_AUTHENTICATION: 24,
    S_BAD: 25,
    S_AUTOMATIC: 26,
    S_CONFIRM: 27,
    S_MULTI_DISCARD: 28,
    S_IDLE: 29,
    S_ACK_PING: 30,
    S_MISCELLANEOUS: 31,
    ACCEPT0: 68,
    CC_LIST0: 69,
    BACK0: 70,
    FORWARD0: 71,
    EXAMINE0: 72,
    CLEARMESSAGES0: 73,
    TAKEBACK0: 74,
    STORED0: 75,
    BEST0: 76,
    LOGONS0: 77,
    QUOTA0: 78,
    QUIT_PLAY: 79,
    INFO0: 80,
    CENSOR: 81,
    CENSOR0: 82,
    INCHANNEL0: 83,
    ALLOBSERVERS0: 84,
    GAMES0: 85,
    WHISPER_TO: 86,
    KIBITZ_TO: 87,
    ACCESS0: 88,
    VARS0: 89,
    FINGER0: 90,
    FIRSTMOVE_QUEUE: 91,
    THREEMIN: 92,
    ECO0: 93,
    HISTORY0: 94,
    TIME0: 95,
    TELL0: 96,
    PLAYERS: 97,
    WHO0: 98,
    TELL_DOT: 99,
    XTELL: 100,
    TELL: 101,
    I: 102,
    SHOUT: 103,
    SHOUT0: 104,
    SLASH: 105,
    WHO: 106,
    SET: 107,
    FLAG: 108,
    SAY: 109,
    CHANNELTELL: 110,
    SSHOUT: 111,
    BAD: 112,
    KIBITZ: 113,

    WHISPER: 114,
    EXAMINE: 115,
    MEXAMINE: 116,
    COPYGAME0: 117,
    COPYGAME: 118,
    FORWARD: 119,
    BACK: 120,
    MATCH: 121,
    MATCH0: 122,
    ACCEPT: 123,
    HELP0: 124,
    HELP: 125,
    MORE: 126,
    NEWS: 127,
    NEWS0: 128,
    HISTORY: 129,
    FINGER: 130,
    VARS: 131,
    UPSTATISTICS: 132,
    UNEXAMINE: 133,
    ADJOURN: 134,
    ASSESS: 135,
    OBSERVE0: 136,
    OBSERVE: 137,
    FOLLOW0: 138,
    FOLLOW: 139,
    ECO: 140,
    STYLE: 141,
    BELL: 142,
    OPEN: 143,
    DECLINE: 144,
    REFRESH: 145,
    RESIGNADJ: 146,
    REVERT: 147,
    RATED: 148,
    RANK: 149,
    MOVES: 150,
    MAILOLDMOVES: 151,
    MAILSTORED: 152,
    MAILHELP: 153,
    PENDING: 154,
    GAMES: 155,
    ABORT: 156,
    ALLOBSERVERS: 157,
    INCHANNEL: 158,
    INFO: 159,
    MORETIME: 160,
    BEST: 161,
    QUIT: 162,
    QUOTA: 163,
    LLOGONS: 164,
    LHISTORY: 165,
    LOGONS: 166,
    TIME: 167,
    TAKEBACK: 168,
    SEARCH: 169,
    SEARCH0: 170,
    SMOVES: 171,
    SPOSITION: 172,
    PASSWORD: 173,
    MESSAGE: 174,
    MESSAGE0: 175,
    CLEARMESSAGES: 176,
    DATE: 177,
    LIST: 178,
    PLUS: 179,
    MINUS: 180,
    ZNOTL: 181,
    FLIP: 182,
    PROMOTE: 183,
    EXPUNGE: 184,
    IWCMATCH: 185,
    LIMITS: 186,
    PING: 187,
    EXTEND: 188,
    QTELL: 189,
    GETPI: 190,
    STARTSIMUL: 191,
    GOTO: 192,
    SETCLOCK: 193,
    LIBLIST: 194,
    LIBSAVE: 195,
    LIBDELETE: 196,
    LIBANNOTATE: 197,
    LIBKEEPEXAM: 198,
    PARTNER: 199,
    PARTNER0: 200,
    PTELL: 201,
    BUGWHO: 202,
    WILDRANK: 204,
    XOBSERVE: 205,
    PRIMARY: 206,
    DRAW: 207,
    RESIGN: 208,
    STATISTICS: 209,
    STORED: 210,
    CHANNELQTELL: 211,
    XPARTNER: 212,
    YFINGER: 213,
    SEEKING: 214,
    SOUGHT: 215,
    SET2: 216,
    PLAY: 217,
    UNSEEKING: 218,
    AWAY: 219,
    LAGSTATS: 220,
    COMMANDS: 221,
    REMATCH: 222,
    REGISTER: 223,
    RESUME: 224,
    CIRCLE: 225,
    ARROW: 226,
    BLANKING: 227,
    RELAY: 228,
    LOADGAME: 229,
    DRAWADJ: 230,
    ABORTADJ: 231,
    MAILNEWS: 232,
    QSET: 233,
    CC_START: 234,
    CC_LIST: 235,
    CC_MOVE: 236,
    CC_DELETE: 237,
    CC_QSTART: 238,
    CC_QLIST: 239,
    CC_QLABEL: 240,
    CC_QDELETE: 241,
    CC_QADJUDICATE: 242,
    CC_ASK_DIRECTOR: 243,
    LOADFEN: 244,
    GETPX: 245,
    UNRELAYED: 246,
    NORELAY: 247,
    REFER: 248,
    PGN: 249,
    SPGN: 250,
    QFOLLOW: 251,
    QUNFOLLOW: 252,
    QMATCH: 253,
    QPARTNER: 254,
    ISREGNAME: 255,
    REQUIRETICKET: 256,
    ANNOTATE: 257,
    CLEARBOARD: 258,
    REQUEST_WIN: 259,
    REQUEST_DRAW: 260,
    REQUEST_ABORT: 261,
    LOGPGN: 262,
    RESULT: 263,
    FEN: 264,
    SFEN: 265,
    SETGAMEPARAM: 266,
    TAG: 267,
    TOMOVE: 268,
    REGENTRY: 269,
    PERSONALINFO: 270,
    EVENTS: 271,
    QADDEVENT: 272,
    GLISTGROUPS: 273,
    GLISTMEMBERS: 274,
    GINVITE: 275,
    GJOIN: 276,
    GLISTINVITED: 277,
    GLISTJOINING: 278,
    GDESCRIBE: 279,
    GKICK: 280,
    GBEST: 281,
    SIMULIZE: 282,
    GAMEID: 283,
    FIVEMINUTE: 284,
    QIMPART: 285,
    GMESSAGE: 286,
    COMPLAIN: 287,
    LASTTELLS: 288,
    VIEW: 289,
    SHOWADMIN: 290,
    PSTAT: 291,
    BOARDINFO: 292,
    ADMIN: 300,
    ADMIN_UN: 301,
    ADJUDICATE: 302,
    ASET: 303,
    ASET0: 304,
    AWHO: 305,
    NUKE: 306,
    LOUDSHOUT: 307,
    TELLUNREG: 308,
    BROADCAST: 309,
    SHUTDOWN: 310,
    REMGAME: 311,
    ADDCOMMENT: 312,
    ADDRESS: 313,
    FINDADDRESS: 314,
    ADDPLAYER: 315,
    FORCEREGISTER: 316,
    SHOW_ALL_OPEN_FDS: 317,
    ALLOCS: 318,
    MAILPASSWORD: 319,
    REHASH: 320,
    REMPLAYER: 321,
    KEEPGAME: 322,
    EXTEND_PART: 323,
    PAYMENT: 324,
    BOGOMODE: 325,
    COOKIE: 326,
    COOKIE0: 327,
    SPOOF: 328,
    DUMP: 329,
    FINDIP: 330,
    FINDNAME: 331,
    GIVE_TICKET: 332,
    TAKE_TICKET: 333,
    C_PENDING: 334,
    C_OFFER: 335,
    C_WITHDRAW: 336,
    C_HISTORY: 337,
    C_ACCEPT: 338,
    C_DECLINE: 339,
    C_REFUND: 340,
    C_ISSUE: 341,
    C_PAY: 342,
    C_ACCRUED: 343,
    C_CLEAR: 344,
    C_BUY: 345,
    QSUGGEST: 350,
    RATING: 352,
    TEST: 353,
    FLUSH: 354,
    PDS: 355,
    USCFID: 356,
    FORFEITADJOURNED: 357,
    ACCOUNT: 358,
    SNUBBING: 359,
    COMMENTGAME: 360,
    R_RATING: 361,
    ATELL: 362,
    UNCOMMENT: 363,
    WSUGGEST: 364,
    SJIAD: 366,
    QRETRACT: 367,
    SQL: 368,
    PAYFAILURE: 369,
    RESTRICT: 370,
    SET_OTHER: 371,
    DEBUG: 372,
    PHRASELIST: 373,
    PHRASETELL: 374,
    PHRASEPTELL: 375,
    PHRASESAY: 376,
    CHECK_SPEAK: 377,
    UNOBSERVE: 378,
    UNOBSERVE0: 379,
    SLASH0: 380,
    RES_ADJ: 381,
    OLDMOVES: 382,
    UNCENSOR: 392,
    // QUITPLAY: 393,
    GETPS: 394,
    SETCLOCK_WHITE: 395,
    SETCLOCK_BLACK: 396,
    SETCLOCK_WHITE_QUIET: 397,
    SETCLOCK_BLACK_QUIET: 398,
    LIBAPPEND: 399,
    PREFRESH: 400,
    XKIBITZ: 401,
    XWHISPER: 402,
    QCLEAR: 403,
    APPEND: 404,
    UNCENSOR0: 405,
    FM0: 406,
    FM30: 407,
    POOL_P3: 408,
    POOL_P45: 409,
    POOL_P960: 410,
    EXIT: 411,
    EXIT_PLAY: 412,
    CC_START_BLACK: 413,
    CC_START_WHITE: 414,
    DB_MACHINE: 415,
    DB_MACHINES: 416,
    DB_BY_DISK: 417,
    DB_BY_MACID: 418,
    CN_45_MIN: 419,
    CN_1_MIN: 420,
    CN_15_MIN: 421,
    POOL_P5: 422,
    POOL_P15: 423,
    POOL_TUNE: 424,
    CN_960_JOIN: 425,
    FEN0: 426,
    POOL_P1: 427,
    DB_USERS: 428,
    //: 429, unused
    SET_QUIET: 430,
    CC_QMODIFY: 431,
    UNFOLLOW: 432,
    UNCIRCLE: 433,
    UNARROW: 434,
    SET_BLACK_NAME: 435,
    SET_WHITE_NAME: 436,
    REG_SUBMIT: 437,
    QCHAN_MINUS: 438,
    QCHAN_PLUS: 439,
    QREMOVE_EVENT: 440,
    RESET_RECORD: 441,
    COMMA_TELL: 442,
    csTEST_DG: 443,
    TEST_LOG: 444,
    MODERATE: 445,
    MODERATE0: 446,
    UNMODERATE: 447,
    CONSISTENCY_CHECK: 448,
    MOTD: 449,
    MOTD0: 450,
    TITLE_NEEDED: 451,
    SHOW_SPEAK: 452,
    SET_CLIENTID: 453,
    SET_SPEAK: 454,
    REG_RESPONSE: 455,
    SERVER: 456,
    QSIMULIZE: 457,
    LOADFEN_W20: 458,
    REVERSE: 459,
    SHUTDOWN_STAY: 460,
    SHUTDOWN_SLOW: 461,
    BAD_D: 462,
    ADMIN_ALREADY: 463,
    RESERVE: 464,
    ABORT_ADJUDICATE: 465,
    REHASH1: 467,
    REHASH2: 468,
    MAIL_MESSAGE: 469,
    FMESSAGE: 470,
    GFREE: 471,
    CHANGEPASSWORD: 473,
    LIST_OTHER: 474,
    CAPITALIZE: 476,
    SQL_CONNECT: 477,
    DUMP_ACCOUNTS: 478,
    LOCATION: 479,
    RATING_RECORD: 480,
    PROCESS_RESULT: 481,
    GUEST_IP: 482,
    DEBUG_GAME: 483,
    DEBUG_ANON0: 484,
    DEBUG_ANON1: 485,
    DEBUG_L2: 486,
    CLEAR_CLIENTID: 487,
    SHOW_COMMANDS: 488,
    SHOW_GUEST_COMMANDS: 489,
    COMPLAINT_STATUS: 490,
    FLUSH_PLAYERS: 491,
    SHOW_PASSWORD: 492,
    LOGOUT: 493,
    LOGOUT_QUIET: 494,
    RELAY_NOW: 495,
    LOGOUT_PLAY: 496,
    Z_REGISTER: 497,
    PLAYER_LOAD: 498,
    CONSISTANCY_CHECK: 499,
    GSPEC_LOAD: 500,
    GSPEC_SET_CLASS: 501,
    C_TRANSFER: 502,
    ORG_STATUS: 503,
    POOL_CHECKERS: 504,
    POOL_CHECKERS_SERVICE: 505,
    DB_BY_CLIENTID: 506,
    ZRATINGS0: 507,
    ZRATINGS: 508,
    LEAVEPOOL: 509,
    JOINPOOL: 517,
    POOL_P25: 523,
    COUNT: 524
  }),

  DG: Object.freeze({
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
    FORM_FEEDBACK: 117,
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
    COUNTRY: 152,
    FEATURES: 153,
    ERROR: 154,
    GROUP_INFO: 155,
    CHANNEL_INFO: 156,
    CHECKERS: 157,
    CLIENT_INFO: 158,
    ZRATING: 159,
    CORRESPONDENCE_MOVE: 160,
    CORRESPONDENCE_GAME: 161,
    NO_CORRESPONDENCE_GAME: 162,
    LIST_HEAD: 163,
    LIST_END: 164,
    LIST_ITEM: 165,
    LIST_ADDED: 166,
    LIST_REMOVED: 167,
    FAIL: 168,
    NOTE: 169,
    FIELD: 170,
    RATING: 171,
    END_PROFILE: 172,
    PSTAT2: 173,
    EXAMINERS_IN_GAME: 174,
    POOL_JOINED: 175,
    POOL_LEFT: 176,
    DG_25_5: 177,
    LOGIN_LIST_FRIENDS: 178,
    LOGIN_LIST_ALIASES: 179,
    LOGIN_LIST_MESSAGES: 180,
    LOGIN_LIST_ROOMS: 181,
    LOGIN_LIST_ADJOURNED_GAMES: 182,
    LOGIN_LIST_LIBRARY_GAMES: 183,
    LOGIN_LIST_HISTORY_GAMES: 184,
    LOGIN_LIST_CENSORS: 185,
    AUTH_URL: 186,
    PGN: 187,
    IN_CHANNEL: 188,
    COUNT: 189
  })
};
