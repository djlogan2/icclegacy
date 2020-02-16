"use strict";

const { describe, it } = require("mocha");
const { assert } = require("chai");
const { Parser } = require("./parser");
const { Command, Meta } = require("./command");
const { Datagram } = require("./datagram");

const PART1 =
  "\x19(56 1134 W 107501 1\x19)\x19[2 V-Milov\r\n\x19(56 1134 W 98657 0\x19)\x19(24 1134 a7e3 1\x19)\x19]\x19(56 ";
const PART2 =
  "1134 B 68191 1\x19)\x19[2 janlou\r\n\x19(56 1134 B 57115 0\x19)\x19(24 1134 d8d3 1\x19)\x19]\x19(56 1134 ";
const PART3 =
  "W 98657 1\x19)\x19[2 V-Milov\r\n\x19(56 1134 W 91563 0\x19)\x19(24 1134 e3e1 1\x19)\x19]\x19(56 1134 B 57115 1\x19)\x19[2 janlou\r\n\x19(56 1134 B 41967 0\x19)\x19(24 1134 d3f3n 1\x19)\x19]\x19(56 1134 W 91563 1\x19)\x19[2 V-Milov\r\n\x19(56 1134 W 79922 0\x19)\x19(24 1134 g2f3r 1\x19)\x19]\x19(56 1134 B 41967 1\x19)\x19[208 janlou\r\n{Game 1134 (V-Milov vs. janlou) janlou resigns} 1-0\r\n\x19(56 1134 W 79922 0\x19)\x19(56 1134 B 41967 0\x19)\x19(16 1134 1 Res 1-0 \x19{Black resigns\x19} \x19{A07\x19}\x19)\x19(112 1134 Result \x19{1-0\x19}\x19)Game 1134 becomes an examined game.\r\n\x19]" +
  "\x19[137 $server$\r\nGame 1522 is now the primary game on your observation list.\r\n" +
  "\x19(18 1522 midomido Darnoc 0 1-minute 1 1 0 1 0 1 \x19{\x19} 2292 2570 1638901213 {IM} {GM} 0 0 0 {} 0\x19)" +
  "\x19(152 midomido 1522 FR\x19)\x19(152 Darnoc 1522 us\x19)\x19(112 1522 Event \x19{ICC 1 0\x19}\x19)" +
  "\x19(112 1522 Site \x19{Internet Chess Club\x19}\x19)\x19(112 1522 Date \x19{2014.01.04\x19}\x19)" +
  "\x19(112 1522 Round \x19{-\x19}\x19)" +
  "\x19(112 1522 White \x19{midomido\x19}\x19)" +
  "\x19(112 1522 Black \x19{Darnoc\x19}\x19)" +
  "\x19(112 1522 Result \x19{*\x19}\x19)" +
  "\x19(39 1522 0\x19)" +
  "\x19(101 1522 {rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1} 70\x19)" +
  "\x19(24 1522 d2d4 0\x19)" +
  "\x19(24 1522 d7d5 0\x19)" +
  "\x19(24 1522 g1f3 0\x19)" +
  "\x19(24 1522 g8f6 0\x19)" +
  "\x19(24 1522 c2c4 0\x19)" +
  "\x19(24 1522 c7c6 0\x19)" +
  "\x19(24 1522 e2e3 0\x19)" +
  "\x19(24 1522 c8f5 0\x19)" +
  "\x19(24 1522 d1b3 0\x19)" +
  "\x19(24 1522 d8b6 0\x19)" +
  "\x19(24 1522 c4d5p 0\x19)" +
  "\x19(24 1522 b6b3q 0\x19)" +
  "\x19(24 1522 a2b3q 0\x19)" +
  "\x19(24 1522 f6d5p 0\x19)" +
  "\x19(24 1522 f1c4 0\x19)" +
  "\x19(24 1522 d5b4 0\x19)" +
  "\x19(24 1522 b1a3 0\x19)" +
  "\x19(24 1522 e7e6 0\x19)" +
  "\x19(24 1522 c1d2 0\x19)" +
  "\x19(24 1522 b4d3 0\x19)" +
  "\x19(24 1522 c4d3n 0\x19)" +
  "\x19(24 1522 f5d3b 0\x19)" +
  "\x19(24 1522 a3c4 0\x19)" +
  "\x19(24 1522 b8d7 0\x19)" +
  "\x19(24 1522 f3e5 0\x19)" +
  "\x19(24 1522 d7e5n 0\x19)" +
  "\x19(24 1522 c4e5n 0\x19)" +
  "\x19(24 1522 d3b5 0\x19)" +
  "\x19(24 1522 f2f3 0\x19)" +
  "\x19(24 1522 f8e7 0\x19)" +
  "\x19(24 1522 e1f2 0\x19)" +
  "\x19(24 1522 e8g8c 0\x19)" +
  "\x19(24 1522 d2c3 0\x19)" +
  "\x19(24 1522 f8d8 0\x19)" +
  "\x19(24 1522 h1d1 0\x19)" +
  "\x19(24 1522 f7f6 0\x19)" +
  "\x19(24 1522 e5c4 0\x19)" +
  "\x19(24 1522 b5a6 0\x19)" +
  "\x19(24 1522 e3e4 0\x19)" +
  "\x19(24 1522 d8d7 0\x19)" +
  "\x19(24 1522 f2e3 0\x19)" +
  "\x19(24 1522 a8d8 0\x19)" +
  "\x19(24 1522 f3f4 0\x19)" +
  "\x19(24 1522 c6c5 0\x19)" +
  "\x19(24 1522 d4d5 0\x19)" +
  "\x19(24 1522 e6d5p 0\x19)" +
  "\x19(24 1522 e4d5p 0\x19)" +
  "\x19(24 1522 d7d5p 0\x19)" +
  "\x19(24 1522 d1d5r 0\x19)" +
  "\x19(24 1522 d8d5r 0\x19)" +
  "\x19(24 1522 e3e4 0\x19)" +
  "\x19(24 1522 d5d7 0\x19)" +
  "\x19(24 1522 e4f5 0\x19)" +
  "\x19(24 1522 g8f7 0\x19)" +
  "\x19(24 1522 f5e4 0\x19)" +
  "\x19(24 1522 g7g6 0\x19)" +
  "\x19(24 1522 f4f5 0\x19)" +
  "\x19(24 1522 a6b5 0\x19)" +
  "\x19(24 1522 f5g6p 0\x19)" +
  "\x19(24 1522 h7g6p 0\x19)" +
  "\x19(24 1522 a1a7p 0\x19)" +
  "\x19(24 1522 b5c6 0\x19)" +
  "\x19(24 1522 e4e3 0\x19)" +
  "\x19(24 1522 b7b5 0\x19)" +
  "\x19(24 1522 a7d7r 0\x19)" +
  "\x19(24 1522 c6d7r 0\x19)" +
  "\x19(24 1522 c4a5 0\x19)" +
  "\x19(24 1522 f7e6 0\x19)" +
  "\x19(24 1522 g2g3 0\x19)" +
  "\x19(24 1522 e6d5 0\x19)" +
  "\x19(21 1522 0 0 0 0 0 0 0 0\x19)" +
  "\x19(38 1522 30 19\x19)" +
  "\x19(56 1522 W 30420 1 0 100\x19)" +
  "\x19(56 1522 B 19442 0 0 100\x19)\x19]" +
  "\x19[2 midomido\r\n\x19(56 1522 W 28341 0\x19)\x19(24 1522 h2h4 1\x19)\x19]\x19(56 1522 B 19442 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 18973 0\x19)\x19(24 1522 e7d8 1\x19)\x19]\x19(56 1522 W 28341 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 27062 0\x19)\x19(24 1522 e3f3 1\x19)\x19]\x19(56 1522 B 18973 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 17613 0\x19)\x19(24 1522 b5b4 1\x19)\x19]\x19(56 1522 W 27062 1\x19)\x19[123 janlou\r\n\x19(17 1134\x19)\r\nGame 1134 (which you were observing) has no examiners.\r\n\x19(19 1134\x19)\x19]\x19[2 midomido\r\n\x19(56 1522 W 26687 0\x19)\x19(24 1522 a5c4 1\x19)\x19]\x19(56 1522 B 17613 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 16847 0\x19)\x19(24 1522 b4c3b 1\x19)\x19]\x19(56 1522 W 26687 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 26587 0\x19)\x19(24 1522 b2c3p 1\x19)\x19]\x19(56 1522 B 16847 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 16425 0\x19)\x19(24 1522 d5e6 1\x19)\x19]\x19(56 1522 W 26587 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 24730 0\x19)\x19(24 1522 g3g4 1\x19)\x19]\x19(56 1522 B 16425 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 16325 0\x19)\x19(24 1522 d7c6 1\x19)\x19]\x19(56 1522 W 24730 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 23950 0\x19)\x19(24 1522 f3f4 1\x19)\x19]\x19(56 1522 B 16325 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 16225 0\x19)\x19(24 1522 c6d5 1\x19)\x19]\x19(56 1522 W 23950 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 23107 0\x19)\x19(24 1522 h4h5 1\x19)\x19]\x19(56 1522 B 16225 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 8130 0\x19)\x19(24 1522 g6g5 1\x19)\x19]\x19(56 1522 W 23107 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 20345 0\x19)\x19(24 1522 f4e3 1\x19)\x19]\x19(56 1522 B 8130 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 8030 0\x19)\x19(24 1522 d5c4n 1\x19)\x19]\x19(56 1522 W 20345 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 20079 0\x19)\x19(24 1522 b3c4b 1\x19)\x19]\x19(56 1522 B 8030 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 7889 0\x19)\x19(24 1522 f6f5 1\x19)\x19]\x19(56 1522 W 20079 1\x19)\x19[2 midomido\r\n\x19(56 1522 W 18394 0\x19)\x19(24 1522 h5h6 1\x19)\x19]\x19(56 1522 B 7889 1\x19)\x19[2 Darnoc\r\n\x19(56 1522 B 7546 0\x19)\x19(24 1522 d8f6 1\x19)\x19]";

