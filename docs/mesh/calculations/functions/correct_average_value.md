# CorrectAverageValue

The method replaces values marked as errors with the average value of other
series for the same time. Values with correction using average value are set to
corrected and marked with **C05**, meaning correction method 5. You can see this
code if you turn on value information in Nimbus.

## Syntax

- CorrectAverageValue(t,d,s,s,d,T,D,S)
- CorrectAverageValue(t,d,s,s,d,T,D,D,D,S)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series to be corrected. |
| 2 | d | Value describing maximum total share (0-1) of the time series that can contain errors based on their respective weighting compared to the total weighting of time series used in the calculation. E.g factor 0,95 means it is accepted that only 5 % of the time series share can contribute to the corrected value. |
| 3 | s | Symbol describing whether or not endpoint adaptation should be performed. This is specified as 'TRUE' or 'FALSE'. Use endpoint adaption if you want to scale the corrected values to fit the existing time series values at start and end of the correction period. |
| 4 | s | Symbol describing whether or not time series are accumulated time series. This is specified as 'TRUE' or 'FALSE'. |
| 5 | d | Value giving the limit for right endpoint adaptation. This value has no effect unless time series are accumulated time series. Limit for right attachment specifies threshold value for right end point attachment. E.g if the difference between previous OK value and next OK value is less than this value, right end point will not be attached which means a standard method operation is performed. |
| 6 | T | An array of time series to be used in the correction. |
| 7 | D | An array of weight values. Weighting is used if you want values from a particular series to have a greater effect on the average than other series. Each value included in the average value calculation is multiplied by its respective weighting before it is added to an accumulated value. You get the final value by dividing the accumulated value by the sum of the weighting for the series included in the average value calculation. If the array is empty, all weights default to 1.0. |
| 8 | D | Only in the 10-argument variant. An array of scale factors, one per time series in argument 6. Each contribution value is multiplied by its scale factor before it enters the average value calculation. In the 8-argument variant all scale factors are 1.0. |
| 9 | D | Only in the 10-argument variant. An array of offset values, one per time series in argument 6. The offset is added to the contribution value after scaling, i.e. each contribution is calculated as scale factor * value + offset. In the 8-argument variant all offsets are 0.0. |
| 10 | S | An array with symbols describing whether or not corrected values can be used. This is specified as 'TRUE' or 'FALSE'. This is always the last argument, i.e. argument 8 in the 8-argument variant. If the array is empty, all values default to 'TRUE'. |

**Note!** To avoid circular references in the calculation of the correction
values using the method average value, the input time series used in the
correction must not include the same function. E.g you might refer to a time
series using only validation functions or other correction function that is not
depending on other time series. This is caused by the virtual calculation in
Mesh.

## Example

```
Temperature_hour_VEE = @CorrectAverageValue(@t('ValidatedTimeSeries'),0.95,'TRUE','FALSE',1,@T('../NeighbourMetStations/Temperature_hour_avg'),@D('../NeighbourMetStations/Weight'),@S('../NeighbourMetStations/AcceptCorrected'))
```

This example corrects the previously validated time series using the average
from the time series with different weights. Endpoint adaptation is turned on
and the limit for the right endpoint is not in use.
