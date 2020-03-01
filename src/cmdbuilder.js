class CommandBuilder {
  constructor() {
    this.buffer = [];
  }

  admin(password) {
    if (typeof password !== "string" || !password) throw new Error("password");

    this.buffer.push("admin " + password);
    return this;
  }

  date() {
    this.buffer.push("date");
    return this;
  }

  qsetSetup(playerName, tournamentName, opponentName, playerTime, playerIncrement, opponentTime, opponentIncrement, rated, wild, playerColor, roundNumber) {
    if (typeof playerName !== "string" || !playerName) throw new Error("playerName");
    if (typeof tournamentName !== "string" || !tournamentName) throw new Error("tournamentName");
    if (typeof opponentName !== "string" || !opponentName) throw new Error("opponentName");
    if (typeof playerTime !== "number") throw new Error("playerTime");
    if (typeof playerIncrement !== "number") throw new Error("playerIncrement");
    if (typeof opponentTime !== "number") throw new Error("opponentTime");
    if (typeof opponentIncrement !== "number") throw new Error("opponentIncrement");
    if (typeof rated !== "boolean") throw new Error("rated");
    if (typeof wild !== "number") throw new Error("wild");
    if (typeof playerColor !== "string" || !playerColor) throw new Error("playerColor");
    if (typeof roundNumber !== "number") throw new Error("roundNumber");

    const arg0 = playerName;
    const arg1 = tournamentName.replace(" ", "_");
    const arg2 = opponentName;
    const arg3 = playerTime;
    const arg4 = playerIncrement;
    const arg5 = opponentTime;
    const arg6 = opponentIncrement;
    const arg7 = rated ? "r" : "u";
    const arg8 = wild;
    const arg9 = playerColor;
    const arg10 = roundNumber;
    const cmd = `qset ${arg0} tourney ${arg1} * ${arg2} ${arg3} ${arg4} ${arg5} ${arg6} ${arg7} ${arg8} ${arg9} ${arg10}`;
    this.buffer.push(cmd);

    return this;
  }

  qsetClear(playerName) {
    if (typeof playerName !== "string" || !playerName) throw new Error("playerName");

    this.buffer.push(`qset ${playerName} tourney 0`);
    return this;
  }

  set2(dg, enable) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof enable !== "boolean") throw new Error("enable");

    this.buffer.push(`set-2 ${dg} ${enable ? "1" : "0"}`);
    return this;
  }

  vars(player) {
    if (player && typeof player !== "string") throw new Error("player");

    this.buffer.push("vars" + (player ? " " + player : ""));
    return this;
  }

  toString() {
    if (this.buffer.length === 0) {
      return "";
    }
    if (this.buffer.length === 1) {
      return this.buffer[0];
    }
    return `multi ${this.buffer.filter(s => !/^\s*$/.test(s)).join("; ")}`;
  }
}

module.exports = { CommandBuilder };
