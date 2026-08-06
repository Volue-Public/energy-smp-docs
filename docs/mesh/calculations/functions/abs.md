# ABS

This function is used to determine the absolute value(s) for a time series.

## Syntax
- ABS(t)

| # | Type | Description |
|---|---|---|
| 1 | t | Time series |

## Example
`Temperature_hour_VV = @ABS(@t('Temperature_hour_raw'))`

In Time 14, the resulting absolute value of -5,00 is 5,00.

![](assets/images/ex_ABS-nimbustable.png)
