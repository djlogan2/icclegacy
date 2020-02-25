"use strict";

const { DateTime } = require("luxon");
const { CN } = require("./id");
const { Field } = require("./field");
const { SERVER_TIMEZONE, HelpLanguage } = require("./const");

class Meta {
  constructor(id, sender, tag) {
    if (typeof id !== "number") throw new Error("id");
    if (typeof sender !== "string") throw new Error("sender");

    this.id = id;
    this.sender = sender;
    this.tag = tag;
  }
}

const UNKNOWN_META = new Meta(CN.S_UNKNOWN, "*");

class Command {
  constructor(meta, content, datagrams) {
    if (!(meta instanceof Meta)) throw new Error("meta");
    if (typeof content !== "string") throw new Error("content");

    this.meta = meta;
    this.content = content.replace("\r\n", "\n");
    this.datagrams = datagrams;
  }
}

class Date extends Command {}

class IllegalMove extends Command {}

class Finger extends Command {}

class List extends Command {}

class Minus extends Command {
  success() {
    const content = this.content.trimEnd();
    return /^Removed .*\.$/.test(content) || /^Removing ".*" from the list\.$/.test(content);
  }
}

const INVALID_GAME_ID = "-1";

class Observe extends Command {
  get gameId() {
    const match = / (\d+)\./.exec(this.content);
    return match ? match[1] : INVALID_GAME_ID;
  }
}

class Pgn extends Command {}

class Plus extends Command {
  success() {
    const content = this.content.trimEnd();
    return /^.* added\.$/.test(content) || /^You have been added to .*'s simul list\.$/.test(content) || /^added to .* list$/.test(content);
  }
}

