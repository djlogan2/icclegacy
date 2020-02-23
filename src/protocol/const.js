module.exports = {
  SERVER_TIMEZONE: "America/New_York",

  AllowKibitzWhilePlaying: Object.freeze({
    // Never - kibitzes will be converted to whispers.
    NEVER: 0,

    // Always allow kibitzes.
    ALWAYS: 1,

    // Allow kibitzes in unrated games only.
    UNRATED_GAMES: 2
  }),

  AutoUnobserve: Object.freeze({
    NEVER: 0,

    // Automatically stop observing a game if you begin playing or examining.
    ON_EXAMINE_OR_PLAY: 1,

    // Automatically stop observing a game if you begin playing, observing or examining.
    // This flag will reset to Never once you logout.
    ON_EXAMINE_OR_OBSERVE_OR_PLAY_UNTIL_LOGOUT: 2,

    // Automatically stop observing a game if you begin playing, observing or examining.
    // Unline OnExamineOrObserveOrPlayUntilLogout, this flag will not reset on logout.
    ON_EXAMINE_OR_OBSERVE_OR_PLAY: 3
  }),

  BellRule: Object.freeze({
    // Never issue sound.
    NO_BELL: 0,

    // Sound on a move, notification, or match request.
    ALWAYS: 1,

    // Sound on opponent move only.
    ON_MOVE_ONLY: 2
  }),

  BusyLevel: Object.freeze({
    NOT_BUSY: 0,

    // People are told you are busy when they send you a "tell".
    BUSY_MESSAGE: 1,

    // Same like BUSY_MESSAGE, plus you do not see their "tell".
    BUSY_MESSAGE_AND_DISCARD_TELL: 2
  }),

  GameMailFormat: Object.freeze({
    // Old ICC format.
    OLD_FORMAT: 0,

    // PGN format (Portable Game Notation).
    PGN: 1,

    // PGN with clock times.
    PGN_WITH_CLOCKS: 2
  }),

  GameQuietnessLevel: Object.freeze({
    ALLOW_TELLS: 0,
    ALLOW_OPPONENT_TELLS_ONLY: 1,
    FORBID_TELLS: 2
  }),

  HelpLanguage: Object.freeze({
    ENGLISH: "English",
    SPANISH: "Spanish",
    ITALIAN: "Italian",
    SWEDISH: "Swedish",
    FINNISH: "Finnish",
    DUTCH: "Dutch",
    PORTUGUESE: "Portuguese",
    RUSSIAN: "Russian",
    FRENCH: "French",
    GREEK: "Greek",
    NORWEGIAN: "Norwegian",
    PHILIPPINE: "Philippine",
    GERMAN: "German",
    DANISH: "Danish",
    ICELANDIC: "Icelandic",
    UKRAINIAN: "Ukrainian"
  }),

  SeekVisibility: Object.freeze({
    NEVER: 0,
    WHEN_BROWSING_ONLY: 1,
    ALWAYS: 2
  }),

  TellHighlight: Object.freeze({
    NO_HIGHLIGHT: 0,
    INVERSE_VIDEO: 1,
    BOLD_FACE: 2,
    INVERSE_VIDEO_AND_BOLD_FACE: 3,
    UNDERLINE: 4,
    INVERSE_VIDEO_AND_UNDERLINE: 5,
    BOLD_FACE_AND_UNDERLINE: 6,
    INVERSE_VIDEO_AND_BOLD_FACE_AND_UNDERLINE: 7
  }),

  TellType: Object.freeze({
    // The tell is from a game opponent.
    SAY: 0,

    // The tell is from a specific player.
    TELL: 1,

    // The tell is from a bughouse partner.
    PTELL: 2,

    // The tell is from a tournament director.
    QTELL: 3,

    // The tell is from an admin or helper.
    ATELL: 4
  }),

  WhisperVisibility: Object.freeze({
    NEVER: 0,
    ALWAYS: 1,
    TITLED_PLAYER_ONLY: 2
  }),

  Wild: Object.freeze({
    CHESS: 0,
    SHUFFLE_BOTH: 1,
    SHUFFLE_MIRROR: 2,
    RANDOM_MIRROR: 3,
    RANDOM_SHUFFLE: 4,
    REVERSED: 5,
    EMPTY_BOARD: 6,
    KPPP_VS_KPPP: 7,
    ADVANCED_PAWNS: 8,
    TWO_KINGS_EACH: 9,
    PAWN_MOVE_ODDS: 10,
    KNIGHT_ODDS: 11,
    ROOK_ODDS: 12,
    QUEEN_ODDS: 13,
    ROOKS_ODDS_A3: 14,
    KBN_VS_K: 15,
    KRIEG_SPIEL: 16,
    LOSERS_CHESS: 17,
    POWER_CHESS: 18,
    KNN_VS_KP: 19,
    LOAD_GAME: 20,
    THEMATIC: 21,
    CHESS960: 22,
    CRAZY_HOUSE: 23,
    BUG_HOUSE: 24,
    THREE_CHECKS: 25,
    GIVE_AWAY: 26,
    ATOMIC: 27,
    SHATRANJ: 28,
    RANDOM_WILD: 29,
    CHECKERS: 30
  })
};
