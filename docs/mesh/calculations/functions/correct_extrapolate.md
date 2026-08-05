# CorrectExtrapolate
## About the function

Corrects errors on a previously validated time series using extrapolation.
Values with correction using extrapolation are set to corrected with remark C04,
meaning correction method 4. You can see this code if you turn on value
information in Nimbus.

## Syntax

- CorrectExtrapolate(t,d,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be corrected. |
| 2 | d | Value describing maximum number of errors. When the maximum number of errors has been reached, no more correction will be done. |
| 3 | s | Symbol describing if corrected values can be used when extrapolating. This is specified as either 'TRUE' or 'FALSE'. |

## Example
`Waterlevel_hour_VEE = @CorrectExtrapolate(@ValidateAbsLimit(@t('Waterlevel_hour_raw'),207,210),2,'FALSE')`

This example validates the time series using absolute limits. Any errors found
are corrected using extrapolated values. Maximum number of errors cannot exceed
2 and corrected values cannot be used when extrapolating.