class Vars extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
    this.fields = new VarsFields(this.content);
  }

  notFound() {
    return this.content.indexOf("does not match any player's name exactly.") !== -1;
  }

  // It is set to true if the command target is yourself.
  isMyVars() {
    return this.content.startsWith("Here are the values of your variables:");
  }

  // Command target username, which is set when the command targets another player.
  // Returns null if the target is the caller.
  username() {
    const match = /Variable settings of (.*?)(?:\:|\()/.exec(this.content);
    return match ? match[1] : null;
  }

  // When you issue a "match" or "seek" command without parameters, this rated value will be used instead.
  rated() {
    return this.fields.get("rated", "0").asBool();
  }

  // When you issue a "match" or "seek" command without parameters, this wild value will be used instead.
  // Returns enum Wild.
  wild() {
    return this.fields.get("wild", "0").asInt();
  }

  // When you issue a "match" or "seek" command without parameters, this game time value will be used instead.
  time() {
    return this.fields.get("time", "0").asMsFromMinutes();
  }

  // When you issue a "match" or "seek" command without parameters, this time increment value will be used instead.
  increment() {
    return this.fields.get("inc", "0").asMsFromSeconds();
  }

  // Do I want a disconnector to lose the game?
  noEscape() {
    return this.fields.get("noescape", "0").asBool();
  }

  // Do I allow takebacks?  If set to 1, you will not even see requests for takebacks from your opponent.
  noTakeback() {
    return this.fields.get("notakeback", "0").asBool();
  }

  // Default minimum rating you seek when you issue a seeking command.
  minSeek() {
    return this.fields.get("minseek", "0").asInt();
  }

  // Default maximum rating you seek when you issue a seeking command.
  maxSeek() {
    return this.fields.get("maxseek", "9999").asInt();
  }

  // If set the game will not start automatically once opponent is found, but will ask for confirmation instead.
  manualAccept() {
    return this.fields.get("manualaccept", "0").asBool();
  }

  // Am I open to challenges?
  open() {
    return this.fields.get("open", "1").asBool();
  }

  // Am I open to challenges with ratedness different from my own rated variable?
  ropen() {
    return this.fields.get("ropen", "1").asBool();
  }

  // Am I open to challenges with wildness different from my own wild variable?
  wopen() {
    return this.fields.get("wopen", "1").asBool();
  }

  // Am I open to correspondence games?
  ccopen() {
    return this.fields.get("ccopen", "0").asBool();
  }

  // Do I see "seeking" messages?
  // Returns enum SeekVisibility.
  seek() {
    return this.fields.get("seek", "0").asInt();
  }

  // Whether to use your seek filter.
  useFormula() {
    return this.fields.get("useformula", "1").asBool();
  }

  // Controls which seek offers you will see.
  sfilter() {
    return new SeekFilter(this.fields.get("sfilter", "").asString());
  }

  // An extra variable you can use in your formula.
  mood() {
    return this.fields.get("mood", "0").asInt();
  }

  // If set, all challengers must satisfy it.
  formula() {
    return this.fields.get("formula", "").asString();
  }

  // Will I hear shouts?
  shout() {
    return this.fields.get("shout", "0").asBool();
  }

  // Will I hear important shouts?
  sshout() {
    return this.fields.get("sshout", "0").asBool();
  }

  // Will I hear kibitzes and whispers?
  // Returns enum WhisperVisibility.
  kib() {
    return this.fields.get("kib", "1").asInt();
  }

  // Controls chat with anonymous users.  To carry on a conversation with an anonymous user,
  // both parties must have tell set to true.
  tell() {
    return this.fields.get("tell", "0").asBool();
  }

  // Will I be informed when each player enters and leaves the server? (admin only)
  pin() {
    return this.fields.get("pin", "0").asBool();
  }

  // Will I be informed of the start and end of each game? (admin only)
  gin() {
    return this.fields.get("gin", "0").asBool();
  }

  // Determines what you see while in a game.
  // Returns enum GameQuietnessLevel.
  quietplay() {
    return this.fields.get("quietplay", "0").asInt();
  }

  // Controls if you see offensive language or not.
  tol() {
    return this.fields.get("tol", "4").asInt();
  }

  // Your busy level.
  // Returns enum BusyLevel.
  busy() {
    return this.fields.get("busy", "0").asInt();
  }

  // Controls the manner in which the board will be displayed to me.
  style() {
    return this.fields.get("style", "0").asInt();
  }

  // Line breaking and who display assume this screen width.
  width() {
    return this.fields.get("width", "0").asInt();
  }

  // If set, lines of text will wrap on your screen.
  wrap() {
    return this.fields.get("wrap", "0").asBool();
  }

  // Number of lines in your screen used by a simple pager.
  height() {
    return this.fields.get("height", "0").asInt();
  }

  // If set it will suppress the ICC prompt "aics%".
  prompt() {
    return this.fields.get("prompt", "1").asBool();
  }

  // Highlights various things, such as the names of players talking to you, etc.  Works on VT100 and xterms.
  highlight() {
    return this.fields.get("highlight", "0").asInt();
  }

  // Highlights various things, such as the names of players talking to you, etc.  Works on VT100 and xterms.
  // Returns enum BellRule.
  bell() {
    return this.fields.get("bell", "0").asInt();
  }

  // Use the old-fashioned challenge indicator, for obsolete computers.
  oldmatch() {
    return this.fields.get("oldmatch", "0").asBool();
  }

  // Should I automatically enter examine mode upon the end of my game?
  examine() {
    return this.fields.get("examine", "1").asBool();
  }

  // Controls automatic unobserve behavior.
  // Returns enum AutoUnobserve.
  unobserve() {
    return this.fields.get("unobserve", "0").asInt();
  }

  // If set the server checks how much time you and your opponent have left. If one player has run out, that player
  // forfeits on time (even if it is you!). If both players have run out, the game is drawn.
  autoflag() {
    return this.fields.get("autoflag", "1").asBool();
  }

  // Default parameters used for "who" command, when no parameters are given.
  who() {
    return this.fields.get("who", "0").asString();
  }

  // Default parameters used for "players" command, when no parameters are given.
  players() {
    return this.fields.get("players", "0").asString();
  }

  // Help language.
  // Returns enum HelpLanguage.
  lang() {
    const val = this.fields.get("lang", "").asString();
    return val !== "" ? val : HelpLanguage.ENGLISH;
  }

  // If set, you see ICC help files in your web browser.
  webhelp() {
    return this.fields.get("webhelp", "1").asBool();
  }

  // Returns enum AllowKibitzWhilePlaying.
  allowkib() {
    return this.fields.get("allowkib", "2").asInt();
  }

  // If set, a pstat command is automatically issued when you start a game to display
  // your record against the opponent.
  pstat() {
    return this.fields.get("pstat", "0").asBool();
  }

  // If set, your ICC messages will be emailed to you automatically!
  messmail() {
    return this.fields.get("messmail", "0").asBool();
  }

  // Will my games automatically be mailed to me upon completion?
  automail() {
    return this.fields.get("automail", "0").asBool();
  }

  // Default parameters used for "players" command, when no parameters are given.
  // Returns enum GameMailFormat.
  mailformat() {
    return this.fields.get("mailformat", "2").asInt();
  }

  // Whether your email address will be shown when people finger you, and your email will be shown
  // when your messages are mailed to another ICC member, so they can reply by email.
  addresspublic() {
    return this.fields.get("addresspublic", "0").asBool();
  }

  // If set, your real name that you gave when you registered will be shown when someone fingers you.
  namepublic() {
    return this.fields.get("namepublic", "0").asBool();
  }

  // Whether you want automatically get ICC news items emailed to you.
  subscribe() {
    return this.fields.get("subscribe", "1").asBool();
  }

  // A set of channels the player is in.
  channels() {
    const channels = [];
    const ids = this.fields
      .get("channels", "")
      .asString()
      .trim();
    if (ids.length) {
      for (let id of ids.split(" ")) {
        channels.push(new Field(id).asInt());
      }
    }
    return channels;
  }

  // Says what interface you are using.
  interface() {
    return this.fields.get("interface", "").asString();
  }
}

