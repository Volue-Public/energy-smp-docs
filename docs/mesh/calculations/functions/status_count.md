## STATUS_COUNT
### About this function
The STATUS_COUNT function takes one or more time series and returns a count of
the number of points which match a given criterion ([status](../functions/status.md)).
E.g. it can be used to count the number of 'missing' or 'notok' values. If one
time series is provided, STATUS_COUNT will return a number. If more than one
time series is provided, STATUS_COUNT will count the number of values for each
point in time and make a time series out of those.

  The time series must have the same resolution.

#### Example 1
`NumberOfMissingOrManualPoints = @STATUS_COUNT(@t('.Temperature_hour_raw'), 'missing|MANUAL')`

Which will return the number of points in `Temperature_hour_raw` that are
flagged as missing or manual.

#### Example 2
`NotOkPoints = @STATUS_COUNT({@t('.Timeseries1'), @t('.Timeseries2'), @t('.Timeseries3')}, 'notok')`

This will return a time series where each time series point is the number of
points in Timeseries1/2/3 which are flagged as not OK at that time.

### Syntax
- STATUS_COUNT(T,s)
- STATUS_COUNT(t,s)


The second argument uses the same syntax as the logical argument in
[STATUS_MASK](../functions/status_mask.md).

## Description


| # | Type | ## Description |
|---|---|---|
| 1 | T | Array of time series. |
| 2 | s | Symbol. |




| # | Type | ## Description |
|---|---|---|
| 1 | t | Reference to a time series. |
| 2 | s | Symbol. |
