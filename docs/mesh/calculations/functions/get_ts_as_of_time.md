## GetTsAsOfTime

### About the function

Used to retrieve a time series as it was at a given historical time.

Returns a time series or an array of time series, depending on the value of
parameter number two.

Note! If the historical time is earlier than the first write to the series (in
the relevant period) then the function returns NaN values.

### Syntax

- GetTsAsOfTime(t,s[,s])
- GetTsAsOfTime(t,d[,s])
- GetTsAsOfTime(t,S[,s]) - returns an array of time series
- GetTsAsOfTime(t,D[,s]) - returns an array of time series

### Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | s, d, S or D | s: Time as symbol. d: Time as number (number of ticks). S: List of time points (symbol). D: List of time points (ticks). |
| 3 | s | Optional. Possible values: 'Delta', ‘DeltaNaNIsNaN’, 'ExactTime'. For Delta codes the function returns the difference between the current time series values and historical time series values. For DeltaNaNIsNaN the delta value is NaN (Not a number / empty) when one of the values is empty. The code ExactTime returns only those values that were written at the specified time, normally used together with GetTsAuditTimes. |

Time point as a symbol is using the format as described [here](../timepoint-macros.md).

A tick is 100 nanoseconds, i.e. there are 10,000 ticks in a millisecond. Reference value is UTC `January 1, 0001 00:00:00`.

### Examples

Example time series have these historical values at given times:

| Time of writing | Time series version | Value time tx | Value time tx+1 | Value time tx+2 | Value time tx+3 |
|---|---|---|---|---|---|
| December 12th 2012 00:00:00 | Ts_0 | 1 | 7 | 8 | 10 |
| November 12th 2012 00:00:00 | Ts_1 | 2 | 5 | 3 | 2 |
| October 12th 2012 00:00:00 | Ts_2 | 1 | 3 | 7 |   |
| September 12th 2012 00:00:00 | Ts_3 | 1 | 3 | 8 |   |

Example 1: GetTsAsOfTime(t,s)

`Res = GetTsAsOfTime(t0,'20121201000000000')`

Returns time series Ts_1 which was valid December 1st 2012.

Example 2: GetTsAsOfTime(t,s,s)

`Res = GetTsAsOfTime(t0,'20121201000000000','Delta')`

Returns the difference between the values in Ts_0 and Ts_1: -1 2 5 8

Example 3: GetTsAsOfTime(t,S)

`Res = GetTsAsOfTime(t0,{'20121201000000000','20121101000000000','20121001000000000'})`

Returns an array of time series for the given times.

Example 4: GetTsAsOfTime(t,S,s)

`Res = GetTsAsOfTime(t0,{'20121201000000000','20121101000000000','20121001000000000'},'DELTA')`

Returns an array of the difference between the current time series and the time
series at the given times.

#### Example using GetTsAuditTimes

