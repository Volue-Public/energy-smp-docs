# OUTSIDE
## About the function
Returns a logical time series by testing an expression towards an upper and a
lower limit.

The result series has the same resolution as the input time series.

## Syntax
- OUTSIDE(d,t,d[,s])
- OUTSIDE(t,t,t[,s])

## Description

| # | Type | Description |
|---|---|---|
| 1 | d or t | Numerical value, lower limit or Time series of numerical values, lower limit. |
| 2 | t | Current time series to be tested. |
| 3 | d or t | Numerical value, upper limit or Time series of numerical values, upper limit. |
| 4 | s | Optional. Default value (no code): min > expression or expression > max 'LOHI': min >= expression or expression >= max 'LOW': min >= expression or expression > max 'HIGH': min > expression or expression >= max |

## Examples
### Example 1: @OUTSIDE(d,t,d)

```
Temperature_hour_VV = @OUTSIDE(0, @t('Temperature_hour_raw'), 12)
```

Values in @t('Temperature_hour_raw') 12 are evaluated to true (1). Other values
and NaN are evaluated to false (0). Here values on both the lower limit 0 and
upper limit 12 are evaluated to false.

### Example 2: @OUTSIDE(d,t,d,s)

```
Temperature_hour_VV = @OUTSIDE(0, @t('Temperature_hour_raw'), 12, 'LOHI')
```

Values in @t('Temperature_hour_raw') ≤0 and ≥12 are evaluated to true (1), other
values and NaN are evaluated to false (0). Here values on both the lower limit 0
and upper limit 12 are evaluated to true.

```
Temperature_hour_VV = @OUTSIDE(0, @t('Temperature_hour_raw'), 12, 'LOW')
```

Values in @t('Temperature_hour_raw') ≤0 and > 12 are evaluated to true (1),
other values and NaN are evaluated to false (0). Here values on the lower limit
0 are evaluated to true and values on the upper limit 12 are evaluated to false.

```
Temperature_hour_VV = @OUTSIDE(0, @t('Temperature_hour_raw'), 12, 'HIGH')
```

Values in @t('Temperature_hour_raw') < 0 and ≥ 12 are evaluate to true (1), other values and NaN are evaluated to false (0). Here values on the lower limit 0 are evaluated to false and values on the upper limit 12 are evaluated to true.
