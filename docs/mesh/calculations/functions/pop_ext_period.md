# PopExtPeriod
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


This function removes the extended calculation period created by PushExtPeriod.
The function must always be used after [PushExtPeriod](../functions/push_ext_period.md).

## Syntax
- PopExtPeriod(s)


## Description


| Type | Description |
|---|---|
| s | Logic name of the period. It is the same as used in the corresponding PushExtPeriod. |



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
