# Restriction
## About the function
This function generates a time series from the Restriction events associated
with this element, filtered on Category and Status. The value at a given time
will be chosen from the relevant event(s), using a strategy decided by the user.
When there are no events, the value will be a default value provided by the
user.

For more information about generating time series from restrictions/revisions,
see the help for the **Smart Power Apps** module **Availability Planner**.**

*Note!*** The generated time series will per default be a breakpoint time
series, unless an explicit transformation to a fixed interval is specified in
the time series calculation.

## Syntax
- Restriction(s, s, [d/t], s, (s))


## Description


| # | Type | Description |
|---|---|---|
| 1 | s | Category. Only events with this category will be used. Possible categories in the table at the bottom of this page. |
| 2 | s | Status filter. Names of one or more statuses, or the keyword 'All'. When using more than one status, separate the names using '|'. Possible statuses in the table at the bottom of this page. |
| 3 | d/t | Default value. If there are no active events, this value will be used. |
| 4 | s | Merge Function. This parameter describes which value to be used if there are more than one active event with the same status at a given time. Available Merge Functions are described in the table below. |
| 5 | s | (Optional) Search string to an object in ' '. Must return exactly one object. The time series will be generated based on the Restriction events related to this object. |


### Merge functions

| Function | Description |
|---|---|
| Minimum | Selects the smallest numerical value from the active events. |
| Maximum | Selects the largest numerical value from the active events. |
| BooleanAnd | If all the active events have value 1, this returns 1. Otherwise, it returns 0. |
| BooleanOr | If one or more of the active events has value 1, this returns 1. Otherwise, it returns 0. |
| Sum | Sums the values of all the active events. |
| Average | Finds the average value of all the active events. |

## Examples
```@Restriction('DischargeMin[m3/s]', 'Licensed', @d('.DischargeDefault'),'Maximum')`

Finds events with Category = 'DischargeMin[m3/s]', and Status = 'Licensed'. Uses
these events to generate a time series. If there are more than one event at a
time with the same status, the maximum value will be used. If there are no
events, the value found in the attribute '.DischargeDefault' will be used.

`@Restriction('DischargeMin[m3/s]', 'All', @t('.SomeTimeseriesAttribute'),'Average')`

Will generate a time series based on all events with Category =
'DischargeMin[m3/s]', regardless of statuses. If there are no events at a given
time, the value from the '.SomeTimeseriesAttribute' will be used. If there are
more than one event at a given time, the average value from those events will be
used.

`@MIX(@Restriction('DischargeMin[m3/s]', 'SelfImposed',NaN, 'Maximum'),@Restriction('DischargeMin[m3/s]', 'Licensed', @d('.DischargeDefault'),'Maximum', 'to_HydroPlant')`

Generates a time series which uses values from events with status SelfImposed if
such exist, otherwise it uses events from the licensed status. If there are no
events, the value found in the attribute '.DischargeDefault' is used.

***Note!*** The events are found on the object using the link relations
to_HydroPlant.

## Possible statuses
  This is a list of the possible statuses that can be used:

- Licensed (used as the main restriction)
- SelfImposed (used as the exception of the main restriction)


## Possible categories
  This is a list of the possible categories:

- DischargeMin[m3/s]
- DischargeMax[m3/s]
- DischargeMaxAverage[m3/s]
- DischargeMinAverage[m3/s]
- DischargeMaxVariationUp[m3/s]
- DischargeMaxVariationDown[m3/s]
- DischargeBlockFlow[m3/s]
- ProductionMin[MW]
- ProductionMax[MW]
- ProductionMaxRegulations
- ProductionRampingUp[MW]
- ProductionRampingDown[MW]
- ProductionBlockGeneration[MW]
- RampingFlag
- ReservoirLevelMin[m]
- ReservoirLevelMax[m]
- ReservoirLevelRampingUp[m]
- ReservoirLevelRampingDown[m]
- PumpHeightDownstreamReservoir[m]
- PumpHeightUpstreamReservoir[m]
- PressureHeightRestriction[m]
- Priority
- ReservoirTacticalLevelMin[m]
- ReservoirTacticalLevelMax[m]
