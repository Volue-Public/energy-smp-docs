# ToString

This function translates a number to a string. It will not round the value, only
truncate it. Optional argument describes number of decimals to include in the
string.

## Syntax

- ToString(d[,d])

## Description

| # | Type | Description |
|---|---|---|
| 1 | d | Numerical value that should be made into a string. |
| 2 | d | Number of decimal places to include in the string representation. Default is 0. |

## Examples

Double attribute named 'Factor' has a numerical value 2.756.

`@ToString(@d('.Factor'))`  returns "2"

`@ToString(@d('.Factor'),1)` returns "2.7"

`@ToString(@d('.Factor'),2)` returns "2.75"
