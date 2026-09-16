# AT

Retrieves an element from an object. Relevant object types are array of time
series, numbers or time series.

## Syntax

- AT(T,d)
- AT(D,d)
- AT(t,s)
- AT(t,d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | T | Array of time series. |
| 2 | d | Lookup index, the first value has index 0. |

Returns a time series found at given index. If index is out of range, an empty breakpoint series is returned.
Be aware that the array of time series attached to a time series collection attribute is not stable and cannot be 
used as first argument to this function. 

| # | Type | Description |
|---|---|---|
| 1 | D | Array of floating-point numbers. |
| 2 | d | Lookup index, the first value has index 0. |

Returns the number found at given index. If index is out of range, then the returned value is NaN.

```
DArray = {10,11,12,13,14}
Res1 = @AT(DArray,0)
Res2 = @AT(DArray,2)
[...]
```

Result: Res1=10 and Res2=12, that is 0-based index lookup.

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | s | Time argument. May be a [macro](../timepoint-macros.md) expanded to time point. Examples: DAY+10h, UTC20141124 |

Returns a value found on the time series at given time point. If time argument is not valid, then the returned value is NaN.

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | d | Lookup index, the first value has index 0. |

Returns a single value from the time series, based on the lookup index in argument 2.

Lookup with index `0` may return a value located **before** the requested interval start.
Example: for a breakpoint time series where the value does not exist on the requested interval start,
but there's a point further in the past, a lookup with index `0` will return that point.

Looking up an index outside `[0, n-1]`, where `n` is the number of points in the requested interval, generally returns NaN.
There are exception to this rule though:

1. For physical linear time series, a lookup with index `n` may return a value located **at or after**
   the interval end of the requested interval instead of NaN.
   Example: physical linear time series are expanded with one point after the requested interval to
   provide functional value for every moment of the interval. A lookup with index `n` will return that point.

2. Extending the requested interval with `@PushExtPeriod`
   may result in extending the valid index range.
   Example: assume `TsAttribute` holds a physical hourly staircase time series.
   Requested interval: `[2020-01-01 00:00Z; 2020-01-01 03:00Z)`.

   ```
    @PushExtPeriod('ExtendedPeriod', '0h', '1h')
    ts = @t('.TsAttribute')
    val = @AT(ts, 3)
    [...]
   ```

   Before extending the interval, valid indices are: 0, 1, 2.
   After extending the interval, index 3 becomes valid too.
   `val` should be equal to the value of `TsAttribute` at `2020-01-01 03:00Z`.

Negative indexing is not supported.

Fractional indices are truncated toward zero (e.g. 0.5 -> 0).



