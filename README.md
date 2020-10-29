# icclegacy
A library to interact with the legacy ICC server from Node/Javascript

This is a work in progress. I am writing this primarily for my own purposes to add to another ICC related project.
Thus, there are going to be lots of things that aren't possible right away. Error messaging doesn't work as
well as it needs to, etc.

Feel free to pull and add to the code if you so desire. I will do my best to let you know if I have to change
the code to meet my own needs, and of course I will do my best to make sure I can fit within the existing framework
if you write it.

Here are the hooks and methods written so far:
```

//const Legacy = require('../legacy').LegacyICC;
//or
//import legacy from "icclegacy";

//const legacy = new Legacy({
//or
//const legacy = new legacy.LegacyICC({
    username: "x",    /* Defaults to a guest login */
    password: "x",    /* Defaults to a guest login */
    host: "x",        /* Defaults, so generally no reason to use */
    port: 999,        /* Defaults, so generally no reason to use */
    error_function: (error) => {}, // Function called when there are errors
    /* 
       These preprocessors will prevent the code from going further if you return a truthy
       value. For example, if "sendpreprocessor(data)" returns true, the code will no longer send
       that data to the server. preprocessor would prevent packets from being processed further, etc.
    */
    sendpreprocessor(data) => {},  // Function called just before sending this data to the server
    preprocessor: (packets) => {}, // Function called after preparser and before specific datagram functions
    preparser: (data) => {},       // Function called after receiving new data from ICC socket

    loggedin: (data) => {},
    login_failed: (data) => {},    
    logged_out: () => {},          

    match: (data) => {},           
    match_removed: (data) => {},   

    seek: (data) => {},            
    seek_removed: (data) => {},    

    my_game_started: (data) => {},  
    my_game_result: (data) => {}, 
    move: (data) => {},
    offers_in_my_game: (data) => {},
    players_in_my_game: (data) => {},
    examined_game_is_gone: (data) => {},
    my_game_ended: (data) => {},
    msec(data) => {},

    player_arrived: (data) => {},
    player_left: (data) => {},

    game_started: (data) => {},
    game_result: (data) => {},

    backward: (data) => {},
    circle: (data) => {},
    uncircle: (data) => {},
    arrow: (data) => {},
    unarrow: (data) => {},
    boardinfo: (data) => {},

    personal_tell: (data) => {}
});

legacy.login();

/* ... */

legacy.match(message_identifier, name, time, increment, time2, increment2, rated, wild, color);
legacy.seek(message_identifier, time, inc, rated, wild, color, auto, minrating, maxrating);
legacy.unseek(message_identifier, index);
legacy.remove_all_matches_and_seeks(message_identifier);
legacy.accept(message_identifier, who);
legacy.play(message_identifier, who);
legacy.move(message_identifier, _move);
legacy.resign(message_identifier, who);
legacy.decline_match(message_identifier, who);
legacy.adjourn(message_identifier);
legacy.resume(message_identifier);
legacy.abort(message_identifier);
legacy.takeback(message_identifier, count);
legacy.draw(message_identifier);

legacy.observe(message_identifier, what);

legacy.examine(message_identifier, what);
legacy.forward(message_identifier, count);
legacy.backward(message_identifier, count);
legacy.mexamine(message_identifier, who);
legacy.unexamine(message_identifier);
legacy.circle(message_identifier, sq);
legacy.uncircle(message_identifier, sq);
legacy.arrow(message_identifier, sq1, sq2);
legacy.unarrow(message_identifier, sq1, sq2);
legacy.revert(message_identifier);

legacy.boardinfo(message_identifier, type, square_a, square_b, color);
legacy.libdelete(message_identifier, slot);
legacy.noautologout(message_identifier, true_or_false);
legacy.libkeepexam(message_identifier, whitename, blackname, result, slot);
legacy.personal_tell(message_identifier, who, what);

legacy.active_level2(); // Just returns an array of level 2 datagrams we are receiving

/* ... */

legacy.logout();
```
Here is an example of how we are using it in our Meteor based project today:
```
import legacy from "icclegacy";
//...
//...
LegacyUser.login = function(user) {
  legacy_users[user._id] = new legacy.LegacyICC({
    username: user.profile.legacy.username,
    password: decrypt(user.profile.legacy.password),
    error_function: Meteor.bindEnvironment(error_function),
    loggedin: Meteor.bindEnvironment(data => loggedin(data, user._id)),
    logged_out: Meteor.bindEnvironment(data => loggedout(data, user._id)),
    login_failed: Meteor.bindEnvironment(login_failed),
    seek: Meteor.bindEnvironment(seek),
    seek_removed: Meteor.bindEnvironment(seek_removed),
    preprocessor: Meteor.bindEnvironment(debugpackets),
    preparser: Meteor.bindEnvironment(debugrawdata),
    sendpreprocessor: Meteor.bindEnvironment(debugsentcommands),
    player_arrived: Meteor.bindEnvironment(player_arrived),
    player_left: Meteor.bindEnvironment(player_left),
    match: Meteor.bindEnvironment(match),
    match_removed: Meteor.bindEnvironment(match_removed),
    my_game_started: Meteor.bindEnvironment(my_game_started),
    my_game_result: Meteor.bindEnvironment(my_game_result),
    my_game_ended: Meteor.bindEnvironment(my_game_ended),
    msec: Meteor.bindEnvironment(msec),
    move: Meteor.bindEnvironment(move)
  });
  this.userId = user._id;
  legacy_users[user._id].login();
};
//
// A few of our methods just for illustration:
//
function seek_removed(data) {
  //log.debug("seek_removed", data);
  GameRequests.removeLegacySeek("server", data.index, data.reasoncode);
}

function debugpackets(data) {
  //log.debug("PACKETS=", data);
}

function debugrawdata(databuffer) {
  //log.debug("RAW=", databuffer);
}

function debugsentcommands(databuffer) {}

function player_arrived(data) {
  log.debug("player_arrived", data);
  LegacyUsersCollection.insert(data);
}

function player_left(data) {
  log.debug("player_left", data);
  LegacyUsersCollection.remove({ player_name: data.player_name });
}

function match_removed(data) {
  log.debug("match_removed", data);
  GameRequests.removeLegacyMatchRequest(
    data.message_identifier,
    data.challenger_name,
    data.receiver_name,
    data.explanation_string
  );
}

```
In general, the library will return you an object that has every field in format.txt in the same order, typed correctly (ints are ints, booleans are booleans, etc.)
It uses the level 1 "aribitrary-word" support to send what we call a "message-identifier", which basically means that when you send a command to ICC like ```legacy.accept('acceptgame-123', 'djlogan')```,
any packets associated with this command will have a message_identifier of ```'acceptgame-123'```. In this example, you should receive a message identifier of ```'acceptgame-123'``` whether the packets are game started packets or error packets.
This obviously gives you the ability to route packets to the right place based on unique message identifiers of your choosing.
