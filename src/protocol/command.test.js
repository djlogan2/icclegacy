"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { INVALID_GAME_ID, Command, Meta, Date, IllegalMove, Finger, Glicko, List, Minus, Observe, Pgn, Plus, Vars, YFinger, createCommand } = require("./command");
const { CN } = require("./id");
const {
  AllowKibitzWhilePlaying,
  AutoUnobserve,
  BellRule,
  BusyLevel,
  GameMailFormat,
  GameQuietnessLevel,
  HelpLanguage,
  SeekVisibility,
  TellHighlight,
  WhisperVisibility,
  Wild
} = require("./const");

const testMeta = new Meta(999, "test", null);

describe("Command", () => {
  describe("Minus", () => {
    it("interprets real server output correctly", () => {
      const cmd = new Minus(testMeta, `Removing "player93248" from the list.`, null);
      assert.isTrue(cmd.success());
    });

    it("ignores new lines", () => {
      const tests = ["Removed player93248.\r\n", "Removed player93248.\r", "Removed player93248.\n", "Removed player93248."];
      for (let t of tests) {
        const cmd = new Minus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("allows multi-word args", () => {
      const cmd = new Minus(testMeta, "Removed some player9843.", null);
      assert.isTrue(cmd.success());
    });

    it("fails with invalid content", () => {
      const cmd = new Minus(testMeta, "Some random text.", null);
      assert.isFalse(cmd.success());
    });
  });

  describe("Observe", () => {
    it("parses game id", () => {
      const cmd = new Observe(testMeta, "You are now observing game 657.\r\n", null);
      assert.equal(cmd.gameId, "657");
    });

    it("game id is invalid on parse error", () => {
      const cmd = new Observe(testMeta, "1nv@lId 5tr1ng", null);
      assert.equal(cmd.gameId, INVALID_GAME_ID);
    });
  });

  describe("Plus", () => {
    it("interprets real server output correctly", () => {
      const tests = ["You have been added to player234's simul list.", "added to player98324 list"];
      for (let t of tests) {
        const cmd = new Plus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("ignores new lines", () => {
      const tests = ["player93248 added.\r\n", "player93248 added.\r", "player93248 added.\n", "player93248 added."];
      for (let t of tests) {
        const cmd = new Plus(testMeta, t, null);
        assert.isTrue(cmd.success(), t);
      }
    });

    it("allows multi-word args", () => {
      const cmd = new Plus(testMeta, "some player9843 added.", null);
      assert.isTrue(cmd.success());
    });

    it("fails with invalid content", () => {
      const cmd = new Plus(testMeta, "Some random text.", null);
      assert.isFalse(cmd.success());
    });
  });

  describe("Vars can parse", () => {
    it("my variables", () => {
      const cmd = new Vars(
        testMeta,
        `Here are the values of your variables:
                
   rated=0 wild=30 time=2 inc=12 noescape=0 notakeback=0
   minseek=0 maxseek=9999 manualaccept=1 useformula=1
   open=1 ropen=1 wopen=1 ccopen=0 mood=0 seek=0 sfilter=r-Bm
   shout=0 sshout=0 kib=1 tell=0 ctell=0 otell=0 pin=0 gin=0 quietplay=0 tol=4 busy=0
   style=13 width=79 height=24 wrap=0 prompt=1 highlight=0 bell=0
   oldmatch=0 examine=1 unobserve=0 autoflag=1
   who="" players="ab" lang="English" webhelp=1 allowkib=2 pstat=0
   messmail=0 automail=0 mailformat=2 addresspublic=0 namepublic=0 subscribe=1
   Channels: 1 97 100 165 220 221 225 226 227 228 230 231 232 250 272
   interface="BlitzIn 3.09.00.en"`,
        null
      );
      assert.isFalse(cmd.notFound());
      assert.isTrue(cmd.isMyVars());
      assert.isNull(cmd.username());
      assert.isFalse(cmd.rated());
      assert.equal(cmd.wild(), Wild.CHECKERS);
      assert.equal(cmd.time(), 120000);
      assert.equal(cmd.increment(), 12000);
      assert.isFalse(cmd.noEscape());
      assert.isFalse(cmd.noTakeback());
      assert.equal(cmd.minSeek(), 0);
      assert.equal(cmd.maxSeek(), 9999);
      assert.isTrue(cmd.manualAccept());
      assert.isTrue(cmd.useFormula());
      assert.isTrue(cmd.open());
      assert.isTrue(cmd.ropen());
      assert.isTrue(cmd.wopen());
      assert.isFalse(cmd.ccopen());
      assert.equal(cmd.mood(), 0);
      assert.instanceOf(cmd.sfilter(), Object);
      assert.equal(cmd.formula(), "");
      assert.equal(cmd.seek(), SeekVisibility.NEVER);
      assert.isFalse(cmd.shout());
      assert.isFalse(cmd.sshout());
      assert.equal(cmd.kib(), WhisperVisibility.ALWAYS);
      assert.isFalse(cmd.tell());
      assert.isFalse(cmd.pin());
      assert.isFalse(cmd.gin());
      assert.equal(cmd.quietplay(), GameQuietnessLevel.ALLOW_TELLS);
      assert.equal(cmd.tol(), 4);
      assert.equal(cmd.busy(), BusyLevel.NOT_BUSY);
      assert.equal(cmd.style(), 13);
      assert.equal(cmd.width(), 79);
      assert.equal(cmd.height(), 24);
      assert.isFalse(cmd.wrap());
      assert.isTrue(cmd.prompt());
      assert.equal(cmd.highlight(), TellHighlight.NO_HIGHLIGHT);
      assert.equal(cmd.bell(), BellRule.NO_BELL);
      assert.isFalse(cmd.oldmatch());
      assert.isTrue(cmd.examine());
      assert.equal(cmd.unobserve(), AutoUnobserve.NEVER);
      assert.isTrue(cmd.autoflag());
      assert.equal(cmd.who(), "");
      assert.equal(cmd.players(), "ab");
      assert.equal(cmd.lang(), HelpLanguage.ENGLISH);
      assert.isTrue(cmd.webhelp());
      assert.equal(cmd.allowkib(), AllowKibitzWhilePlaying.UNRATED_GAMES);
      assert.isFalse(cmd.pstat());
      assert.isFalse(cmd.messmail());
      assert.isFalse(cmd.automail());
      assert.equal(cmd.mailformat(), GameMailFormat.PGN_WITH_CLOCKS);
      assert.isFalse(cmd.addresspublic());
      assert.isFalse(cmd.namepublic());
      assert.isTrue(cmd.subscribe());
      assert.sameMembers(cmd.channels(), [1, 97, 100, 165, 220, 221, 225, 226, 227, 228, 230, 231, 232, 250, 272]);
      assert.equal(cmd.interface(), "BlitzIn 3.09.00.en");
    });

    it("other variables", () => {
      const cmd = new Vars(
        testMeta,
        `Variable settings of tibold:

   rated=0 wild=0 time=2 inc=12 noescape=0 notakeback=0
   minseek=0 maxseek=9999 manualaccept=0 useformula=0
   open=1 ropen=1 wopen=1 ccopen=1 mood=0 seek=0 sfilter=
   shout=0 sshout=0 kib=1 tell=0 ctell=0 otell=0 pin=0 gin=0 quietplay=0 busy=0
   style=12 width=79 height=24 wrap=0 prompt=1 highlight=0 bell=1
   oldmatch=0 examine=1 unobserve=0 autoflag=1
   who="" players="ab" lang="English" webhelp=1 allowkib=2 pstat=0
   messmail=0 automail=0 mailformat=2 addresspublic=0 namepublic=0 subscribe=1`,
        null
      );
      assert.isFalse(cmd.notFound());
      assert.isFalse(cmd.isMyVars());
      assert.equal(cmd.username(), "tibold");
      assert.isFalse(cmd.rated());
      assert.equal(cmd.wild(), Wild.CHESS);
      assert.equal(cmd.time(), 120000);
      assert.equal(cmd.increment(), 12000);
      assert.isFalse(cmd.noEscape());
      assert.isFalse(cmd.noTakeback());
      assert.equal(cmd.minSeek(), 0);
      assert.equal(cmd.maxSeek(), 9999);
      assert.isFalse(cmd.manualAccept());
      assert.isFalse(cmd.useFormula());
      assert.isTrue(cmd.open());
      assert.isTrue(cmd.ropen());
      assert.isTrue(cmd.wopen());
      assert.isTrue(cmd.ccopen());
      assert.equal(cmd.mood(), 0);
      assert.instanceOf(cmd.sfilter(), Object);
      assert.equal(cmd.formula(), "");
      assert.equal(cmd.seek(), SeekVisibility.NEVER);
      assert.isFalse(cmd.shout());
      assert.isFalse(cmd.sshout());
      assert.equal(cmd.kib(), WhisperVisibility.ALWAYS);
      assert.isFalse(cmd.tell());
      assert.isFalse(cmd.pin());
      assert.isFalse(cmd.gin());
      assert.equal(cmd.quietplay(), GameQuietnessLevel.ALLOW_TELLS);
      assert.equal(cmd.tol(), 4);
      assert.equal(cmd.busy(), BusyLevel.NOT_BUSY);
      assert.equal(cmd.style(), 12);
      assert.equal(cmd.width(), 79);
      assert.equal(cmd.height(), 24);
      assert.isFalse(cmd.wrap());
      assert.isTrue(cmd.prompt());
      assert.equal(cmd.highlight(), TellHighlight.NO_HIGHLIGHT);
      assert.equal(cmd.bell(), BellRule.ALWAYS);
      assert.isFalse(cmd.oldmatch());
      assert.isTrue(cmd.examine());
      assert.equal(cmd.unobserve(), AutoUnobserve.NEVER);
      assert.isTrue(cmd.autoflag());
      assert.equal(cmd.who(), "");
      assert.equal(cmd.players(), "ab");
      assert.equal(cmd.lang(), HelpLanguage.ENGLISH);
      assert.isTrue(cmd.webhelp());
      assert.equal(cmd.allowkib(), AllowKibitzWhilePlaying.UNRATED_GAMES);
      assert.isFalse(cmd.pstat());
      assert.isFalse(cmd.messmail());
      assert.isFalse(cmd.automail());
      assert.equal(cmd.mailformat(), GameMailFormat.PGN_WITH_CLOCKS);
      assert.isFalse(cmd.addresspublic());
      assert.isFalse(cmd.namepublic());
      assert.isTrue(cmd.subscribe());
      assert.sameMembers(cmd.channels(), []);
      assert.equal(cmd.interface(), "");
    });

    it("variables with wrapped lines", () => {
      const cmd = new Vars(
        testMeta,
        `Variable settings of Azmaiparashvili:

   rated=1 wild=0 time=3 inc=0 noescape=0 notakeback=0
   minseek=3050 maxseek=9999 manualaccept=1 useformula=1
   open=1 ropen=1 wopen=1 ccopen=0 mood=0 seek=0 sfilter=m
   shout=0 sshout=0 kib=1 tell=0 ctell=0 otell=0 pin=0 gin=0 quietplay=0 busy=0
   style=13 width=79 height=24 wrap=0 prompt=0 highlight=0 bell=2
   oldmatch=0 examine=1 unobserve=2 autoflag=1
   who="" players="ab" lang="English" webhelp=1 allowkib=1 pstat=0
   messmail=0 automail=0 mailformat=1 addresspublic=0 namepublic=1 subscribe=1
   formula="lag<1000  & rated  & noescape  & rating >= 3000  & (rating >
\\   myrating-150)"
   Channels: 3 75 165 220 221 227 280
   interface="iPhone iPhone OS 8.1.3 Build 10732"`,
        null
      );
      assert.isFalse(cmd.notFound());
      assert.isFalse(cmd.isMyVars());
      assert.equal(cmd.username(), "Azmaiparashvili");
      assert.isTrue(cmd.rated());
      assert.equal(cmd.wild(), Wild.CHESS);
      assert.equal(cmd.time(), 180000);
      assert.equal(cmd.increment(), 0);
      assert.isFalse(cmd.noEscape());
      assert.isFalse(cmd.noTakeback());
      assert.equal(cmd.minSeek(), 3050);
      assert.equal(cmd.maxSeek(), 9999);
      assert.isTrue(cmd.manualAccept());
      assert.isTrue(cmd.useFormula());
      assert.isTrue(cmd.open());
      assert.isTrue(cmd.ropen());
      assert.isTrue(cmd.wopen());
      assert.isFalse(cmd.ccopen());
      assert.equal(cmd.mood(), 0);
      assert.instanceOf(cmd.sfilter(), Object);
      assert.equal(cmd.formula(), "lag<1000  & rated  & noescape  & rating >= 3000  & (rating > myrating-150)");
      assert.equal(cmd.seek(), SeekVisibility.NEVER);
      assert.isFalse(cmd.shout());
      assert.isFalse(cmd.sshout());
      assert.equal(cmd.kib(), WhisperVisibility.ALWAYS);
      assert.isFalse(cmd.tell());
      assert.isFalse(cmd.pin());
      assert.isFalse(cmd.gin());
      assert.equal(cmd.quietplay(), GameQuietnessLevel.ALLOW_TELLS);
      assert.equal(cmd.tol(), 4);
      assert.equal(cmd.busy(), BusyLevel.NOT_BUSY);
      assert.equal(cmd.style(), 13);
      assert.equal(cmd.width(), 79);
      assert.equal(cmd.height(), 24);
      assert.isFalse(cmd.wrap());
      assert.isFalse(cmd.prompt());
      assert.equal(cmd.highlight(), TellHighlight.NO_HIGHLIGHT);
      assert.equal(cmd.bell(), BellRule.ON_MOVE_ONLY);
      assert.isFalse(cmd.oldmatch());
      assert.isTrue(cmd.examine());
      assert.equal(cmd.unobserve(), AutoUnobserve.ON_EXAMINE_OR_OBSERVE_OR_PLAY_UNTIL_LOGOUT);
      assert.isTrue(cmd.autoflag());
      assert.equal(cmd.who(), "");
      assert.equal(cmd.players(), "ab");
      assert.equal(cmd.lang(), HelpLanguage.ENGLISH);
      assert.isTrue(cmd.webhelp());
      assert.equal(cmd.allowkib(), AllowKibitzWhilePlaying.ALWAYS);
      assert.isFalse(cmd.pstat());
      assert.isFalse(cmd.messmail());
      assert.isFalse(cmd.automail());
      assert.equal(cmd.mailformat(), GameMailFormat.PGN);
      assert.isFalse(cmd.addresspublic());
      assert.isTrue(cmd.namepublic());
      assert.isTrue(cmd.subscribe());
      assert.sameMembers(cmd.channels(), [3, 75, 165, 220, 221, 227, 280]);
      assert.equal(cmd.interface(), "iPhone iPhone OS 8.1.3 Build 10732");
    });

    it("variables with single channel", () => {
      const cmd = new Vars(
        testMeta,
        `Variable settings of Azmaiparashvili:

   rated=1 wild=0 time=3 inc=0 noescape=0 notakeback=0
   minseek=3050 maxseek=9999 manualaccept=1 useformula=1
   open=1 ropen=1 wopen=1 ccopen=0 mood=0 seek=0 sfilter=m
   shout=0 sshout=0 kib=1 tell=0 ctell=0 otell=0 pin=0 gin=0 quietplay=0 busy=0
   style=13 width=79 height=24 wrap=0 prompt=0 highlight=0 bell=2
   oldmatch=0 examine=1 unobserve=2 autoflag=1
   who="" players="ab" lang="English" webhelp=1 allowkib=1 pstat=0
   messmail=0 automail=0 mailformat=1 addresspublic=0 namepublic=1 subscribe=1
   formula="lag<1000  & rated  & noescape  & rating >= 3000  & (rating >
\\   myrating-150)"
   Channel: 3
   interface="iPhone iPhone OS 8.1.3 Build 10732"`,
        null
      );
      assert.isFalse(cmd.notFound());
      assert.isFalse(cmd.isMyVars());
      assert.equal(cmd.username(), "Azmaiparashvili");
      assert.isTrue(cmd.rated());
      assert.equal(cmd.wild(), Wild.CHESS);
      assert.equal(cmd.time(), 180000);
      assert.equal(cmd.increment(), 0);
      assert.isFalse(cmd.noEscape());
      assert.isFalse(cmd.noTakeback());
      assert.equal(cmd.minSeek(), 3050);
      assert.equal(cmd.maxSeek(), 9999);
      assert.isTrue(cmd.manualAccept());
      assert.isTrue(cmd.useFormula());
      assert.isTrue(cmd.open());
      assert.isTrue(cmd.ropen());
      assert.isTrue(cmd.wopen());
      assert.isFalse(cmd.ccopen());
      assert.equal(cmd.mood(), 0);
      assert.instanceOf(cmd.sfilter(), Object);
      assert.equal(cmd.formula(), "lag<1000  & rated  & noescape  & rating >= 3000  & (rating > myrating-150)");
      assert.equal(cmd.seek(), SeekVisibility.NEVER);
      assert.isFalse(cmd.shout());
      assert.isFalse(cmd.sshout());
      assert.equal(cmd.kib(), WhisperVisibility.ALWAYS);
      assert.isFalse(cmd.tell());
      assert.isFalse(cmd.pin());
      assert.isFalse(cmd.gin());
      assert.equal(cmd.quietplay(), GameQuietnessLevel.ALLOW_TELLS);
      assert.equal(cmd.tol(), 4);
      assert.equal(cmd.busy(), BusyLevel.NOT_BUSY);
      assert.equal(cmd.style(), 13);
      assert.equal(cmd.width(), 79);
      assert.equal(cmd.height(), 24);
      assert.isFalse(cmd.wrap());
      assert.isFalse(cmd.prompt());
      assert.equal(cmd.highlight(), TellHighlight.NO_HIGHLIGHT);
      assert.equal(cmd.bell(), BellRule.ON_MOVE_ONLY);
      assert.isFalse(cmd.oldmatch());
      assert.isTrue(cmd.examine());
      assert.equal(cmd.unobserve(), AutoUnobserve.ON_EXAMINE_OR_OBSERVE_OR_PLAY_UNTIL_LOGOUT);
      assert.isTrue(cmd.autoflag());
      assert.equal(cmd.who(), "");
      assert.equal(cmd.players(), "ab");
      assert.equal(cmd.lang(), HelpLanguage.ENGLISH);
      assert.isTrue(cmd.webhelp());
      assert.equal(cmd.allowkib(), AllowKibitzWhilePlaying.ALWAYS);
      assert.isFalse(cmd.pstat());
      assert.isFalse(cmd.messmail());
      assert.isFalse(cmd.automail());
      assert.equal(cmd.mailformat(), GameMailFormat.PGN);
      assert.isFalse(cmd.addresspublic());
      assert.isTrue(cmd.namepublic());
      assert.isTrue(cmd.subscribe());
      assert.sameMembers(cmd.channels(), [3]);
      assert.equal(cmd.interface(), "iPhone iPhone OS 8.1.3 Build 10732");
    });

    it("unexisting player", () => {
      ///"nodechessclient" does not match any player's name exactly.
      const cmd = new Vars(testMeta, `"test-user" does not match any player's name exactly.`, null);
      assert.isTrue(cmd.notFound());
      assert.isFalse(cmd.isMyVars());
      assert.isNull(cmd.username());
      assert.isFalse(cmd.rated());
    });
  });

  describe("YFinger can parse", () => {
    it("existing player", () => {
      const cmd = new YFinger(
        testMeta,
        `Name Asido
OnFor 4056
Idle 0
BulRat 1024
BulNeed 8
BulWin 0
BulLoss 11
BulDraw 0
BliRat 623
BliNeed 2
BliWin 3
BliLoss 44
BliDraw 0
BliBest 700 (02 Apr 2014)
StaRat 1009
StaNeed 6
StaWin 0
StaLoss 1
StaDraw 0
5-mRat 1262
5-mNeed 8
5-mWin 0
5-mLoss 2
5-mDraw 0
1-mRat 445
1-mNeed 8
1-mWin 0
1-mLoss 23
1-mDraw 0
1-mBest 451 (23 Oct 2013)
15-Rat 1181
15-Need 4
15-Win 0
15-Loss 1
15-Draw 0
CorRat 1691
CorWin 1
CorLoss 0
CorDraw 0
3-mRat 663
3-mNeed 8
3-mWin 0
3-mLoss 4
3-mDraw 0
CheRat 821
CheNeed 8
CheWin 0
CheLoss 1
CheDraw 0
Glicko  750 (146)
Hours 517.41
Percent 3.65
Exempt yes
Note 1 
Note 2 
Note 3 
Note 4 
Note 5 
Note 6 
Note 7 
Note 8 
Note 9 1
Note 10 
Address asido4@gmail.com`,
        null
      );

      assert.isFalse(cmd.notFound());
      assert.equal(cmd.name(), "Asido");
      assert.equal(cmd.onFor(), 4056000);
      assert.equal(cmd.idleFor(), 0);
      assert.deepEqual(cmd.glicko(), new Glicko(750, 146));
      assert.equal(cmd.totalOnline(), 1862675000);
      assert.equal(cmd.onlinePercentageSinceRegistration(), 3.65);
      assert.isTrue(cmd.isExempt());
      assert.equal(cmd.email(), "asido4@gmail.com");
      assert.sameMembers(cmd.notes(), ["1 ", "2 ", "3 ", "4 ", "5 ", "6 ", "7 ", "8 ", "9 1", "10 "]);
      assert.sameDeepMembers(cmd.ratingStats(), [
        {
          name: "Bul",
          current: 1024,
          need: 8,
          wins: 0,
          losses: 11,
          draws: 0,
          bestScore: null
        },
        {
          name: "Bli",
          current: 623,
          need: 2,
          wins: 3,
          losses: 44,
          draws: 0,
          bestScore: {
            score: 700,
            timestamp: 1396411200000
          }
        },
        {
          name: "Sta",
          current: 1009,
          need: 6,
          wins: 0,
          losses: 1,
          draws: 0,
          bestScore: null
        },
        {
          name: "5-m",
          current: 1262,
          need: 8,
          wins: 0,
          losses: 2,
          draws: 0,
          bestScore: null
        },
        {
          name: "1-m",
          current: 445,
          need: 8,
          wins: 0,
          losses: 23,
          draws: 0,
          bestScore: {
            score: 451,
            timestamp: 1382500800000
          }
        },
        {
          name: "15-",
          current: 1181,
          need: 4,
          wins: 0,
          losses: 1,
          draws: 0,
          bestScore: null
        },
        {
          name: "Cor",
          current: 1691,
          need: 0,
          wins: 1,
          losses: 0,
          draws: 0,
          bestScore: null
        },
        {
          name: "3-m",
          current: 663,
          need: 8,
          wins: 0,
          losses: 4,
          draws: 0,
          bestScore: null
        },
        {
          name: "Che",
          current: 821,
          need: 8,
          wins: 0,
          losses: 1,
          draws: 0,
          bestScore: null
        }
      ]);
    });

    it("unexisting player", () => {
      ///"nodechessclient" does not match any player's name exactly.
      const cmd = new YFinger(testMeta, `"ashkdfngqw43" does not match any player's name exactly.`, null);
      assert.isTrue(cmd.notFound());
      assert.isNull(cmd.name());
      assert.isNull(cmd.onFor());
      assert.isNull(cmd.idleFor());
      assert.isNull(cmd.glicko());
      assert.isNull(cmd.totalOnline());
      assert.isNull(cmd.onlinePercentageSinceRegistration());
      assert.isNull(cmd.isExempt());
      assert.isNull(cmd.email());
      assert.sameMembers(cmd.notes(), []);
      assert.sameMembers(cmd.ratingStats(), []);
    });
  });

  describe("Command factory can create", () => {
    it("S_UNKNOWN", () => {
      const cmd = createCommand(new Meta(CN.S_UNKNOWN, "test"), "");
      assert.instanceOf(cmd, Command);
    });

    it("DATE", () => {
      const cmd = createCommand(new Meta(CN.DATE, "test"), "");
      assert.instanceOf(cmd, Date);
    });

    it("FINGER", () => {
      const cmd = createCommand(new Meta(CN.FINGER, "test"), "");
      assert.instanceOf(cmd, Finger);
    });

    it("LIST", () => {
      const cmd = createCommand(new Meta(CN.LIST, "test"), "");
      assert.instanceOf(cmd, List);
    });

    it("MINUS", () => {
      const cmd = createCommand(new Meta(CN.MINUS, "test"), "");
      assert.instanceOf(cmd, Minus);
    });

    it("OBSERVE", () => {
      const cmd = createCommand(new Meta(CN.OBSERVE, "test"), "");
      assert.instanceOf(cmd, Observe);
    });

    it("PGN", () => {
      const cmd = createCommand(new Meta(CN.PGN, "test"), "");
      assert.instanceOf(cmd, Pgn);
    });

    it("PLUS", () => {
      const cmd = createCommand(new Meta(CN.PLUS, "test"), "");
      assert.instanceOf(cmd, Plus);
    });

    it("S_ILLEGAL_MOVE", () => {
      const cmd = createCommand(new Meta(CN.S_ILLEGAL_MOVE, "test"), "");
      assert.instanceOf(cmd, IllegalMove);
    });

    it("VARS", () => {
      const cmd = createCommand(new Meta(CN.VARS, "test"), "");
      assert.instanceOf(cmd, Vars);
    });

    it("YFINGER", () => {
      const cmd = createCommand(new Meta(CN.YFINGER, "test"), "");
      assert.instanceOf(cmd, YFinger);
    });
  });
});
