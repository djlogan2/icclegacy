const { describe, it } = require("mocha");
const { assert } = require("chai");
const { CommandBuilder, QSuggestPriority } = require("./cmdbuilder");
const { DG, Color, Wild } = require("./protocol");

describe("CommandBuilder", () => {
  describe("toString", () => {
    it("returns empty command when nothing buffered", () => {
      assert.equal(new CommandBuilder().toString(), "");
    });

    it("returns single command when one is buffered", () => {
      const cmd = new CommandBuilder().set2(DG.UNUSED_54, true).toString();
      assert.equal(cmd, "set-2 54 1");
    });

    it("returns multi command when multiple commands buffered", () => {
      const cmd = new CommandBuilder()
        .set2(DG.UNUSED_54, true)
        .set2(DG.UNUSED_58, false)
        .toString()
        .toString();
      assert.equal(cmd, "multi set-2 54 1; set-2 58 0");
    });
  });

  describe("abort", () => {
    it("with arg", () => {
      const cmd = new CommandBuilder().abort("some-user").toString();
      assert.equal(cmd, "abort some-user");
    });

    it("without arg", () => {
      const cmd = new CommandBuilder().abort().toString();
      assert.equal(cmd, "abort");
    });
  });

  it("accept", () => {
    const cmd = new CommandBuilder().accept("some-user").toString();
    assert.equal(cmd, "accept some-user");
  });

  it("adjourn", () => {
    const cmd = new CommandBuilder().adjourn().toString();
    assert.equal(cmd, "adjourn");
  });

  it("admin", () => {
    const cmd = new CommandBuilder().admin("p@s5w0rd").toString();
    assert.equal(cmd, "admin p@s5w0rd");
  });

  it("clearMessages", () => {
    const cmd = new CommandBuilder().clearMessages("some-filter").toString();
    assert.equal(cmd, "clearmessages some-filter");
  });

  it("date", () => {
    const cmd = new CommandBuilder().date().toString();
    assert.equal(cmd, "date");
  });

  it("decline", () => {
    const cmd = new CommandBuilder().decline("some-user").toString();
    assert.equal(cmd, "decline some-user");
  });

  it("draw", () => {
    const cmd = new CommandBuilder().draw().toString();
    assert.equal(cmd, "draw");
  });

  it("drawGame", () => {
    const cmd = new CommandBuilder().drawGame("42").toString();
    assert.equal(cmd, "draw #42");
  });

  it("drawOpponent", () => {
    const cmd = new CommandBuilder().drawOpponent("some-user").toString();
    assert.equal(cmd, "draw some-user");
  });

  it("examine", () => {
    const cmd = new CommandBuilder().examine("42").toString();
    assert.equal(cmd, "examine 42");
  });

  describe("finger", () => {
    it("with arg", () => {
      const cmd = new CommandBuilder().finger("some-user").toString();
      assert.equal(cmd, "finger some-user");
    });

    it("without arg", () => {
      const cmd = new CommandBuilder().finger().toString();
      assert.equal(cmd, "finger");
    });
  });

  it("follow", () => {
    const cmd = new CommandBuilder().follow("some-user").toString();
    assert.equal(cmd, "follow some-user");
  });

  describe("getpx", () => {
    it("with token", () => {
      const cmd = new CommandBuilder().getpx("some-user", "some-token").toString();
      assert.equal(cmd, "getpx some-user some-token");
    });

    it("without token", () => {
      const cmd = new CommandBuilder().getpx("some-user").toString();
      assert.equal(cmd, "getpx some-user token");
    });
  });

  it("history", () => {
    const cmd = new CommandBuilder().history("some-user").toString();
    assert.equal(cmd, "history some-user");
  });

  it("kibitzTo", () => {
    const cmd = new CommandBuilder().kibitzTo(42, "some-message").toString();
    assert.equal(cmd, "kibitzto 42 some-message");
  });

  it("lastTells", () => {
    const cmd = new CommandBuilder().lastTells(42).toString();
    assert.equal(cmd, "lasttells 42");
  });

  it("libAppend", () => {
    const cmd = new CommandBuilder().libAppend("42").toString();
    assert.equal(cmd, "libappend #42");
  });

  it("libDelete", () => {
    const cmd = new CommandBuilder().libDelete("42").toString();
    assert.equal(cmd, "libdelete #42");
  });

  it("libList", () => {
    const cmd = new CommandBuilder().libList("some-user").toString();
    assert.equal(cmd, "liblist some-user");
  });

  it("list", () => {
    const cmd = new CommandBuilder().list("channels").toString();
    assert.equal(cmd, "=channels");
  });

  it("loadfen", () => {
    const cmd = new CommandBuilder().loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").toString();
    assert.equal(cmd, "loadfen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  });

  it("logpgn", () => {
    const cmd = new CommandBuilder().logPgn("42").toString();
    assert.equal(cmd, "logpgn #42");
  });

  describe("match", () => {
    it("without args", () => {
      const cmd = new CommandBuilder().match().toString();
      assert.equal(cmd, "match");
    });

    it("with username", () => {
      const cmd = new CommandBuilder().match("some-user").toString();
      assert.equal(cmd, "match some-user");
    });

    it("with all args", () => {
      const cmd = new CommandBuilder().match("some-user", 1, 2, true, Wild.ATOMIC, Color.BLACK).toString();
      assert.equal(cmd, "match some-user 1 2 r w27 b");
    });
  });

  describe("messages", () => {
    it("with args", () => {
      const cmd = new CommandBuilder().messages("some-user", "some-message").toString();
      assert.equal(cmd, "messages some-user some-message");
    });

    it("without args", () => {
      const cmd = new CommandBuilder().messages().toString();
      assert.equal(cmd, "messages");
    });
  });

  it("minus", () => {
    const cmd = new CommandBuilder().minus("channels", 42).toString();
    assert.equal(cmd, "-channels 42");
  });

  it("observe", () => {
    const cmd = new CommandBuilder().observe(42).toString();
    assert.equal(cmd, "observe 42");
  });

  it("observeRandom", () => {
    const cmd = new CommandBuilder().observeRandom().toString();
    assert.equal(cmd, "observe *");
  });

  describe("pgn", () => {
    it("with game number", () => {
      const cmd = new CommandBuilder().pgn(42).toString();
      assert.equal(cmd, "pgn 42");
    });

    it("without game number", () => {
      const cmd = new CommandBuilder().pgn().toString();
      assert.equal(cmd, "pgn");
    });
  });

  it("plus", () => {
    const cmd = new CommandBuilder().plus("channels", 42).toString();
    assert.equal(cmd, "+channels 42");
  });

  describe("pstat", () => {
    it("1 user", () => {
      const cmd = new CommandBuilder().pstat("user-1").toString();
      assert.equal(cmd, "pstat user-1");
    });

    it("2 users", () => {
      const cmd = new CommandBuilder().pstat("user-1", "user-2").toString();
      assert.equal(cmd, "pstat user-1 user-2");
    });
  });

  it("qmatch", () => {
    const cmd = new CommandBuilder().qmatch("user-0", "user-1").toString();
    assert.equal(cmd, "qmatch user-0 user-1");
  });

  it("qsetClear", () => {
    const cmd = new CommandBuilder().qsetClear("player-name").toString();
    assert.equal(cmd, "qset player-name tourney 0");
  });

  it("qsetSetup", () => {
    const cmd = new CommandBuilder().qsetSetup("player-name", "tourney-name", "opponent-name", 1, 2, 3, 4, true, Wild.ATOMIC, Color.WHITE, 42).toString();
    assert.equal(cmd, "qset player-name tourney tourney-name * opponent-name 1 2 3 4 r 27 w 42");
  });

  it("qsuggest", () => {
    const cmd = new CommandBuilder().qsuggest("some-id", QSuggestPriority.HIGH, "user-0", "user-1", "some-subject", "some-text").toString();
    assert.equal(cmd, "qsuggest 5 user-0 match user-1#some-text#some-subject some-id");
  });

  describe("resign", () => {
    it("with arg", () => {
      const cmd = new CommandBuilder().resign("some-user").toString();
      assert.equal(cmd, "resign some-user");
    });

    it("without arg", () => {
      const cmd = new CommandBuilder().resign().toString();
      assert.equal(cmd, "resign");
    });
  });

  it("result", () => {
    const cmd = new CommandBuilder().result("some-result").toString();
    assert.equal(cmd, "result some-result");
  });

  it("say", () => {
    const cmd = new CommandBuilder().say("some-message").toString();
    assert.equal(cmd, "say some-message");
  });

  it("seek", () => {
    const cmd = new CommandBuilder().seek(1, 2, true, 1000, 2000, Wild.ATOMIC, Color.WHITE).toString();
    assert.equal(cmd, "seek 1 2 r w27 w 1000-2000");
  });

  it("sendMove", () => {
    const cmd = new CommandBuilder().sendMove("a2a4").toString();
    assert.equal(cmd, "a2a4");
  });

  it("set", () => {
    const cmd = new CommandBuilder().set("some-var", 42).toString();
    assert.equal(cmd, "set some-var 42");
  });

  describe("set2", () => {
    it("enable command", () => {
      const cmd = new CommandBuilder().set2(DG.UNUSED_54, true).toString();
      assert.equal(cmd, "set-2 54 1");
    });

    it("disable command", () => {
      const cmd = new CommandBuilder().set2(DG.UNUSED_54, false).toString();
      assert.equal(cmd, "set-2 54 0");
    });
  });

  describe("setClock", () => {
    it("quiet", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 0, true).toString();
      assert.equal(cmd, "setwhiteclockquietly 0:0:0");
    });

    it("not quiet", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 0).toString();
      assert.equal(cmd, "setwhiteclock 0:0:0");
    });

    it("some ms", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 200).toString();
      assert.equal(cmd, "setwhiteclock 0:0:0");
    });

    it("some seconds", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 2500).toString();
      assert.equal(cmd, "setwhiteclock 0:0:2");
    });

    it("some minutes", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 182500).toString();
      assert.equal(cmd, "setwhiteclock 0:3:2");
    });

    it("some hours", () => {
      const cmd = new CommandBuilder().setClock(Color.WHITE, 18182500).toString();
      assert.equal(cmd, "setwhiteclock 5:3:2");
    });
  });

  it("setBlackName", () => {
    const cmd = new CommandBuilder().setBlackName("some-user").toString();
    assert.equal(cmd, "setblackname some-user");
  });

  it("setWhiteName", () => {
    const cmd = new CommandBuilder().setWhiteName("some-user").toString();
    assert.equal(cmd, "setwhitename some-user");
  });

  describe("setTimeControl", () => {
    it("for one side", () => {
      const cmd = new CommandBuilder().setTimeControl(1, 2).toString();
      assert.equal(cmd, "settimecontrol 1 2");
    });

    it("for both sides", () => {
      const cmd = new CommandBuilder().setTimeControl(1, 2, 3, 4).toString();
      assert.equal(cmd, "settimecontrol 1 2 3 4");
    });
  });

  it("startSimul", () => {
    const cmd = new CommandBuilder().startSimul().toString();
    assert.equal(cmd, "startsimul");
  });

  it("simulize", () => {
    const cmd = new CommandBuilder().simulize().toString();
    assert.equal(cmd, "simulize");
  });

  it("stored", () => {
    const cmd = new CommandBuilder().stored("some-user").toString();
    assert.equal(cmd, "stored some-user");
  });

  it("tag", () => {
    const cmd = new CommandBuilder().tag("some-tag", "some-val").toString();
    assert.equal(cmd, "tag some-tag some-val");
  });

  it("takeback", () => {
    const cmd = new CommandBuilder().takeback(2).toString();
    assert.equal(cmd, "takeback 2");
  });

  describe("tell", () => {
    it("channel", () => {
      const cmd = new CommandBuilder().tell(42, "some-message").toString();
      assert.equal(cmd, "tell 42 some-message");
    });

    it("user", () => {
      const cmd = new CommandBuilder().tell("some-user", "some-message").toString();
      assert.equal(cmd, "tell some-user some-message");
    });
  });

  it("unexamine", () => {
    const cmd = new CommandBuilder().unexamine().toString();
    assert.equal(cmd, "unexamine");
  });

  it("unfollow", () => {
    const cmd = new CommandBuilder().unfollow().toString();
    assert.equal(cmd, "unfollow");
  });

  it("unobserve", () => {
    const cmd = new CommandBuilder().unobserve("some-user").toString();
    assert.equal(cmd, "unobserve some-user");
  });

  describe("unseek", () => {
    it("without arg", () => {
      const cmd = new CommandBuilder().unseek().toString();
      assert.equal(cmd, "unseek");
    });

    it("with arg", () => {
      const cmd = new CommandBuilder().unseek(42).toString();
      assert.equal(cmd, "unseek 42");
    });
  });

  describe("vars", () => {
    it("without player", () => {
      const cmd = new CommandBuilder().vars().toString();
      assert.equal(cmd, "vars");
    });

    it("with player", () => {
      const cmd = new CommandBuilder().vars("test-user").toString();
      assert.equal(cmd, "vars test-user");
    });
  });

  it("whisperTo", () => {
    const cmd = new CommandBuilder().whisperTo(42, "some-message").toString();
    assert.equal(cmd, "whisperto 42 some-message");
  });

  it("who", () => {
    const cmd = new CommandBuilder().who().toString();
    assert.equal(cmd, "who");
  });

  describe("yfinger", () => {
    it("with arg", () => {
      const cmd = new CommandBuilder().yfinger("some-user").toString();
      assert.equal(cmd, "yfinger some-user");
    });

    it("without arg", () => {
      const cmd = new CommandBuilder().yfinger().toString();
      assert.equal(cmd, "yfinger");
    });
  });
});
