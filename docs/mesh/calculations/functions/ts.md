# TS

## About the function

Creates a time series for further use in expressions.
This function serves as a way to declare and initialise a time series.

## Syntax

- TS(s[,d])
- TS(s,s[,d])

## TS(s[,d])

### Description

| # | Type | Description | Example |
|---|---|---|---|
| 1 | s | Unit. | 'VARINT', 'MIN15', 'HOUR' etc. |
| 2 | d | Optional. Value. |   |

## TS(s,s[,d])

### Description

| # | Type | Description | Example |
|---|---|---|---|
| 1 | s | Unit. | 'VARINT', 'MIN15', 'HOUR' etc. |
| 2 | s | Type of curve. | Type of curve is 'NONE', 'STEP' or 'LINEAR'. |
| 3 | d | Optional. Value. |   |

The value is assigned to all points in time.

## Examples
@TS(s)

` TS1 = @TS('VARINT')`

Time series TS1 is defined as a breakpoint series and is set empty (NaN) as
default. There will be a NaN value at start of requested time period.

@TS(s,d)

`TS2 = @TS('VARINT',1)`

Time series TS2 is defined as breakpoint series and get 1 as value at start of requested time period.

Series with other resolutions:

`TS3 = @TS('HOUR')`

Time series TS3 gives an empty time series (NaN) with hourly resolution and values for the requested time period.

`TS4 = @TS('HOUR',0)`

Time series TS4 gives a time series with 0 in all hours for the requested time period.

Default curve type is `STEP`. To make the result series linear you can add a second argument with value `'LINEAR'` like this:

`TS5 = @TS('DAY','LINEAR')`

**Note!** The curve type argument is case sensitive.

You may add a third argument to initialise values to a given number.
