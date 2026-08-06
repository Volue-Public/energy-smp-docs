# INSIDE

Returns a logical time series by testing an expression towards an upper and a
lower limit.

The result series has the same resolution as the input time series.

## Syntax
- INSIDE(d,t,d[,s])
- INSIDE(t,t,t[,s])

## Description

| # | Type | Description |
|---|---|---|
| 1 | d or t | Numerical value, lower limit or Time series of numerical values, lower limit. |
| 2 | t | Current time series to be tested. |
| 3 | d or t | Numerical value, upper limit or Time series of numerical values, upper limit. |
| 4 | s | Optional. Default value (no code): min 'LOHI': min 'LOW': min 'HIGH': min @INSIDE(d,t,d)

`Temperature_hour_VV = @INSIDE(0,@t('Temperature_hour_raw'),12)`

Values in @t('Temperature_hour_raw') > 0 or @INSIDE(d,t,d,s)

`Temperature_hour_VV = @INSIDE(0, @t('Temperature_hour_raw'), 12, 'LOHI')`

Values in @t('Temperature_hour_raw') ≥ 0 and ≤ 12 are evaluated to true (1),
other values and NaN are evaluated to false (0). Here values on both the lower
limit 0 and the upper limit 12 are evaluated to true.

`Temperature_hour_VV = @INSIDE(0, @t('Temperature_hour_raw'), 12, 'LOW')`

Values in @t('Temperature_hour_raw') ≥ 0 and 0 and ≤ 12 are evaluated to true
(1), other values and NaN are evaluated to false (0). Here, values on the lower
limit 0 are evaluated to false, values on the upper limit 12 are evaluated to
true.
