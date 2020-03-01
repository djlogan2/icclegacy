const { describe, it } = require("mocha");
const { assert } = require("chai");
const { CommandBuilder } = require("./cmdbuilder");
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

  it("admin", () => {
    const cmd = new CommandBuilder().admin("p@s5w0rd").toString();
    assert.equal(cmd, "admin p@s5w0rd");
  });

  it("date", () => {
    const cmd = new CommandBuilder().date().toString();
    assert.equal(cmd, "date");
  });

  it("qsetClear", () => {
    const cmd = new CommandBuilder().qsetClear("player-name").toString();
    assert.equal(cmd, "qset player-name tourney 0");
  });

  it("qsetSetup", () => {
    const cmd = new CommandBuilder().qsetSetup("player-name", "tourney-name", "opponent-name", 1, 2, 3, 4, true, Wild.ATOMIC, Color.WHITE, 42).toString();
    assert.equal(cmd, "qset player-name tourney tourney-name * opponent-name 1 2 3 4 r 27 w 42");
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
});
