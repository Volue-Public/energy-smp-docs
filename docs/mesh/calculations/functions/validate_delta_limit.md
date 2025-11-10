## ValidateDeltaLimit
**About the function**

Validates time series using delta change limits. Values outside the specified
limits, will be marked as ! (Not OK). Values with control towards delta limit
are set to validated with remark V02, meaning validation method 2. You can see
this code if you turn on value information in Nimbus.

**Syntax**

- ValidateDeltaLimit(t,t,t,d,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to validate. |
| 2 | t | Time series for delta lower limit. |
| 3 | t | Time series for delta upper limit. |
| 4 | d | Value describing maximum number of errors. When maximum number of errors has been reached, subsequent values will not be validated. |
| 5 | s | Symbol describing whether or not limitation time series are to be interpreted as percentage values. This is specified as either 'TRUE' or 'FALSE'. |

**Example**
```
Waterlevel_hour_VEE = @ValidateDeltaLimit(@RESET_STATUS(@t('Waterlevel_hour_raw')),@TS('VARINT',@d('RsvDeltaLimitLower')),@TS('VARINT',@d('RsvDeltaLimitUpper')),
@d('ValidateMaxErrors'), @s('ValuesInPercent'))
```
This example validates the time series using limits described in the time series
@TS('VARINT',@d('RsvDeltaLimitLower')) and
@TS('VARINT',@d('RsvDeltaLimitUpper')). These are time series created from
attribute values on the specific object.

The maximum number of errors, @d('ValidateMaxErrors'), also refers to an
attribute value on the specific object. When the number of errors reaches the
actual value, no more validation are done.

Values are not interpreted as percentage values if the attribute on the specific
object @s('ValuesInPercent') is set to FALSE.

In the screen example, all existing statuses on the input data series are
removed before the function adds its status values. This is done using the
[RESET_STATUS](../functions/reset_status.md) function on the input data series. The
`RsvDeltaLimitLower` attribute is set to -0.05 and `RsvDeltaLimitUpper` is set
to 0.05. The values are not in percent. All values outside exceeding the delta
limits, are marked with **!** (Not OK) and the validation method **V02**.

![](assets/images/ex_ValidateDeltaLimit-nimbustable.png)