class SeekFilter {
  constructor(sfilter) {
    if (typeof sfilter !== "string") throw new Error("sfilter");

    this.rated = true;
    this.unrated = true;
    this.computer = true;
    this.bullet = true;
    this.blitz = true;
    this.standard = true;
    this.wild = true;
    this.ratingRange = false;
    this.seekerRange = false;

    let negate = false;

    for (let i = 0; i < sfilter.length; i++) {
      const symbol = sfilter[i];

      switch (symbol) {
        case "-": {
          negate = true;
          break;
        }
        case "r": {
          if (negate) {
            this.rated = false;
          } else {
            this.unrated = false;
          }
          break;
        }
        case "c": {
          if (negate) {
            this.computer = false;
          }
          break;
        }
        case "b": {
          if (negate) {
            this.blitz = false;
          } else {
            this.bullet = false;
            this.standard = false;
          }
          break;
        }
        case "s": {
          if (negate) {
            this.standard = false;
          } else {
            this.blitz = false;
            this.bullet = false;
          }
          break;
        }
        case "B": {
          if (negate) {
            this.bullet = false;
          } else {
            this.blitz = false;
            this.standard = false;
          }
          break;
        }
        case "w": {
          if (negate) {
            this.wild = false;
          }
          break;
        }
        case "m": {
          this.ratingRange = true;
          break;
        }
        case "n": {
          this.seekerRange = true;
          break;
        }
      }

      if (symbol !== "-") {
        negate = false;
      }
    }
  }
}

class VarsFields {
  constructor(content) {
    if (typeof content !== "string") throw new Error("content");

    this.content = content;
    this.parsedObj = null;
  }

  get(name, defaultVal) {
    if (typeof name !== "string") throw new Error("name");
    if (typeof defaultVal !== "string") throw new Error("defaultVal");

    if (!this.parsedObj) {
      this.parsedObj = parseVars(this.content);
    }

    const val = this.parsedObj[name];
    return val ? val : new Field(defaultVal);
  }
}

function parseVars(content) {
  if (typeof content !== "string") throw new Error("content");

  // This funky replace because, values, which don't fit on the same
  // line are broken to a new line prefixed with a backslash.
  content = content.replace("\n\\  ", "");

  let fields = {};
  let lineNum = 0;
  for (let line of content.split("\n")) {
    lineNum++;
    if (lineNum <= 2) {
      // Skip the first 2 lines, which don't contain fields.
      continue;
    }

    line = line.trim();

    // Channels field spans an entire line - start with it.
    const match = /Channels?: ((\d+\s?)*)/.exec(line);
    if (match) {
      fields["channels"] = new Field(match[1]);
      continue;
    }

    while (line.length) {
      const equalIdx = line.indexOf("=");
      const name = line.substr(0, equalIdx);

      line = line.substr(equalIdx + 1);

      let valueStartIdx, valueEndIdx;
      if (line.length === 0 || line[0] === " ") {
        valueStartIdx = 0;
        valueEndIdx = 0;
      } else if (line[0] === `"`) {
        valueStartIdx = 1;
        valueEndIdx = line.indexOf(`"`, 1);
      } else {
        valueStartIdx = 0;
        valueEndIdx = line.indexOf(" ");
        if (valueEndIdx === -1) {
          // Reached the end of line.
          valueEndIdx = line.length;
        }
      }

      const value = line.substr(valueStartIdx, valueEndIdx - valueStartIdx);
      fields[name] = new Field(value);

      if (line.length) {
        line = line.substr(valueEndIdx + (line[0] === `"` ? 1 : 0)).trimStart();
      }
    }
  }

  return fields;
}

