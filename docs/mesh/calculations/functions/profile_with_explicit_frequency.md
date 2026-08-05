# PROFILE with explicit frequency
This topic describes a PROFILE variant ([R13](#r13)) for transforming from one
time resolution to another.

To get an overview of all the variants of the function, see:

[Which functions can be used when?](../functions/transform_what_when.md)

## R13
### About the function
This is a function that calculates a time series by doing repeating an input
series segment to cover requested time period. Values found on input series are
moved into requested calculation period on a calendar based manner, i.e. values
from a Tuesday in a weekly repetition are found on Tuesdays in requested time
frame.

The input series must have finer resolution than the repetition frequency
indicates.

This function is closely related to [R12](../functions/profile.md#r12), which only takes
one argument; the input time series. In this case the function derives a
repetition frequency from physical value period found on source series.

### Syntax
- PROFILE(t,s)

### Description

| # | Type | Definition |
|---|---|---|
| 1 | t | Time series. |
| 2 | s | Repeat frequency. |

Result time series = @PROFILE(@t('TSPH'),’DAY’)

The input time series for this function contains the values used as basis for
repeat to create the result series. The result will have the same resolution as
this series.

The repetition frequency is an argument, a time unit symbol like 'HOUR', 'DAY',
'WEEK' and 'YEAR'. It defines how often values from input series are repeated.

The values are picked from a trimmed start point relative to physical start of
input series. If frequency indicates a span that is narrower than time span on
input series, then values from first segment are repeated into requested time
span.

### Example
Some examples are cited below:

Result1 = @PROFILE(@t(‘TsInputBrP’),'WEEK')

Result2 = @PROFILE(@t(‘TsInput2’),'DAY')

Result3 = @PROFILE(@t(‘TsInput3’),'YEAR')

In example 1 the input series could be a breakpoint series with values located
in first week of 2007 (which happens to start at 1.of January). A calculation
request for week 7 to week 10 in 2007 will repeat source values three times.

In example 2 the input series could be an hour resolution series that have
values located in first week of 2007. A calculation request for period
20-02-2007 12:00 to 23-02-2007 00:00 will get values found on source series for
01-01-2007, and repeat these 2.5 times; and starts with last half of this day.

In example 3 the input series could be a day resolution series that have values
that cover the year 2007. A calculation request for period 19-02-2004 to
22-02-2004 will get three values from source series starting with value from
19-02-2007.

This generates a pseudorandom number.
