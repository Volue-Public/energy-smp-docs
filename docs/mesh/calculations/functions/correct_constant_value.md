# CorrectConstantValue

Corrects errors on a previously validated time series with a specified constant
value. Values with correction using constant value are set to corrected and
marked with **C01**, meaning correction method 1. You can see this code if you
turn on value information in Nimbus.

## Syntax

- CorrectConstantValue(t,d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be corrected. |
| 2 | d | Constant value to use when correcting. |

## Example

`Waterlevel_hour_VEE = @CorrectConstantValue(@ValidateAbsLimit(@t('Waterlevel_hour_raw'),207,210),208)`

This example validates the time series using absolute limits. Any errors found
are replaced by 208.
