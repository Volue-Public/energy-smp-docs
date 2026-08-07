# NOT

Checks the content of a time series for values 0 or NaN. The result series has
Boolean values and has the same resolution as the input time series.

## Syntax
- NOT(t)

## Description
The resulting value is 1 if the value found is 0 or NaN. Otherwise, the result
is 0.

## Example
`Temperature_hour_VV = @NOT(@t('Temperature_hour_raw'))`

In row 2 the result is 1, as the value of Temperature_hour_raw is 0 or NaN.

![](assets/images/ex_NOT-nimbuschart_red.png)
