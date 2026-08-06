# Time

Interprets a time specification given as a symbol (a character string) and
returns a time point. The time point is defined as a number. The number is ticks
as defined in Microsoft .Net.

## Syntax
- Time(s)
- Time(s,d)


## Description


| # | Type | Description |
|---|---|---|
| 1 | s | Time specification. Accepted values: <ul><li>Start of the requested period/StartOfPeriod: SOP</li><li>End of the requested period/EndOfPeriod: EOP</li><li>Specific time: 20120326000000000</li></li>Time macro: YEAR+1d, +1h , UTC20150222 . </li></ul> |
| 2 | d | A reference time used when parsing the first argument, if this is appropriate. Typically used if the first argument is not fully specified like the third definition example above. |



The function returns a time point that can be used to calculate another time
point combined with the result of the [TimeSpan](../functions/timespan.md) function. It can
also be used as argument to functions accepting a time point as number.

You can convert a time point back to a time specification string by using the
[TimeToString](../functions/time_to_string.md) function.

## Example using both Time and TimeSpan functions

``` 
TimeWindow = @TimeSpan('HOUR') * @d('GlidingInterval')
@PushExtPeriod('X', @Time('SOP')-TimeWindow, @Time('EOP')+ TimeWindow)
Source = @t('Waterlevel_hour_ManualCorrection')
@PopExtPeriod('X')
## = @TS_GLIDING_MEDIAN_GAUSS(Source,@d('GlidingInterval'))
```