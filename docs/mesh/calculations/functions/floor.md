# FLOOR

Converts the number in a time series to an integer by cutting all decimals.

The result series has the same resolution as the time series/argument series.

The function can also be applied to a single number.


## Syntax
- FLOOR(t)
- FLOOR(d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series |
| 1 | d | Number |

## Example
`Temperature corrected = @FLOOR(@t('.Temperature_raw'))`

![](assets/images/floor_mesh.png)
