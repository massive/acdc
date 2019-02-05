const API = require("node-samsung-airconditioner");
require("console.mute");

const logger = {
  error: function(msg, props) {
    console.log(msg);
    if (!!props) console.trace(props.exception);
  },
  warning: function(msg, props) {
    console.log(msg);
    if (!!props) console.log(props);
  },
  notice: function(msg, props) {},
  info: function(msg, props) {},
  debug: function(msg, props) {}
};

const connection = (token, verbose, onConnect, onResult) => {
  if (token === null) {
    console.error("mandatory parameter token missing");
    process.exit(1);
  }

  const apiLogger = verbose ? {} : { logger };
  if (!verbose) console.mute();
  let deviceCount = 0;

  new API(apiLogger).on("discover", function(aircon) {
    deviceCount += 1;

    if (deviceCount > 1) return;

    aircon
      .login(token, function(err) {
        if (!!err) return console.log("login error: " + err.message);
      })
      .on("stateChange", function(state) {
        console.resume();
        if (onResult) onResult(state);
      })
      .on("loginSuccess", function() {
        console.resume();
        onConnect(aircon);
        console.mute();
      });
  });
};

const getToken = verbose => {
  const apiLogger = verbose ? {} : { logger };

  return new API(apiLogger).on("discover", (aircon) => {
    aircon
      .get_token(function(err, token) {
        if (!!err) return console.log("login error: " + err.message);
        console.log(`token found: ${token}`);
      })
      .on("waiting", function() {
        console.log("please power on the device within the next 30 seconds");
      })
      .on("end", function() {
        console.log("aircon disconnected");
      })
      .on("err", function(err) {
        console.log("aircon error: " + err.message);
      });
  });
};

const connectionWithTimeout = (token, opts, onConnect, onResult) => {
  return new Promise(function(resolve, reject) {
    connection(token, opts.verbose, onConnect, onResult);

    setTimeout(function() {
      reject("timeout");
    }, opts.timeout);
  }).catch(() => {
    console.resume();
    console.log("Time exceeded")
    process.exit(2)
  });
};

module.exports = { connection: connectionWithTimeout, getToken };