The example data used is described [here](./history.md#hourly-example-data).

There is a function that can retrieve the time points when there were changes to the values
within requested time period. See [GetTsAuditTimes](./get_ts_audit_times.md).

The function [AT](./at.md) is used to retrieve a member of an array by index. Index 0 is first.

`## = @GetTsAsOfTime( @t('.Temperature_forecast'), @AT( @GetTsAuditTimes( @t('.Temperature_forecast'),6),0))`

This example will return the current values for the defined time series. Because we ask for the time series
as it was on a time point associated with *last* time of write (index 0) the last changes are included.

In the next example expression a third argument `ExactTime` is added to `GetTsAsOfTime` function. Then the 
function will retrieve those values written at the given time, else nan value.

`## = @GetTsAsOfTime(@t('.Temperature_forecast'),@AT(@GetTsAuditTimes(@t('.Temperature_forecast'),6),0),'ExactTime')`

| Time (UTC) | Current | Last written values |
|---|---|---|
| 2025-11-05T23:00:00Z |       1.00 | nan        |
| 2025-11-06T00:00:00Z |       1.00 | nan        |
| 2025-11-06T01:00:00Z |       1.00 | nan        |
| 2025-11-06T02:00:00Z |       1.00 | nan        |
| 2025-11-06T03:00:00Z |       2.00 | nan        |
| 2025-11-06T04:00:00Z |       2.00 | nan        |
| 2025-11-06T05:00:00Z |       2.00 | nan        |
| 2025-11-06T06:00:00Z |       2.00 | nan        |
| 2025-11-06T07:00:00Z |       3.00 | nan        |
| 2025-11-06T08:00:00Z |       3.00 | nan        |
| 2025-11-06T09:00:00Z |       3.00 | nan        |
| 2025-11-06T10:00:00Z |       3.00 | nan        |
| 2025-11-06T11:00:00Z |       4.00 | nan        |
| 2025-11-06T12:00:00Z |       4.00 | nan        |
| 2025-11-06T13:00:00Z |       4.00 | nan        |
| 2025-11-06T14:00:00Z |       4.00 | nan        |
| 2025-11-06T15:00:00Z |       4.00 | nan        |
| 2025-11-06T16:00:00Z |       4.10 |       4.10 |
| 2025-11-06T17:00:00Z |       4.10 |       4.10 |
| 2025-11-06T18:00:00Z |       4.10 |       4.10 |
| 2025-11-06T19:00:00Z |       4.10 |       4.10 |
| 2025-11-06T20:00:00Z |       4.10 |       4.10 |
| 2025-11-06T21:00:00Z |       4.10 |       4.10 |
| 2025-11-06T22:00:00Z |       4.10 |       4.10 |
| 2025-11-06T23:00:00Z |       4.10 |       4.10 |
| 2025-11-07T00:00:00Z |       4.00 | nan        |
| 2025-11-07T01:00:00Z |       4.00 | nan        |

**_Note!_** The `nan` value indicates that the last write did not contain a value for that time point.

In the next example, the method used is `Delta` and the time point is set to an earlier time of write.

`## = @GetTsAsOfTime(@t('.Temperature_forecast'),@AT(@GetTsAuditTimes(@t('.Temperature_forecast'),6),2),'Delta')`

| Time (UTC) | Current | Result |
|---|---|---|
| 2025-11-05T23:00:00Z |       1.00 |       0.00 |
| 2025-11-06T00:00:00Z |       1.00 |       0.00 |
| 2025-11-06T01:00:00Z |       1.00 |       0.00 |
| 2025-11-06T02:00:00Z |       1.00 |       0.00 |
| 2025-11-06T03:00:00Z |       2.00 |       0.00 |
| 2025-11-06T04:00:00Z |       2.00 |       0.00 |
| 2025-11-06T05:00:00Z |       2.00 |       0.00 |
| 2025-11-06T06:00:00Z |       2.00 |       0.00 |
| 2025-11-06T07:00:00Z |       3.00 |       0.00 |
| 2025-11-06T08:00:00Z |       3.00 |       0.00 |
| 2025-11-06T09:00:00Z |       3.00 |       0.00 |
| 2025-11-06T10:00:00Z |       3.00 |       0.00 |
| 2025-11-06T11:00:00Z |       4.00 |       1.00 |
| 2025-11-06T12:00:00Z |       4.00 |       1.00 |
| 2025-11-06T13:00:00Z |       4.00 |       1.00 |
| 2025-11-06T14:00:00Z |       4.00 |       1.00 |
| 2025-11-06T15:00:00Z |       4.00 |       1.00 |
| 2025-11-06T16:00:00Z |       4.10 |       1.10 |
| 2025-11-06T17:00:00Z |       4.10 |       1.10 |
| 2025-11-06T18:00:00Z |       4.10 |       1.10 |
| 2025-11-06T19:00:00Z |       4.10 |       1.10 |
| 2025-11-06T20:00:00Z |       4.10 |       1.10 |
| 2025-11-06T21:00:00Z |       4.10 |       1.10 |
| 2025-11-06T22:00:00Z |       4.10 |       1.10 |
| 2025-11-06T23:00:00Z |       4.10 |       1.10 |
| 2025-11-07T00:00:00Z |       4.00 |       1.00 |
| 2025-11-07T01:00:00Z |       4.00 |       1.00 |

The time point (index 2 in array returned from audit times) is associated
with writing the value 4 on the series from `2025-11-06T11:00:00Z` and onwards.

