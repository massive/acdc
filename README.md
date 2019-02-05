# ACDC

Samsung Air conditioner Command Line Tool

This tool can get the status of certain Wifi enabled Samsung Air Conditioner units. See more at https://github.com/zyrorl/node-samsung-airconditioner#readme

## Installation

`npm install`

### Get token

Proceed as `acdc token` instructs.

## Usage

`acdc  --help`

```
acdc <cmd> [args]

Commands:
  acdc status              get status
  acdc token               get token
  acdc power [mode]        turn on or off
  acdc on                  turn on
  acdc off                 turn off
  acdc temp [temperature]  set temperature
  acdc wind [mode]         set wind mode
  acdc run [mode]          set mode
  acdc sleep [minutes]     good sleep duration
  acdc level [level]       set wind level

Options:
  --version      Show version number                                   [boolean]
  --token, -t    AC API token                         [required] [default: null]
  --verbose, -v  verbose mode                         [boolean] [default: false]
  --help         Show help                                             [boolean]
```

For instance

```
$> acdc status -t AC_TOKEN
{"temp_set":"23","temp":"23","mode":"Quiet","power":"On","op":"Heat","sleep":"0","wind":"Auto"}
```
