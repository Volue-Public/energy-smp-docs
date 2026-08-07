# TimeSpan

The function transforms its argument to a time span represented as a number.

## Syntax
- TimeSpan(s)

## Description

| Type | Description |
|---|---|
| s | A definition like MIN15, MIN30, HOUR, DAY, WEEK, MONTH, YEAR |

The function returns a time span that can be used to calculate another time
point combined with the result of the [Time](../functions/time.md) function. The time
span represents 30 days for month and 365 days for year. See examples in the
[Time](../functions/time.md) function and [Time examples](../functions/time_examples.md).
