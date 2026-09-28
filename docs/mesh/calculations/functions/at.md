# AT

Retrieves an element from an object. Relevant object types are array of time
series, numbers or time series.

## Syntax

- AT(T,d)
- AT(D,d)
- AT(t,s)
- AT(t,d)

## AT(T,d)

### Description

| # | Type | Description |
|---|---|---|
| 1 | T | Array of time series. |
| 2 | d | Lookup index, the first value has index 0. |

Returns a time series found at given index. If index is out of range, an empty breakpoint series is returned.
Be aware that the array of time series attached to a time series collection attribute is not stable and cannot be 
used as first argument to this function. 

Negative indices are treated as out of range.
Exception: index values such as `-1 < index < 0` return the value associated with index 0.

Fractional indices are truncated (e.g. 0.8 -> 0).

The function returns empty breakpoint time series if the index value is `NaN` or `Inf`.

## AT(D,d)

### Description

| # | Type | Description |
|---|---|---|
| 1 | D | Array of floating-point numbers. |
| 2 | d | Lookup index, the first value has index 0. |

Returns the number found at given index. If index is out of range, then the returned value is NaN.

Negative indices are treated as out of range.
Exception: index values such as `-1 < index < 0` return the value associated with index 0.

Fractional indices are truncated (e.g. 0.8 -> 0).

The function returns `NaN` if the index value is `NaN` or `Inf`.

### Example

DArray = {10,11,12,13,14}

Res1 = @AT(DArray,0)

Res2 = @AT(DArray,2)

Result: Res1=10 and Res2=12, that is 0-based index lookup.

## AT(t,s)

### Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | s | Time argument. May be a [macro](../timepoint-macros.md) expanded to time point. Examples: DAY+10h, UTC20141124 |

Returns a value found on the time series at given time point. If time argument is not valid, then the returned value is NaN.

## AT(t,d)

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | d | Lookup index, the first value has index 0. |

### Description

Returns a single value from the time series, based on the lookup index in argument 2.

Looking up an index outside `[0, n-1]`, where `n` is the number of points in the requested interval, generally returns NaN.

The supplied time series might contain points outside of the requested interval to provide functional value for every moment of the interval. In consequence, `AT(t,d)` does not guarantee that the returned value belongs to a point within the requested interval.

Lookup with index `0` may return a value located **before** the requested interval start.
For a breakpoint time series where the value does not exist on the requested interval start,
but there's a point further in the past, a lookup with index `0` returns that point, and subsequent indices are shifted by one.

Lookup with index `n` may return a value located **at or after** the interval end of the requested interval instead of NaN. Physical linear time series are expanded with one point after the requested interval to provide functional value for every moment of the interval. A lookup with index `n` returns that point.

Extending the requested interval with `@PushExtPeriod`
may result in extending the valid index range.
See [Using extended periods](push_ext_period.md#using-extended-periods).

Negative indices are treated as out of range.
Exception: index values such as `-1 < index < 0` return the value associated with index 0.

Fractional indices are truncated (e.g. 0.8 -> 0).

The function returns `NaN` if the index value is `NaN` or `Inf`.

### Example

Assume `TsAttribute` holds a physical hourly staircase time series.
Requested interval: `[2020-01-01 00:00Z; 2020-01-01 03:00Z)`.

```
 @PushExtPeriod('ExtendedPeriod', '+0h', '+1h')
 ts = @t('.TsAttribute')
 val = @AT(ts, 3)
 [...]
 @PopExtPeriod('ExtendedPeriod')
```

Before extending the interval, valid indices are: 0, 1, 2.
After extending the interval, index 3 becomes valid too.
`val` should be equal to the value of `TsAttribute` at `2020-01-01 03:00Z`.
