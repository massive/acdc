# ACDC

Samsung Air conditioner Command Line Tool

This tool can get the status of certain Wifi enabled Samsung Air Conditioner units. See more at https://github.com/zyrorl/node-samsung-airconditioner#readme

## Installation

`npm install`

### Get token

Proceed as `acdc status` instructs.

Add given token to `.env`

## Usage

`acdc  --help`

```
acdc <cmd> [args]

Commands:
  index.js status              get status
  index.js on                  turn on
  index.js off                 turn off
  index.js temp [temperature]  set temperature

Options:
  --version  Show version number                                       [boolean]
  --help     Show help
```
