const chai = require('chai');
const Legacy = require('../legacy').LegacyICC;

describe.only("player lists", function(){
    this.timeout(60000);
    it("should return correct information on players arriving and leaving", function(done) {
        const user2 = new Legacy({
            username: process.env.USERNAME2,
            password: process.env.PASSWORD2,
            preprocessor: console.log,
            sendpreprocessor: console.log,
            player_arrived: console.log,
            player_left: console.log
        });

        function logged_in(data) {
            user2.login();
        }

        function player_arrived(data) {
            console.log("hi");
            //chai.assert.fail("do me");
            //user2.logout();
        }

        function player_left(data) {
            chai.assert.fail("do me");
            legacy.logout();
            done();
        }

        const legacy = new Legacy({
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            preprocessor: console.log,
            sendpreprocessor: console.log,
            loggedin: logged_in,
            player_arrived: player_arrived,
            player_left: player_left
        });
        legacy.login();
    });
});
