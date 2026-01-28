# Which functions can be used when?

Here is a list of common calculations where transformation of values from one resolution to another is included

### ACCUMULATE VALUES STANDARD BEHAVIOR

This means transforming from a break point series to a fixed interval series, or from a fixed interval series to a different fixed interval series with coarser resolution, for example from hour to day series.

For this type of task this is used:

R1 = [@TRANSFORM(t,s,s)](../functions/transform.md#r1)

### ACCUMULATE VALUES TO SPECIFIC RESOLUTIONS

This means transformation from one time series to a different time series with a resolution that is not the same as calendar units, e.g. quarter, hour, day, week, month or year. You can choose a fixed period given from the start of the calculation or more general as points of time on a break point series.

For this type of tasks the following are used:

R2 = [@TRANSFORM(t,t,s)](../functions/transform.md#r2)


R3 = [@TRANSFORM(t,d,s)](../functions/transform.md#r3)

### MAKE TRANSFORMATION WITH REFERENCE TO TIME ZONE

The calculator performs calculations with reference to normal time if nothing else is given. A normal example is to accumulate hour values to day values or week values using local time (summer time) or a different time zone.

For this type of task the following is used:

R4 = [@TRANSFORM(t,s,s,s)](../functions/transform.md#r4)

### DISTRIBUTING VALUES WITH REFERENCE TO PROFILE

If you transform from fixed interval resolution to a finer resolution, e.g. from day to hour and want the calculated value to be distributed with reference to a profile, you cannot use standard transformation given from R1.

For this type of task the following is used:

R6 = [@DISTRIBUTE(t,t)](../functions/distribute.md#r6)

R7 = [@DISTRIBUTE(t,t,t)](../functions/distribute.md#r7)

R8 = [@TRANS_PROFILE(t,t)](../functions/trans_profile.md#r8)

R9 = [@TRANS_PROFILE(t,t,s)](../functions/trans_profile.md#r9)

R10 = [@TRANS_PROFILE(t,t,t)](../functions/trans_profile.md#r10)

R11 = [@TRANS_PROFILE(t,t,t,s)](../functions/trans_profile.md#r11)

Most of these functions exist in two editions with different use of profile values, relative or absolute.
