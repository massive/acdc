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
      global: true
    },
    timeout: {
      alias: "o",
      describe: "Timeout for an operation",
      demandOption: false,
      default: 30000,
      global: true
    },
    verbose: {
      alias: "v",
      describe: "Verbose mode",
      demandOption: false,
      default: false,
      type: "boolean",
      global: true
    }
  })
  .command(
    "status",
    "get status",
    yargs => {
      return yargs.option("r", {
        alias: "raw",
        type: "boolean",
        describe: "Raw result string"
      });
    },
    argv => {
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        conn => {
          conn.status();
        },
        result => {
          if (argv.raw) {
            console.log(JSON.stringify(result));
          } else {
            console.log(
              JSON.stringify({
                target_temp: result.AC_FUN_TEMPSET,
                temp: result.AC_FUN_TEMPNOW,
                co_mode: result.AC_FUN_COMODE,
                power: result.AC_FUN_POWER,
                op_mode: result.AC_FUN_OPMODE,
                sleep: result.AC_FUN_SLEEP,
                wind_level: result.AC_FUN_WINDLEVEL
              })
            );
          }
          process.exit(0);
        }
      );
    }
  )
  .command(
    "token",
    "get token",
    yargs => {},
    argv => {
      getToken();
    }
  )
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
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.onoff(argv.mode === "on");
          process.exit(0);
        }
      );
    }
  )
  .command(
    "on",
    "turn on",
    y => {},
    argv => {
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.onoff(true);
          process.exit(0);
        }
      );
    }
  )
  .command(
    "off",
    "turn off",
    y => {},
    argv => {
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.onoff(false);
          process.exit(0);
        }
      );
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
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.set_temperature(argv.temperature);
          process.exit(0);
        }
      );
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
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.set_convenient_mode(argv.mode);
          process.exit(0);
        }
      );
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
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.mode(argv.mode);
          process.exit(0);
        }
      );
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
      connection(
        argv.token,
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
          connection.sleep_mode(argv.minutes);
          process.exit(0);
        }
      );
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
      connection(
        argv.token, 
        { verbose: argv.verbose, timeout: argv.timeout },
        connection => {
        connection.send_command("AC_FUN_WINDLEVEL", argv.level);
        process.exit(0);
      });
    }
  )
  .help()
  .demandCommand()
  .demandOption(["token"], "Please provide token").argv;
