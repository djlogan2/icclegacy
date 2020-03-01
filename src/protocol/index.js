"use strict";

const { Parser } = require("./parser");
const { CN, DG } = require("./id");
const { Bad, Command, Meta, Date, Finger, IllegalMove, List, Minus, Observe, Pgn, Plus, Vars, YFinger } = require("./command");
const { Datagram, LoginFailed, WhoAmI } = require("./datagram");
const {
  AllowKibitzWhilePlaying,
  AutoUnobserve,
  BellRule,
  BusyLevel,
  Color,
  GameMailFormat,
  GameQuietnessLevel,
  HelpLanguage,
  KibitzType,
  MarkerBrush,
  MarkerType,
  MoveVariation,
  ProvisionalStatus,
  SeekRemovedReason,
  SeekVisibility,
  TellHighlight,
  TellType,
  WhisperVisibility,
  Wild
} = require("./const");

module.exports = {
  Parser,
  CN,
  DG,
  Command,
  Datagram,
  Meta,

  Bad,
  Date,
  Finger,
  IllegalMove,
  List,
  Minus,
  Observe,
  Pgn,
  Plus,
  Vars,
  YFinger,

  LoginFailed,
  WhoAmI,

  AllowKibitzWhilePlaying,
  AutoUnobserve,
  BellRule,
  BusyLevel,
  Color,
  GameMailFormat,
  GameQuietnessLevel,
  HelpLanguage,
  KibitzType,
  MarkerBrush,
  MarkerType,
  MoveVariation,
  ProvisionalStatus,
  SeekRemovedReason,
  SeekVisibility,
  TellHighlight,
  TellType,
  WhisperVisibility,
  Wild
};
