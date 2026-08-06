# Time point information

This is a family of functions to get information from time points. The standard
calendar is used, i.e. UTC+1 with no DST for normal Nordic setup.

## Syntax
- Minute(d)
- Hour(d)
- Day(d)
- Week(d)
- WeekDay(d)
- Month(d)
- Year(d)
- YearDay(d)

## Description

| Type | Description |
|---|---|
| d | A time point represented as a number. |

The result from functions are:

- Minute within hour (0 – 59)
- Hour within day (0 – 23)
- Day within month (1-31)
- Month within year (1-12)
- Year
- DayInWeek, 1 for Monday, 7 for Sunday
- YearDay, day number within year (1-366)
