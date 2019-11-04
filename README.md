# icclegacy
A library to interact with the legacy ICC server from Node/Javascript

```const Legacy = require('../legacy').LegacyICC;

const legacy = new Legacy({
    username: "x",    /* Defaults to a guest login */
    password: "x",    /* Defaults to a guest login */
    host: "x",        /* Defaults, so generally no reason to use */
    port: 999,        /* Defaults, so generally no reason to use */
    error_function: (error) => {}, // Function called when there are errors
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
legacy.active_level2() // Just returns an array of level 2 datagrams we are receiving

/* ... */

Legacy.logout();
