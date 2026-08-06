# Normal
## About the function

Calculates various normal series for input series with respect to a defined
history period given as from and until year.

## Syntax
- Normal(t,d,d,s,s,d)

## Description

| # | Type | Description | Example |
|---|---|---|---|
| 1 | t | Source time series to create percentile from. |   |
| 2 | d | Start year | 1990 |
| 3 | d | Until year | 2000 |
| 4 | s | The normal type to be calculated. Available types are: MIN, MAX, AVERAGE and MEDIAN. | AVERAGE |
| 5 | s | The smoothing method to apply prior to calculating the normal.<br/> Available types are:<br/> NONE, AVERAGE, MEDIAN, GAUSS, MEDIAN_GAUSS<br/>Implicitly applies the corresponding TS_GLIDING_* function. | AVERAGE |
| 6 | d | Size of the smoothing value window.<br/>Zero means no smoothing. Must be an odd number. If input is an even number greater than 0, it is incremented by one. |   |

## Example

`Normal_temperature = @Normal(@t('Temperature_hour_operative'),2000,2013,'Max','MEDIAN_GAUSS',3)`
