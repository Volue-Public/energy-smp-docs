# Resolution

## About the function

Get the resolution of a time series as a text symbol.

## Syntax

- Resolution (t)

## Description

| Type | Description |
|---|---|
| t |  The time series to get resolution from |

Returns a text symbol like 'HOUR'. 'DAY' etc.
Valid resolutions text symbols are:

- VARINT - breakpoint resolution
- MIN15, MIN30, HOUR, DAY, WEEK, MONTH, YEAR - fixed interval series
- 
## Example

`Res = @Resolution(@t('.Ts1'))`

In case Ts1 has hourly resolution the value of Res is 'HOUR'.