class YFinger extends Command {
  constructor(meta, content, datagrams) {
    super(meta, content, datagrams);
    this.parser = new YFingerParser(this.content);
  }

  notFound() {
    this.parser.ensureParsed();
    return this.parser.notFound;
  }

  name() {
    this.parser.ensureParsed();
    return this.parser.name;
  }

  totalOnline() {
    this.parser.ensureParsed();
    return this.parser.totalOnline;
  }

  onlinePercentageSinceRegistration() {
    this.parser.ensureParsed();
    return this.parser.onlinePercentageSinceRegistration;
  }

  left() {
    this.parser.ensureParsed();
    return this.parser.left;
  }

  onFor() {
    this.parser.ensureParsed();
    return this.parser.onFor;
  }

  idleFor() {
    this.parser.ensureParsed();
    return this.parser.idleFor;
  }

  playsWith() {
    this.parser.ensureParsed();
    return this.parser.playsWith;
  }

  exams() {
    this.parser.ensureParsed();
    return this.parser.exams;
  }

  observes() {
    this.parser.ensureParsed();
    return this.parser.observes;
  }

  isRegistered() {
    this.parser.ensureParsed();
    return this.parser.isRegistered;
  }

  isExempt() {
    this.parser.ensureParsed();
    return this.parser.isExempt;
  }

  expiresOn() {
    this.parser.ensureParsed();
    return this.parser.expiresOn;
  }

  email() {
    this.parser.ensureParsed();
    return this.parser.email;
  }

  notes() {
    this.parser.ensureParsed();
    return this.parser.notes;
  }

  glicko() {
    this.parser.ensureParsed();
    return this.parser.glicko;
  }

  ratingStats() {
    this.parser.ensureParsed();
    return Object.values(this.parser.ratingStats);
  }
}

class YFingerParser {
  constructor(content) {
    this.content = content;
    this.parsed = false;

    this.notFound = false;
    this.name = null;
    this.totalOnline = null;
    this.onlinePercentageSinceRegistration = null;
    this.left = null;
    this.onFor = null;
    this.idleFor = null;
    this.playsWith = null;
    this.exams = null;
    this.observes = null;
    this.isRegistered = null;
    this.isExempt = null;
    this.expiresOn = null;
    this.email = null;
    this.notes = [];
    this.glicko = null;
    this.ratingStats = {};
  }

