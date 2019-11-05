# icclegacy
A library to interact with the legacy ICC server from Node/Javascript

```const Legacy = require('../legacy').LegacyICC;

const legacy = new Legacy({
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

    loggedin: (data) => {},        // DG0 - WHO_AM_I
    login_failed: (data) => {},    // DG69 - LOGIN_FAILED

    match: (data) => {},           // DG29 - MATCH
    match_removed: (data) => {},   // DG30 - MATCH_REMOVED

    seek: (data) => {},            // DG50 - SEEK
    seek_removed: (data) => {}.    // DG51 - SEEK_REMOVED

});

legacy.login();

/* ... */

legacy.match(message_identifier, name, time, increment, time2, increment2, rated, wild, color);
legacy.seek(message_identifier, time, inc, rated, wild, color, auto, minrating, maxrating);
legacy.unseek(message_identifier, index);
legacy.remove_all_matches_and_seeks(message_identifier);
legacy.active_level2(); // Just returns an array of level 2 datagrams we are receiving

/* ... */

Legacy.logout();
