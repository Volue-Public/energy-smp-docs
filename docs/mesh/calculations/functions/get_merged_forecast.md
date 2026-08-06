# GetMergedForecast

## About the function

Returns a time series based on a specified segment for available forecast versions.

![](assets/images/Get%20MergedForecast.png)

The returned series contains the red segments, in this example based on 
a value segment [+6h->+12h] from each forecast.

## Syntax

- GetMergedForecast(t,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series |
| 2 | s | Segment specification, see below |

A segment is defined by an offset and duration specification, for 
example '1d:1d' means offset is one day and length of segment is also one day.
To analyse the quality of the the third day in a forecast you can use a segment
specification '2d:1d`.


## Example

Uses the example data described [here](./history.md#hourly-example-data).

`## = @GetMergedForecast(@t('.Temperature_forecast'),'8h:4h')`

| Time (UTC) | Current | Result |
|---|---|---|
| 2025-11-06T03:00:00Z |       2.00 | nan        |
| 2025-11-06T04:00:00Z |       2.00 | nan        |
| 2025-11-06T05:00:00Z |       2.00 | nan        |
| 2025-11-06T06:00:00Z |       2.00 | nan        |
| 2025-11-06T07:00:00Z |       3.00 |       1.00 |
| 2025-11-06T08:00:00Z |       3.00 |       1.00 |
| 2025-11-06T09:00:00Z |       3.00 |       1.00 |
| 2025-11-06T10:00:00Z |       3.00 |       1.00 |
| 2025-11-06T11:00:00Z |       4.00 |       2.00 |
| 2025-11-06T12:00:00Z |       4.00 |       2.00 |
| 2025-11-06T13:00:00Z |       4.00 |       2.00 |
| 2025-11-06T14:00:00Z |       4.00 |       2.00 |
| 2025-11-06T15:00:00Z |       4.00 |       3.00 |
| 2025-11-06T16:00:00Z |       4.10 |       3.00 |
| 2025-11-06T17:00:00Z |       4.10 |       3.00 |
| 2025-11-06T18:00:00Z |       4.10 |       3.00 |
| 2025-11-06T19:00:00Z |       4.10 |       4.10 |
| 2025-11-06T20:00:00Z |       4.10 |       4.10 |
| 2025-11-06T21:00:00Z |       4.10 |       4.10 |
| 2025-11-06T22:00:00Z |       4.10 |       4.10 |
| 2025-11-06T23:00:00Z |       4.10 | nan        |
| 2025-11-07T00:00:00Z |       4.00 | nan        |
| 2025-11-07T01:00:00Z |       4.00 | nan        |
