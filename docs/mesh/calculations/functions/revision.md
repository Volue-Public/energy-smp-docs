# Revision

This function generates a time series from the Revision events associated with
this element, filtered on Status. The value will be 1 at the times where there
is an event, and 0 otherwise.

For more information about generating time series from restrictions/revisions,
see the help for the **Smart Power Apps** module **Availability Planner**.

*Note!*** The generated time series will per default be a breakpoint time
series, unless an explicit transformation to a fixed interval is specified in
the time series calculation.


## Syntax

- Revision(s)
- Revision(ss)

## Description

| # | Type | Description |
|---|---|---|
| 1 | s | Status filter. Names of one or more statuses, or the keyword 'All'. <br/>When using more than one status, separate the names using '|'. <br/>Possible statuses in the table at the bottom of this page. |
| 2 | s | (Optional) Search string to an object in ' '. Has to return exactly one object. <br/>The time series will be generated based on the Revision events related to this object. |



## Examples

`@Revision('Proposed')` generates a timeseries based on the Revision events with
status 'Proposed'.

`@Revision('Proposed|Recommended')` returns a timeseries generated from the
Revision events which has Status 'Proposed' or 'Recommended'.

`@Revision('All')` returns a timeseries generated from all valid Revision events
associated with this element.

`@Revision('Proposed|Recommended', '..')` returns a timeseries generated from
the Revision events on the parent object, which has Status 'Proposed' or
'Recommended'.

## Possible statuses
  This is a list of the possible statuses that can be used:

- Proposed
- Recommended
- Suspended
- AppliedByTso
- ApprovedByTso
- RejectedByTso
- Planned
- Unplanned
