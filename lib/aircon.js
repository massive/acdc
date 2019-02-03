const API = require("node-samsung-airconditioner");
require('console.mute');

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

const aircon = (token, onConnect, onResult) => {
    new API({ logger: logger }).on("discover", function(aircon) {
      if (!token) {
        aircon
          .get_token(function(err, token) {
            if (!!err) return console.log("login error: " + err.message);
            console.log(`token found: ${token}`)
            // remember token for next time!
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
        return;
      } else {
        console.mute();
      }
      aircon
        .login(token, function(err) {
          if (!!err) return console.log("login error: " + err.message);
        })
        .on("stateChange", function(state) {
          // Responses, or user triggered state changes
          console.resume();
          if (onResult) onResult(state);
          process.exit(0);
        })
        .on("loginSuccess", function() {
          console.resume();
          onConnect(aircon);
          console.mute();
        });
    });
  };

module.exports = aircon;