﻿## NEGATIVE
## About the function
Picks the negative values from a time series. Zero is considered to be a
positive number.

## Syntax
- NEGATIVE(t[,d[,s]])

| # | Type | Description |
|---|---|---|
| 1 | t | Input time series. Picks the negative values from the time series. 0 (zero) is by default considered as a positive number. |
| 2 | d | Optional. Numerical value. Defines if 0 (zero) is considered as a positive or negative number. If 1 is set in argument 2, 0 is considered as a negative number. Use of other numbers in argument 2, or if argument 2 is omitted, it means 0 (zero) is considered as a positive number. |
| 3 | s | Optional. VALUE – Default behavior. Gives the result of the function as a normal time series. If argument 3 is omitted, this is the default behavior. BOOL - Converts the result into a logical time series (values 1 and 0). BOOL_COMPRESS – Converts the result into a logical time series (values 1 and 0) with compressing of equal numbers. The resolution is a breakpoint time series. |

## Example
@NEGATIVE(t)

From the table, we can see that only negative numbers are returned. Positive
numbers and NaN return empty rows.

![](Images/ex_NEGATIVE-nimbustable.png)
