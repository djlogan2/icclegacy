const net = require("net");

const host = "queen.chessclub.com";
const port = 5000;

let username;
let password;
let commands = [];
let level1 = 0;
let level2 = [];

let socket;
let handled = "";
let buffer = "";

let program = process.argv.shift();
let ourname = process.argv.shift();

while(process.argv.length) {
    const flag = process.argv.shift();
    switch (flag) {
        case "-u":
            username = process.argv.shift();
            break;
        case "-p":
            password = process.argv.shift();
            break;
        case "-l1":
            level1 = parseInt(process.argv.shift());
            break;
        case "-l2":
            const l2v = process.argv.shift();
            if(l2v === "all") {
                level2 = []; // Make sure it starts out empty
                for(let x = 0 ; x < 2000 ; x++)
                    level2.push(x);
            } else {
                const arr = process.argv.shift().split(",");
                level2 = level2.concat(arr);
            }
            break;
        case "-c":
            commands.push(process.argv.shift());
            break;
    }
}

function level2settings() {
    let ones = [];
    level2.forEach(l2 => {
        while(ones.length <= l2) ones.push("0");
        ones[l2] = "1";
    });
    ones[0] = "1"; // Just force DG_WHO_AM_I to be set
    return ones.join("");
}

let comma = "";
let loginfound = false;

function write(data) {
    console.log(comma + "null" + "     // " + data);
    comma = ",";
    socket.write(data + "\n");
}

function socket_data(data) {
    console.log(comma + "\"" + encodeURIComponent(data) + "\"");
    comma = ",";
    buffer += data;
    if(!loginfound && buffer.indexOf("login:") !== -1) {
        loginfound = true;
        handled = buffer;
        buffer = "";
        write("level1=" + level1);
        write("level2settings=" + level2settings());
        write(username);
        write(password);
    } else {
//        commands.forEach(command => write(command));
//        write("quit");
//        socket.destroy();
    }
}

function socket_error(error) {
    console.log("ERROR=" + error);
}

socket = new net.Socket();
socket.on("data", socket_data);
socket.on("error", socket_error);
socket.setEncoding("utf8");
socket.connect({
    host: host,
    port: port
});
