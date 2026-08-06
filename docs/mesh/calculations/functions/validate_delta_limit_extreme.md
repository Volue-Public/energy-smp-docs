# ValidateDeltaLimitExtreme

ValidateDeltaLimitExtreme is similar to
[ValidateDeltaLimit](../functions/validate_delta_limit.md), but also validates using
extreme limits. Values outside the specified limits, are marked with **!** (Not
OK). Values with control towards delta limit extreme are set to validated with
remark **V03**, meaning validation method 3. You can see this code if you turn
on value information in Nimbus.

## Syntax
- ValidateDeltaLimitExtreme(t,t,t,t,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to validate. |
| 2 | t | Time series for delta lower limit. |
| 3 | t | Time series for delta upper limit. |
| 4 | t | Time series for extreme limit. |
| 5 | s | Symbol describing whether or not values on limitation time series should be interpreted as percentage values. This is specified as either 'TRUE' or 'FALSE'. |

## Example
```
Waterlevel_hour_VEE = @ValidateDeltaLimitExtreme(@RESET_STATUS(@t('Waterlevel_hour_raw')),@TS('VARINT',@d('RsvDeltaLimitLower')),@TS('VARINT',@d('RsvDeltaLimitUpper')),
@t('RsvExtremeLimit'), @s('ValuesInPercent'))
```

This example validates the time series using limits described in the time series
@TS('VARINT',@d('RsvDeltaLimitLower')) and
@TS('VARINT',@d('RsvDeltaLimitUpper')). These are time series created from
attribute values on the specific object.

Extreme limits are described in the @t('RsvExtremeLimit') time series.

Values are not interpreted as percentage values if the attribute on the specific
object @s('ValuesInPercent') is set to FALSE.
