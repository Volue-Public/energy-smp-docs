## AT

### About the function

Retrieves an element from an object. Relevant object types are array of time
series, numbers or time series.

### Syntax

- AT(T,d)
- AT(D,d)
- AT(t,s)

### Description

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

Returns the number found at given index. If index is out of range, then the returned value is NaN

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | s | Time argument. May be a macro expanded to time point. <br>Examples: DAY+10h, UTC20141124 |

Returns a value found on the time series at given time point. If time argument is not valid, then the returned value is NaN.

## Example

DArray = {10,11,12,13,14}

Res1 = @AT(DArray,0)

Res2 = @AT(DArray,2)

Result: Res1=10 and Res2=12, that is 0-based index lookup.
