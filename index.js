const yargs = require("yargs");
const aircon = require("./lib/aircon.js");
require("dotenv").config();

const token = process.env.TOKEN;

yargs
  .usage("$0 <cmd> [args]")
  .command("status", "get status", argv => {
    aircon(token, aircon => aircon.status(), result => console.log(result));
  })
  .command("on", "turn on", argv => {
    aircon(token, aircon => {
      aircon.onoff(true);
      process.exit(1);
    });
  })
  .command("off", "turn off", argv => {
    aircon(token, aircon => {
      aircon.onoff(false);
      process.exit(1);
    });
  })
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
      aircon(token, aircon => {
        aircon.set_temperature(argv.temperature);
        process.exit(1);
      });
    }
  )
  .help().argv;
