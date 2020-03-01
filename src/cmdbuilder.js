const { Color } = require("./protocol");

const QSuggestPriority = Object.freeze({
  LOW: 0,
  HIGH: 5
});
const qsuggestPriorityValues = Object.values(QSuggestPriority);

class CommandBuilder {
  constructor() {
    this.buffer = [];
  }

  abort(username = null) {
    if (username && typeof username !== "string") throw new Error("username");

    this.buffer.push("abort" + (username ? " " + username : ""));
    return this;
  }

  accept(username) {
    if (username && typeof username !== "string") throw new Error("username");

    this.buffer.push("accept " + username);
    return this;
  }

  adjourn() {
    this.buffer.push("adjourn");
    return this;
  }

  admin(password) {
    if (typeof password !== "string" || !password) throw new Error("password");

    this.buffer.push("admin " + password);
    return this;
  }

  clearMessages(filter) {
    if (typeof filter !== "string" || !filter) throw new Error("filter");

    this.buffer.push("clearmessages " + filter);
    return this;
  }

  date() {
    this.buffer.push("date");
    return this;
  }

  decline(username) {
    if (username && typeof username !== "string") throw new Error("username");

    this.buffer.push("decline " + username);
    return this;
  }

  draw() {
    this.buffer.push("draw");
    return this;
  }

  drawGame(gameId) {
    if (typeof gameId !== "string" || !gameId) throw new Error("gameId");

    this.buffer.push("draw #" + gameId);
    return this;
  }

  drawOpponent(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("draw " + username);
    return this;
  }

  examine(gameId) {
    if (typeof gameId !== "string" || !gameId) throw new Error("gameId");

    this.buffer.push("examine " + gameId);
    return this;
  }

  finger(handle = null) {
    if (handle && typeof handle !== "string") throw new Error("handle");

    this.buffer.push("finger" + (handle ? " " + handle : ""));
    return this;
  }

  follow(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("follow " + username);
    return this;
  }

  getpx(username, token = "token") {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push(`getpx ${username} ${token}`);
    return this;
  }

  history(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("history " + username);
    return this;
  }

  kibitzTo(gameNumber, message) {
    if (typeof gameNumber !== "number") throw new Error("gameNumber");
    if (typeof message !== "string" || !message) throw new Error("message");

    this.buffer.push(`kibitzto ${gameNumber} ${message}`);
    return this;
  }

  lastTells(roomNumber) {
    if (typeof roomNumber !== "number") throw new Error("roomNumber");

    this.buffer.push("lasttells " + roomNumber);
    return this;
  }

  libAppend(gameId) {
    if (typeof gameId !== "string" || !gameId) throw new Error("gameId");

    this.buffer.push("libappend #" + gameId);
    return this;
  }

  libDelete(gameId) {
    if (typeof gameId !== "string" || !gameId) throw new Error("gameId");

    this.buffer.push("libdelete #" + gameId);
    return this;
  }

  libList(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("liblist " + username);
    return this;
  }

  list(collection) {
    if (typeof collection !== "string" || !collection) throw new Error("collection");

    this.buffer.push("=" + collection);
    return this;
  }

  loadFen(fen) {
    if (typeof fen !== "string" || !fen) throw new Error("fen");

    this.buffer.push(`loadfen ` + fen);
    return this;
  }

  logPgn(gameId) {
    if (typeof gameId !== "string" || !gameId) throw new Error("gameId");

    this.buffer.push("logpgn #" + gameId);
    return this;
  }

  match(username = null, time = null, increment = null, rated = null, wild = null, color = null) {
    if (username !== null && typeof username !== "string") throw new Error("username");
    if (time !== null && typeof time !== "number") throw new Error("time");
    if (increment !== null && typeof increment !== "number") throw new Error("increment");
    if (rated !== null && typeof rated !== "boolean") throw new Error("rated");
    if (wild !== null && typeof wild !== "number") throw new Error("wild");
    if (color !== null && typeof color !== "string") throw new Error("color");

    const arg0 = username === null ? "" : " " + username;
    const arg1 = time === null ? "" : " " + time;
    const arg2 = increment === null ? "" : " " + increment;
    const arg3 = rated === null ? "" : rated ? " r" : " u";
    const arg4 = wild === null ? "" : " w" + wild;
    const arg5 = color === null ? "" : " " + color;
    const cmd = `match${arg0}${arg1}${arg2}${arg3}${arg4}${arg5}`;
    this.buffer.push(cmd);

    return this;
  }

