#!/usr/bin/env node

const yargs = require("yargs");
const aircon = require("./aircon");

const token = process.env.TOKEN;
const connection = aircon.connection;
const getToken = aircon.getToken;

const argv = yargs
  .usage("$0 <cmd> [args]")
  .options({
    token: {
      alias: "t",
      describe: "AC API token",
      demandOption: false,
      default: null,
      global: true,
    },
    verbose: {
      alias: "v",
      describe: "verbose mode",
      demandOption: false,
      default: false,
      type: "boolean",
      global: true
    }
  })
  .command(
    "status",
    "get status",
    yargs => {},
    argv => {
      connection(
        argv.token,
        argv.verbose,
        conn => {
          conn.status();
        },
        result => {
          console.log(result);
          process.exit(0);
        }
      );
    }
  )
  .command("token", "get token", yargs => {}, argv => {
    getToken();
  })
  .command(
    "power [mode]",
    "turn on or off",
    yargs => {
      yargs.positional("mode", {
        describe: "power mode",
        default: "on",
        choices: ["off", "on"]
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.onoff(argv.mode === "on");
        process.exit(0);
      });
    }
  )
  .command(
    "on",
    "turn on",
    y => {},
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.onoff(true);
        process.exit(1);
      });
    }
  )
  .command(
    "off",
    "turn off",
    y => {},
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.onoff(false);
        process.exit(1);
      });
    }
  )
  .command(
    "temp [temperature]",
    "set temperature",
    yargs => {
      yargs.positional("temperature", {
        type: "number",
        describe: "target temperature"
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.set_temperature(argv.temperature);
        process.exit(1);
      });
    }
  )
  .command(
    "wind [mode]",
    "set wind mode",
    yargs => {
      yargs.positional("mode", {
        describe: "wind mode",
        default: "smart",
        choices: [
          "off",
          "quiet",
          "sleep",
          "smart",
          "softcool",
          "turbomode",
          "windmode1",
          "windmode2",
          "windmode3"
        ]
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.set_convenient_mode(argv.mode);
        process.exit(1);
      });
    }
  )
  .command(
    "run [mode]",
    "set mode",
    yargs => {
      yargs.positional("mode", {
        describe: "run mode",
        default: "heat",
        choices: ["auto", "cool", "dry", "wind", "heat"]
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.mode(argv.mode);
        process.exit(1);
      });
    }
  )
  .command(
    "sleep [minutes]",
    "good sleep duration",
    yargs => {
      yargs.positional("minutes", {
        describe: "minutes to be in sleep mode",
        type: "number"
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.sleep_mode(argv.minutes);
        process.exit(1);
      });
    }
  )
  .command(
    "level [level]",
    "set wind level",
    yargs => {
      yargs.positional("level", {
        describe: "set wind mode",
        choices: ["auto", "low", "mid", "high", "turbo"]
      });
    },
    argv => {
      connection(argv.token, argv.verbose, connection => {
        connection.send_command("AC_FUN_WINDLEVEL", argv.level);
        process.exit(1);
      });
    }
  )
  .help()
  .demandCommand()
  .demandOption(["token"], "Please provide token").argv;
