var API = require('node-samsung-airconditioner')

const token = "";
// let token = null

const logger = {
  error   : function(msg, props) { console.log(msg); if (!!props) console.trace(props.exception); },
  warning : function(msg, props) { console.log(msg); if (!!props) console.log(props);             },
  notice  : function(msg, props) {  },
  info    : function(msg, props) {  },
  debug   : function(msg, props) {  }
};

new API({logger: logger}).on('discover', function(aircon) {
  if (!token) {
    aircon.get_token(function(err, token) {
      if (!!err) return console.log('login error: ' + err.message);

      // remember token for next time!
    }).on('waiting', function() {
      console.log('please power on the device within the next 30 seconds');
    }).on('end', function() {
      console.log('aircon disconnected');
    }).on('err', function(err) {
      console.log('aircon error: ' + err.message);
    });
    return;
  }
  aircon.login(token, function(err) {
    if (!!err) return console.log('login error: ' + err.message);

  }).on('stateChange', function(state) {
    // Responses, or user triggered state changes
    console.log(state);
    process.exit(0)
  }).on('loginSuccess', function () {
    const cmd = process.argv[2]

    if (cmd === "status") {
      aircon.status()
    } else if (cmd === "on") {
      aircon.onoff(true)
    } else if (cmd === "off") {
      aircon.onoff(false)
    } else {
      process.exit(-1)
    }
  });
});