  messages(username = null, message = null) {
    if (message && !username) throw new Error("message is given, while username is not");

    let cmd = "messages";
    if (username) {
      cmd += " " + username;
    }
    if (message) {
      cmd += " " + message;
    }
    this.buffer.push(cmd);

    return this;
  }

  minus(collection, value) {
    if (typeof collection !== "string" || !collection) throw new Error("collection");
    if (typeof value !== "string" && typeof value !== "number") throw new Error("value");

    this.buffer.push(`-${collection} ${value}`);
    return this;
  }

  observe(usernameOrGameNumber) {
    if (typeof usernameOrGameNumber !== "string" && typeof usernameOrGameNumber !== "number") throw new Error("usernameOrGameNumber");

    this.buffer.push("observe " + usernameOrGameNumber);
    return this;
  }

  observeRandom() {
    return this.observe("*");
  }

  pgn(gameNumber = null) {
    if (gameNumber && typeof gameNumber !== "number") throw new Error("gameNumber");

    this.buffer.push(`pgn` + (gameNumber ? " " + gameNumber : ""));
    return this;
  }

  plus(collection, value) {
    if (typeof collection !== "string" || !collection) throw new Error("collection");
    if (typeof value !== "string" && typeof value !== "number") throw new Error("value");

    this.buffer.push(`+${collection} ${value}`);
    return this;
  }

  pstat(username1, username2 = null) {
    if (typeof username1 !== "string" || !username1) throw new Error("username1");
    if (username2 && typeof username2 !== "string") throw new Error("username2");

    this.buffer.push(`pstat ${username1}` + (username2 ? " " + username2 : ""));
    return this;
  }

