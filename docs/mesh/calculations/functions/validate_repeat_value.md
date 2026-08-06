# ValidateRepeatValue


This function validates time series based on repetition frequency. Values
repeated too often, are marked with **!** (Not OK). Values with control towards
repeated values are set to validated and marked with **V04**, meaning validation
method 4. You can see this code if you turn on value information in Nimbus.

## Syntax

- ValidateRepeatValue(t,t,d,d)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be validated. |
| 2 | t | Time series describing maximum number of repeated values. |
| 3 | d | Value describing delta used when comparing values. |
| 4 | d | Value that is considered as an exception to the rule. |

## Example
```
Waterlevel_hour_VEE = @ValidateRepeatValue(@RESET_STATUS(@t('Waterlevel_hour_raw')),@TS('VARINT',@d('ValidateMaxRepeatedValues')),@d('ValidateDeltaValues'),@d('ValidateExceptionValues'))
```

This example validates the time series using repetitions described in the time
series @TS('VARINT',@d('ValidateMaxRepeatedValues')), which is a time series
created from the attribute value, @d('ValidateMaxRepeatedValues'), on the
specific object.

The delta used when comparing the values, @d('ValidateMaxErrors'), and the value
that is considered an exception to the rule, @d('ValidateExceptionValues'), are
also defined as attributes on the specific object.

This example validates the time series using repetitions described in the time
series @TS('VARINT',@d('ValidateMaxRepeatedValues')). The delta used when
comparing the values is set to 0.01 and the value 0.0 is considered correct no
matter how many times it is repeated.

![](assets/images/ex_ValidateRepeatValue-nimbustable.png)
