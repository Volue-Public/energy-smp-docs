# TS_GLIDING_MEDIAN
## About the function
Returns a smoothed time series based on calculations of medians.

## Syntax
- @TS_GLIDING_MEDIAN(t,d)

| # | Type | Description |
|---|---|---|
| 1 | t | Time series of numerical values. |
| 2 | d | Numerical value. Indicates how many surrounding values that are used to produce the average value. d must be an uneven number. |

## Example
`Waterlevel_hour_operative = @TS_GLIDING_MEDIAN (@t('Waterlevel_hour_raw'),3)`

With d = 3, the median is calculated with the previous value, current value and
next value.

For the result time series the median is 19 at 06:00, as the median of the
sequence (8, 20, 19) is 19. Using a higher `d` number the result will get
smoother.

![](assets/images/ex_TS_GLIDING_MEDIAN-nimbustable.png)
