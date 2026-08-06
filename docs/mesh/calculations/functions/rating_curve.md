# RatingCurve

The function is used to lookup values from a complex rating curve description to
convert water level measurements in rivers to discharge unit. The function
parameters a, b and c are determined to best fit the measured discharge for
different elevations in the river and could be divided into several elevation
segments.

Because of changes in the river in time due to erosion and sedimentation, the
validity of a rating curve description could be periodized.

Q = ai (h+bi)^ci hi ≤ h i+1 hi+1 ≤ h n+2

The description gives factors a, b and for different value segments i for
elevation h. Each definition may be valid for a given time interval.

## Syntax

- RatingCurve(t)

## Description

| Type | Description |
|---|---|
| t | Source time series for water level measurements in rivers. It is used as lookup series on the rating curve definition found on the same object. |
