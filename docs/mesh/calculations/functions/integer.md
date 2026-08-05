# INTEGER
## About the function
Converts a number in a time series to an integer by cutting all decimals.

The result series has the same resolution as the time series/argument series.

The function can also be applied to a single number.


## Syntax
- INTEGER(t)
- INTEGER(d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series |
| 1 | d | Number |

## Example
`Temperature corrected = @INTEGER(@t('.Temperature_raw'))`

The values in the result time series are converted to integers.

![](assets/images/integer_mesh.png)