describe("Parser", () => {
  it("can parse fragmented data with orphaned datagrams", () => {
    const actual = [];
    const parser = new Parser();
    for (let p of [PART1, PART2, PART3]) {
      const res = parser.append(p);
      actual.push(...res.commands);
    }

    const want = [
      new Command(new Meta(2, "V-Milov"), "", [
        new Datagram(56, ["1134", "W", "107501", "1"]),
        new Datagram(56, ["1134", "W", "98657", "0"]),
        new Datagram(24, ["1134", "a7e3", "1"])
      ]),
      new Command(new Meta(2, "janlou"), "", [
        new Datagram(56, ["1134", "B", "68191", "1"]),
        new Datagram(56, ["1134", "B", "57115", "0"]),
        new Datagram(24, ["1134", "d8d3", "1"])
      ]),
      new Command(new Meta(2, "V-Milov"), "", [
        new Datagram(56, ["1134", "W", "98657", "1"]),
        new Datagram(56, ["1134", "W", "91563", "0"]),
        new Datagram(24, ["1134", "e3e1", "1"])
      ]),
      new Command(new Meta(2, "janlou"), "", [
        new Datagram(56, ["1134", "B", "57115", "1"]),
        new Datagram(56, ["1134", "B", "41967", "0"]),
        new Datagram(24, ["1134", "d3f3n", "1"])
      ]),
      new Command(new Meta(2, "V-Milov"), "", [
        new Datagram(56, ["1134", "W", "91563", "1"]),
        new Datagram(56, ["1134", "W", "79922", "0"]),
        new Datagram(24, ["1134", "g2f3r", "1"])
      ]),
      new Command(
        new Meta(208, "janlou"),
        "{Game 1134 (V-Milov vs. janlou) janlou resigns} 1-0\r\nGame 1134 becomes an examined game.\r\n",
        [
          new Datagram(56, ["1134", "B", "41967", "1"]),
          new Datagram(56, ["1134", "W", "79922", "0"]),
          new Datagram(56, ["1134", "B", "41967", "0"]),
          new Datagram(16, ["1134", "1", "Res", "1-0", "Black resigns", "A07"]),
          new Datagram(112, ["1134", "Result", "1-0"])
        ]
      )
    ];

    actual.length = 6;
    assert.equal(actual.length, want.length);
    for (let i = 0; i < actual.length; i++) {
      assert.deepStrictEqual(actual[i].meta, want[i].meta, "Command at index " + i);
      assert.deepStrictEqual(actual[i].content, want[i].content, "Command at index " + i);
      assert.sameDeepMembers(actual[i].datagrams, want[i].datagrams, "Command at index " + i);
    }
  });
});
