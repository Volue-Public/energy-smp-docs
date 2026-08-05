# GetTsHistoricalVersions

## About the function

Returns an array of time series versions of a time series for the requested time period. The number of versions returned can be limited to a given number.

## Syntax

- GetTsHistoricalVersions(t,d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | d | Desired number of historical versions of a time series. |

Note! If you ask for more versions than there exists, the system returns only
the versions which exist. That is, potentially fewer than the number given as
input to the function.

## Examples

GetTsHistoricalVersions(ts,1) returns the last change made, i.e. the latest
historical version that is different from the current time series.
Observe that the function also in this case returns an array of series that in this case contains one series.

GetTsHistoricalVersions(ts,3) returns the three last changes. The first series
displays the state before the last change, the second displays the state before
the second last change, etc.

Consider using the function [GetTsAsOfTime](./get_ts_as_of_time.md) instead of using this function to get an array of time series versions and then retrieve one of them by using the function [AT](./at.md).