  qmatch(playerName, opponentName) {
    if (typeof playerName !== "string" || !playerName) throw new Error("playerName");
    if (typeof opponentName !== "string" || !opponentName) throw new Error("opponentName");

    this.buffer.push(`qmatch ${playerName} ${opponentName}`);
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

  qsuggest(id, priority, playerName, opponentName, subject, text) {
    if (typeof id !== "string" || !id) throw new Error("id");
    if (typeof priority !== "number" || qsuggestPriorityValues.indexOf(priority) === -1) throw new Error("priority");
    if (typeof playerName !== "string" || !playerName) throw new Error("playerName");
    if (typeof opponentName !== "string" || !opponentName) throw new Error("opponentName");
    if (typeof subject !== "string" || !subject) throw new Error("subject");
    if (typeof text !== "string" || !text) throw new Error("text");

    this.buffer.push(`qsuggest ${priority} ${playerName} match ${opponentName}#${text}#${subject} ${id}`);
    return this;
  }

  resign(username = null) {
    if (username && typeof username !== "string") throw new Error("username");

    this.buffer.push("resign" + (username ? " " + username : ""));
    return this;
  }

  result(result) {
    if (typeof result !== "string" || !result) throw new Error("result");

    this.buffer.push("result " + result);
    return this;
  }

  say(message) {
    if (typeof message !== "string" || !message) throw new Error("message");

    this.buffer.push("say " + message);
    return this;
  }

  seek(time, increment, rated, minRating, maxRating, wild = null, color = null) {
    if (typeof time !== "number") throw new Error("time");
    if (typeof increment !== "number") throw new Error("increment");
    if (typeof rated !== "boolean") throw new Error("rated");
    if (typeof minRating !== "number") throw new Error("minRating");
    if (typeof maxRating !== "number") throw new Error("maxRating");

    const arg0 = time;
    const arg1 = increment;
    const arg2 = rated ? "r" : "u";
    const arg3 = wild ? " w" + wild : "";
    const arg4 = color ? " " + color : "";
    const arg5 = minRating;
    const arg6 = maxRating;
    const cmd = `seek ${arg0} ${arg1} ${arg2}${arg3}${arg4} ${arg5}-${arg6}`;
    this.buffer.push(cmd);

    return this;
  }

  sendMove(longAlgebraicNotation) {
    if (typeof longAlgebraicNotation !== "string" || !longAlgebraicNotation) throw new Error("longAlgebraicNotation");

    this.buffer.push(longAlgebraicNotation);
    return this;
  }

  set(variable, value) {
    if (typeof variable !== "string" || !variable) throw new Error("variable");

    this.buffer.push(`set ${variable} ${value}`);
    return this;
  }

  set2(dg, enable) {
    if (typeof dg !== "number") throw new Error("dg");
    if (typeof enable !== "boolean") throw new Error("enable");

    this.buffer.push(`set-2 ${dg} ${enable ? "1" : "0"}`);
    return this;
  }

  setClock(color, clock, quiet = false) {
    if (typeof color !== "string" || !color) throw new Error("color");
    if (typeof clock !== "number") throw new Error("clock");

    const arg0 = color == Color.WHITE ? "white" : "black";
    const arg1 = quiet ? "quietly" : "";
    const hour = (clock / 60 / 60 / 1000) | 0;
    const min = (clock / 60 / 1000 - hour * 60) | 0;
    const sec = (clock / 1000 - hour * 60 * 60 - min * 60) | 0;
    const cmd = `set${arg0}clock${arg1} ${hour}:${min}:${sec}`;
    this.buffer.push(cmd);

    return this;
  }

  setBlackName(name) {
    if (typeof name !== "string" || !name) throw new Error("name");

    this.buffer.push("setblackname " + name);
    return this;
  }

  setWhiteName(name) {
    if (typeof name !== "string" || !name) throw new Error("name");

    this.buffer.push("setwhitename " + name);
    return this;
  }

  setTimeControl(initial, increment, blackInitial = null, blackIncrement = null) {
    if (typeof initial !== "number") throw new Error("initial");
    if (typeof increment !== "number") throw new Error("increment");
    if (blackInitial && blackIncrement) {
      if (typeof blackInitial !== "number") throw new Error("blackInitial");
      if (typeof blackIncrement !== "number") throw new Error("blackIncrement");
    }

    let cmd = `settimecontrol ${initial} ${increment}`;
    if (blackInitial && blackIncrement) {
      cmd += ` ${blackInitial} ${blackIncrement}`;
    }
    this.buffer.push(cmd);

    return this;
  }

  startSimul() {
    this.buffer.push("startsimul");
    return this;
  }

  simulize() {
    this.buffer.push("simulize");
    return this;
  }

  stored(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("stored " + username);
    return this;
  }

  tag(name, value) {
    if (typeof name !== "string" || !name) throw new Error("name");
    if (typeof value !== "string" || !value) throw new Error("value");

    this.buffer.push(`tag ${name} ${value}`);
    return this;
  }

  takeback(count) {
    if (typeof count !== "number") throw new Error("count");

    this.buffer.push("takeback " + count);
    return this;
  }

  tell(usernameOrChannel, message) {
    if (typeof usernameOrChannel !== "string" && typeof usernameOrChannel !== "number") throw new Error("usernameOrChannel");
    if (typeof message !== "string" || !message) throw new Error("message");

    this.buffer.push(`tell ${usernameOrChannel} ${message}`);
    return this;
  }

  unexamine() {
    this.buffer.push("unexamine");
    return this;
  }

  unfollow() {
    this.buffer.push("unfollow");
    return this;
  }

  unobserve(username) {
    if (typeof username !== "string" || !username) throw new Error("username");

    this.buffer.push("unobserve " + username);
    return this;
  }

  unseek(index = null) {
    this.buffer.push("unseek" + (index === null ? "" : " " + index));
    return this;
  }

  vars(player) {
    if (player && typeof player !== "string") throw new Error("player");

    this.buffer.push("vars" + (player ? " " + player : ""));
    return this;
  }

  whisperTo(gameNumber, message) {
    if (typeof gameNumber !== "number") throw new Error("gameNumber");
    if (typeof message !== "string" || !message) throw new Error("message");

    this.buffer.push(`whisperto ${gameNumber} ${message}`);
    return this;
  }

  who() {
    // TODO: Has many args.
    this.buffer.push("who");
    return this;
  }

  yfinger(handle = null) {
    if (handle && typeof handle !== "string") throw new Error("handle");

    this.buffer.push("yfinger" + (handle ? " " + handle : ""));
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

module.exports = {
  CommandBuilder,
  QSuggestPriority
};
