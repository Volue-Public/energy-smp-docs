## TS_OFFSET
## About the function
This function time-shifts a time series, i.e. uses values from a period which is
different from the current calculation period.

The input time series must have a fixed resolution; passing a breakpoint time series will
yield incorrect results. The result time series has the same resolution as the input.

## Syntax
- TS_OFFSET(t,d[,s])

## Description
TS_OFFSET(t,d[,s]) reads values relative to the current period. Each result
point at time T takes the source value from `T + d * unit`.

| # | Type | Description | Example |
|---|---|---|---|
| 1 | t | Series to read values from.  | @t('AreaTemperature') |
| 2 | d | Offset amount in the unit specified in argument 3. | -2 |
| 3 | s | Offset unit code (default: `'HOUR'`) | 'DAY' |

The table below shows the valid offset unit codes.

| UNIT code | Time span |
|---|---|
| MIN | 1 minute |
| MIN5 | 5 minutes |
| MIN10 | 10 minutes |
| MIN15 | 15 minutes |
| MIN30 | 30 minutes |
| HOUR | 1 hour |
| DAY | 1 day |
| WEEK | 7 days |
| MONTH | 30 days |
| YEAR | 365 days |

Note that `MONTH` and `YEAR` are always 30 and 365 days respectively; i.e. they are not
calendar-aware.

## Examples

Example 1: @TS_OFFSET(t,d)

`CompareTemp = @TS_OFFSET(@t('AreaTemperature'),-2)`

With d = -2, each `CompareTemp` point shows the `AreaTemperature` value
from 2 hours earlier.

![](assets/images/ex_TS_OFFSET-nimbustable.png)

Example 2: @TS_OFFSET(t,d)

`CompareTemp = @TS_OFFSET(@t('AreaTemperature'),3)`

With d = 3, each `CompareTemp` point shows the `AreaTemperature` value
from 3 hours later.

![](assets/images/ex_TS_OFFSET-nimbustable2.png)
