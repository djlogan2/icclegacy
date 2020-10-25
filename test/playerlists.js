const chai = require("chai");
const Legacy = require("../legacy").LegacyICC;

function log(n, data) {
  console.log("--- user " + n + " ---");
  console.log(data);
}
describe("player lists", function () {
  this.timeout(60000);
  it("should return correct information on players arriving and leaving", function (done) {
    const user2 = new Legacy({
      username: process.env.USERNAME2,
      password: process.env.PASSWORD2,
      //player_arrived: (data) => log(2, data),
      //player_left: (data) => log(2, data),
      //sendpreprocessor: (data) => log(2, data),
      //preprocessor: (data) => log(2, data)
    });

    function logged_in(data) {
      user2.login();
    }

    function player_arrived(data) {
      if (data.player_name === process.env.USERNAME2) user2.logout();
    }

    function player_left(data) {
      if (data.player_name === process.env.USERNAME2) {
        legacy.logout();
        done();
      }
    }

    const legacy = new Legacy({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      loggedin: logged_in,
      player_arrived: player_arrived,
      player_left: player_left,
      //sendpreprocessor: (data) => log(1, data),
      //preprocessor: (data) => log(1, data)
    });
    legacy.login();
  });
});
