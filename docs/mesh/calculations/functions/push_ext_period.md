# PushExtPeriod
## Using extended periods

Some calculations need an extended period to produce correct and consistent
results. For example, calculating a delta series needs the previous value;
calculating accumulated series from the start of the year needs all values from
this point, even if the requested period is September that year. In
[Mesh](../functions/introduction.md) calculations, the functions that
inherently need extended periods, are handled implicitly when creating the
calculation expressions.

Still, there may be situations where you explicitly want to define extended
periods. To do this you can use the [PushExtPeriod](../functions/push_ext_period.md) and
[PopExtPeriod](../functions/pop_ext_period.md) functions to ensure correct behavior.

The ground rules for applying the Push/Pop mechanism are:

- The expression uses data outside the requested period to produce correct results.
- The time series that need to be extended has no direct database connection, i.e. it cannot be extended by reading more data from the database.

## About the function
The current period may effect calculations and the purpose of the function is to
control this in order to achieve the correct result.

PushExtPeriod must always be accompanied by [PopExtPeriod](../functions/pop_ext_period.md)
after completing the part of the calculation which requires a specific period.

The function returns the number of seconds the period is extended by. The return
value is normally not used, as the main purpose of the function is the side
effect: Change the actual calculation period directly. Need for extended periods
in calculations are handled implicitly when using Mesh as a foundation.

## Syntax
- PushExtPeriod(s,s,s)
- PushExtPeriod(s,d,d)


## Description


| # | Type | Description |
|---|---|---|
| 1 | s | Logic name of the period. |
| 2 | s or d | Start time (from and including). May be a time macro, including a relative specification, e.g. -1d which extends the period with one day before the calculation period, or a time point as a number. |
| 3 | s or d | End time (to and including). May be a time macro, including a relative specification, e.g. +1d which extends the period with one day after the calculation period, or a time point as a number. |

The function establishes a time period based on start time and end time. The
timestamp is defined as symbol/text or number produced by a Time function.
Argument 2 and 3 must be of the same type and not a mix of a time macro and a
number.

**Note!** For the symbol version, the rules of the TIME-function apply with one
exception: The reference for the time macro is the current calculation period
and not the current time as in Time. If the start time is invalid the report
start time is used. The same logic applies for the end time.

The new period is the active calculation period and is used until calling the
function PopExtPeriod. The system then continues using the calculation period
that was active before calling PushExtPeriod.

If the given period is invalid, the current calculation period is used. This is
done because a PopExtPeriod call is expected later in the expression.

***Note!*** The first argument name can be associated with a positional column
time series name in a Time series report. Such names are 'A', 'B', 'C' --> 'AA',
'AB' etc. Thus, we recommend using a lower case letter in the first argument to
PushExtPeriod and corresponding PopExtPeriod.

## Example

The following two examples illustrate a period extension using both the Push and
Pop functions. In both cases, this is handled implicitly in Mesh by the
[DELTA](../functions/delta.md) and [PERCENTILE](../functions/percentile.md) functions:

``` 
@PushExtPeriod( ‘X’, ‘-1h’, ‘0h’)
Tmp1 = 10 * @t( ‘TimeSeries’ )
@PopExtPeriod(‘X’)
## = @DELTA(Tmp1)
```
Uses relative period extension to get an extra hour at start so that DELTA gets
what it needs to calculate the first value in the requested period.

```
@PushExtPeriod('P','20000101000000000','20100101000000000')
Corrected = @CorrectInterpolate(@ValidateAbsLimit( @RESET_STATUS
(@t('Temperature')),-25,25), 10, 'TRUE')
@PopExtPeriod('P')
## = @PERCENTILE(Corrected, 2000,2010,75)
```

Uses fixed period extension in line with the arguments to the
[PERCENTILE](../functions/percentile.md) function on the last line.
