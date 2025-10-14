## MAX

### About the functions

Finds the highest values in time series, numbers, arrays or combinations of
these.

There are many variants of this function, some returns a single number as result
but most of them returns a time series.

The result series has the same resolution as the input time series. This also applies to cases where there are multiple time series involved and they all have the same resolution. If there are series with different resolutions, the result is a breakpoint series.

### Syntax

- MAX(T)
- MAX(D) -> returns a number
- MAX(t) -> returns a number
- MAX(t,t)
- MAX(T,t)
- MAX(t,T)
- MAX(t,d)
- MAX(d,d) -> returns a number
- MAX(T,T)

| # | Type | Description |
|---|---|---|
| 1 | t T d D | Time series, array of time series, number or array of numbers. |
| 2 | t d T | Optional. Time series, number or array of time series. |

## Examples

In general, when there are two arguments and at least one of them are an array of time series, like (t,T), (T,t) and (T,T) then the function behaves like having one array. The function concatenate the time series arguments into one array
before doing the operation.


### Example 1: @MAX(t)

ResTs = @MAX(@t('.Ts')

Returns the highest value of the time series for the requested period. See
similar example for the [@MIN(t) function](../functions/min.md).

### Example 2: @MAX(t,t)

ResTs = @MAX(@t('Ts1'),@t('Ts2'))

Returns the highest value of time series 1 and 2 for every time step.

See similar example for the [@MIN(t,t) function](../functions/min.md).

### Example 3: @MAX(d,d)

Res = @MAX(8,2.5)

Res = 8

Returns the largest of the two values.

### Example 4: @MAX(D)

Res = @MAX({1,5,8,2.5,11})

Res = 11

Returns the largest value of the array of numbers.

### Example 5: @MAX(T)

ResTs = @MAX({@t('Ts1'),@t('Ts2'),@t('Ts3')})

{@t('Ts1'),@t('Ts2'),@t('Ts3')} is an array of time series.

Returns the largest value of all the time series of the array for every time
step. The resolution is breakpoint in case there are different resolutions involved in the input series.
