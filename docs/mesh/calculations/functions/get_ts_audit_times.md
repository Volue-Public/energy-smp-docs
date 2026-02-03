## GetTsAuditTimes

### About the function

Returns an array of time points related to change events that have impact on values within the requested time period for the given time series. It is possible to restrict the number of time points returned.

The function is often used together with [GetTsAsOfTime](./get_ts_as_of_time.md) in 'ExactTime' mode to extract explicitly what parts of the series that were changed at these times.

A time point is defined as a number which represents a `tick` value.
Each tick is 100 nanoseconds, i.e. there are 10,000 ticks in a millisecond.
Tick value 0 is refers to UTC `January 1, 0001 00:00:00`.

You can convert the tick value, for instance in a PowerShell like this:

```
get-date 638980320190000000 

November 6, 2025 13:20:19
```

### Syntax

- GetTsAuditTimes(t,d) - returns array of numbers


### Description

| # | Type | ## Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | d | Desired maximum number of audit times for the time series. |

**_Note!_** If the number of change events for the given time series and period is less
than the given number, then a reduced set is returned.

The time points returned represent time of write (UTC) and is sorted, latest first.

## Examples

GetTsAuditTimes (ts,3) returns the time points related to the last 3 changes
that are done within the requested time period for the time series t0.

The following examples use the history layers described [here](./history.md#hourly-example-data).

`timepoints = @GetTsAuditTimes(@t('.Temperature_forecast'))`

The `timepoints` array contains these numbers:

| Time (ticks UTC) | Time as text |
|---|---|
| 638980321600000000 | November 6, 2025 13:22:40 |
| 638980321310000000 | November 6, 2025 13:22:11 |
| 638980320880000000 | November 6, 2025 13:21:28 |
| 638980320580000000 | November 6, 2025 13:20:58 |
| 638980320190000000 | November 6, 2025 13:20:19 |

See [GetTsAsOfTime](./get_ts_as_of_time.md#example-using-gettsaudittimes) for an example on how this function can be used.

