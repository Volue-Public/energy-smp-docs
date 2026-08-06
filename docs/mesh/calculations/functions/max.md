# MAX

Finds the highest values in time series, numbers, arrays or combinations of
these.

There are many variants of this function, some returns a single number as result
but most of them returns a time series.

The result series has the same resolution as the input time series. This also applies to cases where there are multiple time series involved and they all have the same resolution. If there are series with different resolutions, the result is a breakpoint series.

## Syntax

- MAX(T)
- MAX(D) -> returns a number
- MAX(t) -> returns a number
- MAX(t,t)
- MAX(T,t)
- MAX(t,T)
- MAX(t,d)
- MAX(d,d) -> returns a number
- MAX(T,T)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t T d D | Time series, array of time series, number or array of numbers. |
| 2 | t d T | Optional. Time series, number or array of time series. |

There are similar functions to find lowest values, see [function MIN](min.md)

## Examples

In general, when there are two arguments and at least one of them are an array of time series, like (t,T), (T,t) and (T,T) then the function behaves like having one array. The function concatenate the time series arguments into one array
before doing the operation.

### Example 1: @MAX(t)

Returns the highest value of the time series for the _requested_ period.

`Result = @TS('VARINT',@MAX( @t('.H_Ts1')))`

| Time | H_Ts1 | Result |
|---|---|---|
| 2021-12-31T22:00:00Z | nan        |   20000.00 |
| 2021-12-31T23:00:00Z |      -1.00 |            |
| 2022-01-01T00:00:00Z |       0.00 |            |
| 2022-01-01T01:00:00Z |      10.00 |            |
| 2022-01-01T02:00:00Z | nan        |            |
| 2022-01-01T03:00:00Z |   20000.00 |            |
| 2022-01-01T04:00:00Z |   12500.00 |            |
| 2022-01-01T05:00:00Z |       1.00 |            |


### Example 2: @MAX(t,t)

Returns the highest value of time series 1 and 2 for every time step.

`Result = @MAX(@t('.H_Ts1'), @t('.H_Ts2'))`

| Time | H_Ts1 | H_Ts2 | Result |
|---|---|---|---|
| 2021-12-31T22:00:00Z | nan        | nan        | nan        |
| 2021-12-31T23:00:00Z |      -1.00 |   13669.00 |   13669.00 |
| 2022-01-01T00:00:00Z |       0.00 |   13611.00 |   13611.00 |
| 2022-01-01T01:00:00Z |      10.00 |   13739.00 |   13739.00 |
| 2022-01-01T02:00:00Z | nan        |   12694.00 |   12694.00 |
| 2022-01-01T03:00:00Z |   20000.00 |   12407.00 |   20000.00 |
| 2022-01-01T04:00:00Z |   12500.00 |   12500.00 |   12500.00 |
| 2022-01-01T05:00:00Z |       1.00 |       2.00 |       2.00 |

### Example 3: @MAX(d,d)

Returns the largest of the two values.

`Result = @MAX(8,2.5)`

Result = 8

### Example 4: @MAX(D)

Returns the largest value of the array of numbers.

`Result = @MAX({1, 5, 8, 2.5, 11})`

Result = 11

### Example 5: @MAX(T)

Returns the largest value of all the time series of the array for every time
step. The resolution is breakpoint in case there are different resolutions involved in the input series.

`Result = @MAX({@t('.H_Ts1'),@t('.H_Ts2'),@t('.H_Ts3')})`

{@t('.H_Ts1'),@t('.H_Ts2'),@t('.H_Ts3')} is an array of time series.

A more common usage is to provide an argument that collects the series, for
example like this.

`Result = @MAX(@T('has_MetStations.Temperature'))`
