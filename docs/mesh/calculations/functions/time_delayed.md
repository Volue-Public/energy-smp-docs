## TimeDelayed

### About this function

The function uses an XYZ table to calculate a value-dependent delayed output
based on an input series. The XYZ table is specified by a search/lookup string to
the Mesh attribute that holds the table. The table contains the following
information, using a typical delayed water flow case as example:

- Z value defines the flow level where this XY vector definition is applied, i.e. a valid from definition.
- X value defines the delay given as offset value with respect to actual resolution of the input times series. If resolution is 1 hour, value 3 means 3 hours output delay.
- Y value gives the percentage of value from input series that is added as the time delayed contribution to time point defined by value time + offset given by X value.

The function will have volume in equal to volume out.

### Syntax

- TimeDelayed(t,s)

### Description

| # | Type | ## Description |
|---|---|---|
| 1 | t | Reference to a fixed interval time series. |
| 2 | s | Search specification that target the XYZ table to use. |

#### Example table

  ![](assets/images/TimeDelayed_Example.png)

#### Example

If the value in the input series is exactly 20 at time **t**, this value is
distributed like this:

- At t+4h, value = 20*0,02 = 0.04
- At t+5h, value = 20*0,5 = 10.0
- Etc.


If the value is close to 30, like 29, then the multiplication factor is
approximately 0,15 and 0,67 etc., because the factor is found as a linearisation
between the current segment and the next segment.

`DelayedFlow = @TimeDelayed (@t('.FlowSeries'), '.FlowDelayTableAttributeName')`

The flow table used has the values described above.

| Time (UTC) | FlowSeries | DelayedFlow | Description |
|---|---|---|---|
| 2025-11-05T22:00:00Z | nan        |       0.00 | nan is treated as 0|
| 2025-11-05T23:00:00Z |      20.00 |       0.00 | |
| 2025-11-06T00:00:00Z |      20.00 |       0.00 | |
| 2025-11-06T01:00:00Z |      20.00 |       0.00 | |
| 2025-11-06T02:00:00Z |      20.00 |       0.00 | |
| 2025-11-06T03:00:00Z |      20.00 |       0.40 | First contribution 2% |
| 2025-11-06T04:00:00Z |      20.00 |      10.40 | 50 % at this hour |
| 2025-11-06T05:00:00Z |      20.00 |      18.40 | 40 % at this hour |
| 2025-11-06T06:00:00Z |      20.00 |      19.80 | |
| 2025-11-06T07:00:00Z |      20.00 |      20.00 | |
| 2025-11-06T08:00:00Z |      20.00 |      20.00 | |
| 2025-11-06T09:00:00Z |      20.00 |      20.00 | |
| 2025-11-06T10:00:00Z |      20.00 |      20.00 | |
| 2025-11-06T11:00:00Z |      30.00 |      20.00 | |
| 2025-11-06T12:00:00Z |      30.00 |      20.00 | |
| 2025-11-06T13:00:00Z |      30.00 |      20.00 | |
| 2025-11-06T14:00:00Z |      30.00 |      20.00 | |
| 2025-11-06T15:00:00Z |      30.00 |      24.10 | |
| 2025-11-06T16:00:00Z |      30.00 |      34.20 | A peak, fast flow "meets" slow flow tail |
| 2025-11-06T17:00:00Z |      30.00 |      31.00 | |
| 2025-11-06T18:00:00Z |      30.00 |      30.20 | |
| 2025-11-06T19:00:00Z |      30.00 |      30.00 | |
| 2025-11-06T20:00:00Z |      30.00 |      30.00 | |
| 2025-11-06T21:00:00Z |      30.00 |      30.00 | |
| 2025-11-06T22:00:00Z |      30.00 |      30.00 | |
| 2025-11-06T23:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T00:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T01:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T02:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T03:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T04:00:00Z |      30.00 |      30.00 | |
| 2025-11-07T05:00:00Z |      20.00 |      30.00 | |
| 2025-11-07T06:00:00Z |      20.00 |      30.00 | |
| 2025-11-07T07:00:00Z |      20.00 |      30.00 | |
| 2025-11-07T08:00:00Z |      20.00 |      30.00 | |
| 2025-11-07T09:00:00Z |      20.00 |      25.90 | First reduced flow values reflected here |
| 2025-11-07T10:00:00Z |      20.00 |      15.80 | |
| 2025-11-07T11:00:00Z |      20.00 |      19.00 | |
| 2025-11-07T12:00:00Z |      20.00 |      19.80 | |
| 2025-11-07T13:00:00Z |      20.00 |      20.00 | |