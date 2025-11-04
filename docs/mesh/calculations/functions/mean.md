## MEAN

### About the function

  Takes the average value of time series, arrays and number series.

  If the input is an array of time series and all the time series have the same resolution,
  the result series will have this resolution. If there are different resolutions involved, 
  the result time series will be a breakpoint series.

### Syntax

- MEAN(t)  -> returns a number
- MEAN(T)
- MEAN(D)  -> returns a number

### Description


| # | TYPE | DESCRIPTION |
|---|---|---|
| 1 | t or T or D | Time series Array of time series Array of numbers |

## Examples

  Example 1: @MEAN(t)

  `TempPercentiles = @MEAN(@t('Temperature_hour_raw'))`

The result values are the average value of the values in
@t('Temperature_hour_raw') for the requested time period, repeated throughout
the entire result series as a break point series.

  ![](Images/ex_MEAN-nimbustable.png)

**Tip!** If you want to calculate the mean value for a period different from the
requested time period, you can use the
[PushExtPeriod](../functions/push_ext_period.md)/[PopExtPeriod](../functions/pop_ext_period.md) function
to explicitly define the input period to the function.

  Example 2: @MEAN(T)

  `Temperature_hour_operative = @MEAN(@T('Temperature_hour'))`

The **Temperature_hour_operative** column gives the average value of all the
time series in the array for every time step.

  For instance at 01:00: (-1,26+3,09+8,87)/3 = 3,57

  ![](Images/ex_MEAN-nimbustable2.png)

  Example 3: @MEAN(D)

  Res = @MEAN(1,5,8,2.5,11)

  Res = 5.5
