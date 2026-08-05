# CorrectInterpolate
## About the function

Corrects errors on a previously validated time series using interpolation.
Values with correction using interpolation are set to corrected and marked with
**C03**, meaning correction method 3. You can see this code if you turn on value
information in Nimbus.

## Syntax

- CorrectInterpolate(t,d,s)


## Description


| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be corrected. |
| 2 | d | Value describing maximum number of errors between first and last interpolated value (including the first and last value). |
| 3 | s | Symbol describing whether or not corrected values can be used when interpolating. This is specified as either 'TRUE' or 'FALSE'. |



## Example
`Waterlevel_hour_VEE = @CorrectInterpolate(@ValidateAbsLimit(@t('Waterlevel_hour_raw'),207,210),3,'FALSE')`

This example validates the time series using absolute limits. Any errors found
are replaced by an interpolated value.

Maximum number of values between first and last interpolated value cannot be
more than 3 and corrected values cannot be used.