  ensureParsed() {
    if (this.parsed) {
      return;
    }
    this.parsed = true;

    if (this.content.indexOf("does not match any player's name exactly.") !== -1) {
      this.notFound = true;
      return;
    }

    for (let line of this.content.trim().split("\n")) {
      if (line.startsWith("Name")) {
        this.name = line.substr(5);
      } else if (line.startsWith("Hours")) {
        const val = parseFloat(line.substr(6));
        const hours = Math.floor(val);
        const minutes = Math.floor((val - hours) * 60);
        const seconds = Math.floor((val - hours - minutes / 60.0) * 60 * 60);
        this.totalOnline = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
      } else if (line.startsWith("Percent")) {
        this.onlinePercentageSinceRegistration = parseFloat(line.substr(8));
      } else if (line.startsWith("Left")) {
        const date = DateTime.fromFormat(line.substr(5), "HH:mm dd MMM yyyy", { zone: SERVER_TIMEZONE });
        this.left = Date.parse(date.toMillis());
      } else if (line.startsWith("OnFor")) {
        this.onFor = parseInt(line.substr(5)) * 1000;
      } else if (line.startsWith("Idle")) {
        this.idleFor = parseInt(line.substr(5)) * 1000;
      } else if (line.startsWith("Plays")) {
        this.playsWith = line.substr(6);
      } else if (line.startsWith("Exams")) {
        this.exams = line.substr(6);
      } else if (line.startsWith("Obs")) {
        this.observes = line.substr(4);
      } else if (line.startsWith("Reg")) {
        this.isRegistered = line.substr(4) === "yes";
      } else if (line.startsWith("Exempt")) {
        this.isExempt = line.substr(7) === "yes";
      } else if (line.startsWith("Expir")) {
        const date = DateTime.fromFormat(line.substr(6), "dd MMM yyyy", { zone: SERVER_TIMEZONE });
        this.expiresOn = Date.parse(date.toMillis());
      } else if (line.startsWith("Address")) {
        this.email = line.substr(8);
      } else if (line.startsWith("Note")) {
        this.notes.push(line.substr(5));
      } else if (line.startsWith("Glicko")) {
        const val = line.substr(7).trim();
        const pair = val.split(" ", 2);
        const score = parseInt(pair[0]);
        const error = parseInt(pair[1].substr(1, pair[1].length - 2));
        this.glicko = new Glicko(score, error);
      }
      // Keep Contains() checks at the bottom to avoid unexpected matches.
      else if (line.indexOf("Rat") !== -1) {
        this.getRatingStat(line.substr(0, 3)).current = parseInt(line.substr(7));
      } else if (line.indexOf("Need") !== -1) {
        this.getRatingStat(line.substr(0, 3)).need = parseInt(line.substr(8));
      } else if (line.indexOf("Win") !== -1) {
        this.getRatingStat(line.substr(0, 3)).wins = parseInt(line.substr(7));
      } else if (line.indexOf("Loss") !== -1) {
        this.getRatingStat(line.substr(0, 3)).losses = parseInt(line.substr(8));
      } else if (line.indexOf("Draw") !== -1) {
        this.getRatingStat(line.substr(0, 3)).draws = parseInt(line.substr(8));
      } else if (line.indexOf("Best") !== -1) {
        const name = line.substr(0, 3);
        const val = line.substr(8);

        // Value example: 700 (02 Apr 2014)
        const match = /(\d+) \((\d+ [a-zA-Z]+ \d+)\)/.exec(val);
        const score = parseInt(match[1]);
        const date = DateTime.fromFormat(match[2], "dd MMM yyyy", { zone: SERVER_TIMEZONE });
        this.getRatingStat(name).bestScore = new BestScore(score, date.toMillis());
      }
    }
  }

  getRatingStat(name) {
    if (typeof name !== "string") throw new Error("name");

    if (!this.ratingStats[name]) {
      this.ratingStats[name] = new RatingStat(name);
    }
    return this.ratingStats[name];
  }
}

class Glicko {
  constructor(score, error) {
    if (typeof score !== "number") throw new Error("score");
    if (typeof error !== "number") throw new Error("error");

    this.score = score;
    this.error = error;
  }
}

class RatingStat {
  constructor(name) {
    if (typeof name !== "string") throw new Error("name");

    this.name = name;
    this.current = 0;
    this.need = 0;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
    this.bestScore = null;
  }
}

class BestScore {
  constructor(score, timestamp) {
    if (typeof score !== "number") throw new Error("score");
    if (typeof timestamp !== "number") throw new Error("timestamp");

    this.score = score;
    this.timestamp = timestamp;
  }
}

const commandFactory = [];
commandFactory.length = CN.COUNT;
commandFactory[CN.DATE] = Date;
commandFactory[CN.FINGER] = Finger;
commandFactory[CN.LIST] = List;
commandFactory[CN.MINUS] = Minus;
commandFactory[CN.OBSERVE] = Observe;
commandFactory[CN.PGN] = Pgn;
commandFactory[CN.PLUS] = Plus;
commandFactory[CN.S_ILLEGAL_MOVE] = IllegalMove;
commandFactory[CN.VARS0] = Vars;
commandFactory[CN.VARS] = Vars;
commandFactory[CN.YFINGER] = YFinger;

function createCommand(meta, content, datagrams) {
  if (!(meta instanceof Meta)) throw new Error("meta");
  if (typeof content !== "string") throw new Error("content");

  const factory = commandFactory[meta.id];
  if (factory) {
    return new factory(meta, content, datagrams);
  }

  return new Command(meta, content, datagrams);
}

module.exports = {
  INVALID_GAME_ID,
  UNKNOWN_META,
  BestScore,
  Command,
  Date,
  IllegalMove,
  Finger,
  Glicko,
  List,
  Meta,
  Minus,
  Observe,
  Pgn,
  Plus,
  RatingStat,
  Vars,
  YFinger,
  createCommand
};
