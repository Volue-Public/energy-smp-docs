# CEIL

This function rounds off values in a time series up to the nearest whole number.

The result series has the same resolution as the time series/argument series.

The function can also be applied to a single number.

## Syntax
- CEIL(t)
- CEIL(d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series |
| 1 | d | Number |

## Example
`Temperature corrected = @CEIL(@t('.Temperature_raw'))`

![](assets/images/ceil_mesh.png)
