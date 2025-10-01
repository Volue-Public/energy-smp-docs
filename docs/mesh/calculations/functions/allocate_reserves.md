# AllocateReserves
## About the function
This function can be used to distribute values on a reserves time series onto a
set of target time series based on capacity and priority information. For
example, distribute a total requested production onto production units.

It is a "centralized" function that access multiple Mesh objects and put the
results into target series on multiple Mesh objects, unlike the traditional
calculation functions that returns the result to the caller that put it on the
time series object associated with that attribute.

The function is highly configurable and can be adapted to many different
structures. It uses a search expression to define the scope of the operation and
uses attribute names to inform where the input data is found.

The priority time series is the basis for selecting which object that contribute
with its capacity to fulfil the total request. Values on this priority series
should be from 1 and upwards. 1 is highest priority. The values do not need to
be a continuous sequence because the function does a floating point-based
sorting to get the correct order at a specific time. If the priority value is 0,
the associated unit does not contribute to reserves at all. If there are no time
series connected to priority, it is given a priority value of 1000. Successive
cases where this series is missing get s value 1001 etc.

## Syntax
- AllocateReserves(t,s,s,s,s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | t | A fixed interval time series with the requested total value to distribute onto result series <br>found on participating Mesh objects |
| 2 | s | A search expression that defines the set of Mesh objects that participates in the <br>distribution of total value from argument 1. The search expression should end up in a Mesh "node" object, not a time series or another attribute directly. If the search expression <br>has the prefix "Model:" it means the search is applied from root level of current Mesh model <br>(Model: is of course then removed from search definition). |
| 3 | s | The name of the attribute on the participating Mesh object that contains a time series with <br>priority values. Can be a time series of any resolution, normally a break point series. |
| 4 | s | The name of the attribute on the participating Mesh object that contains a time series with <br>capacity values. Can be a time series of any resolution. |
| 5 | s | The name of the attribute on the participating Mesh object that contains a time series to <br>receive the result values. The resolution of this time series must be <br>the same as the one in first argument. |

The AllocateReserves function normally returns a time series which is equal to
the requested series (first argument). In case the function is failing, it
returns a breakpoint series with a NaN value at the beginning of the requested
time period.

The function is logging info and potential error messages to the Mesh log.

## Example
The figure below shows an example Mesh object structure with 3 hierarchical
levels.

![](assets/images/DocExampleAllocateReserves.png)

On top level there is an object that have two time series attributes.
TriggerAttribute is having a connection to an expression like this:

```
## = @AllocateReserves(@t('.TotalRequest'),'*[.Type=Unit]','Priority','Capacity','Allocated')
```

From the expression we can observe the following:

- The first argument is bound to a time series attribute on the same object as the time series calculation attribute.
- The second argument is a simple search expression that find all instances of type **Unit** that are hierarchically related to the position where the calculation is defined. In this example it will be 6 Unit objects
- The next three arguments refer to time series attribute **names** on the Unit object type. This means that the definition of Mesh object type Unit must have these attribute names and they must be time series. The Priority series contains information that is used order the allocation sequence. The Capacity series contains information on how much this unit can contribute to absorb the total requested volume found on time series in first argument. The Allocated series will get the results from the AllocateReserves calculation.
