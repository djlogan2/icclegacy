const { assert } = require("chai");

module.exports = {
  testError: new Error("test error"),
  expectThrowsAsync: async fn => {
    let error = null;
    try {
      await fn();
    } catch (e) {
      error = e;
    }
    assert.exists(error);
    return error;
  }
};
