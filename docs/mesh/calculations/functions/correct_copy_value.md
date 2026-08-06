# CorrectCopyValue
## About the function

Corrects errors on a previously validated time series using a copy of the
previous value. Values with correction using copy value are set to corrected and
marked with **C02**, meaning correction method 2. You can see this code if you
turn on value information in Nimbus.

## Syntax

- CorrectCopyValue(t,d,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be corrected. |
| 2 | d | Value describing the maximum number of allowed copies. |
| 3 | s | Symbol describing whether or not corrected values can be used. This is specified as either 'TRUE' or 'FALSE'. |

## Example

`Waterlevel_hour_VEE = @CorrectCopyValue(@ValidateAbsLimit(@t('Waterlevel_hour_raw'),207,210),3,'TRUE')`

This example validates the time series using absolute limits. Any errors found
are replaced by a copy of the previous value. Maximum values that can be copied
are set to 3 and corrected values can be used.
