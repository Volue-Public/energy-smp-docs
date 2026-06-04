# Time zone-aware time series

Physical time series with a daily or coarser resolution can be associated with
a **time zone**. This allows Mesh to maintain correct intervals between points
with respect to the time zone's local time, including daylight saving time
(DST) transitions. Without a time zone (the default), a daily series requires
its points to be spaced exactly 24 hours apart, which does not match local
calendar days in regions that observe DST.

This page describes the feature, its limitations, and the relevant APIs.

## Overview

* A time zone is given as an [IANA time zone database]
  (https://www.iana.org/time-zones) name, for example `Europe/Warsaw`,
  `America/Toronto` or `Pacific/Nauru`.
* Only physical time series with a daily or coarser resolution (day, week,
  month, year) can have a time zone. Finer resolutions and breakpoint series
  cannot.
* A physical time series can be:
    - created with a time zone,
    - updated from time zone-naive to time zone-aware,
    - updated from one time zone to another,
    - updated back to time zone naive (by setting an empty time zone).
* Internally, points are stored with their timestamps aligned to midnight in the
  database's time zone. This is done so that time zone-naive SmP applications
  with direct database access can continue working normally.

## Alignment

When a time series is time zone-aware, every point must be aligned to the start
of a period in the time series' local time:

| Resolution | Aligned to                                          |
|------------|-----------------------------------------------------|
| Day        | Midnight (00:00) local time                         |
| Week       | Midnight local time on Monday                       |
| Month      | Midnight local time on the first day of the month   |
| Year       | Midnight local time on the 1st of January           |

Mesh validates this alignment when writing points to the time series, and
unaligned points are rejected with an error.

### DST example

Consider a daily time series in the `America/Toronto` time zone covering the
2025 spring DST transition. Expressed in UTC, two consecutive local midnights
are:

* `2025-03-09 00:00 America/Toronto` = `2025-03-09 05:00 UTC`
* `2025-03-10 00:00 America/Toronto` = `2025-03-10 04:00 UTC`

The two points are 23 hours apart in UTC, but they are exactly one calendar day
apart in `America/Toronto`. Mesh accepts this as a valid daily step. On the
other hand, a time zone-naive daily series would reject these points because it
requires a fixed 24-hour spacing.

## Limitations

* Time zones are supported only for daily or coarser resolutions.
* Usage of time zone-aware time series on calculations is currently limited.
  See [Time zone-aware time series in calculations]
  (#time-zone-aware-time-series-in-calculations) for details. 
* Some time zones have specific points in time where midnight is ambiguous or
  non-existent. Such timestamps cannot currently be used, even in cases such as
  querying an interval covering those timestamps (regardless of whether there
  are any actual points at those timestamps).
* Making existing time series time zone-aware can be complicated in some cases,
  and may require some preliminary adjustment of existing points.
  See [Making an existing time series time zone-aware]
  (#making-an-existing-time-series-time-zone-aware) for details.
* It is not allowed to read/write points from/to a time series with an
  uncommitted time zone change in the same session.
* If the actual stored value of a time series' time zone becomes invalid
  (for example, due to a direct database modification storing a non-existent
  IANA name), Mesh will reject writes to the time series. However, updating
  the time zone to a valid value is still allowed so that the problem can be fixed.

## gRPC API

The gRPC API allows for setting time zones through the following proto files:

* [time_series/v2alpha/timeseries_resource.proto]
  (../grpc/proto/time_series/v2alpha/timeseries_resource.proto)
* [time_series/v1alpha/time_series.proto]
  (../grpc/proto/time_series/v1alpha/time_series.proto)

See the [gRPC API specification](../grpc/APISpecification.md) for the full set
of proto files.

## Python SDK

The [Mesh Python SDK](https://volue-public.github.io/energy-mesh-python/)
allows for setting time zones through its time series creation and update APIs. For example:

```python
result = session.create_physical_timeseries(
    path="/Path/To/Test/Timeseries/",
    name="Test_Timeseries",
    curve_type=Timeseries.Curve.PIECEWISELINEAR,
    resolution=Timeseries.Resolution.DAY,
    unit_of_measurement="cm",
    # time_zone is valid only if resolution is DAY or coarser
    time_zone="Europe/Warsaw",
)
session.commit()
```

See also the following examples:

* [create_physical_timeseries.py]
  (https://github.com/Volue-Public/energy-mesh-python/blob/master/src/volue/mesh/examples/create_physical_timeseries.py)
* [write_timeseries_points.py]
  (https://github.com/Volue-Public/energy-mesh-python/blob/master/src/volue/mesh/examples/write_timeseries_points.py)


## Time zone-aware time series in calculations

Mesh currently allows only a limited usage of time zone-aware time series in
calculations. This functionality will be expanded and improved over time.

The current allowed usage is as follows:

* As a return value of `@t()`, `@t(s)`, and `@T(s)`
* For initializing variables, e.g. `var = @t(); ## = var`
* For re-assigning time series array variables, e.g. `var = @T(x); var = @T(y)`
* In `@TRANSFORM(t, s, s)` and `@TRANSFORM(t, d, s)`, with the following caveats:
  - The `t` argument must have a staircase curve type. Linear time series are not supported.
  - The `t` argument must be the result of calling `@t`,  _not_ a variable
    holding a time series. I.e. `@TRANSFORM(@t, ...)` is supported,
    but not `@TRANSFORM(var, ...)`.
  - The `s` resolution argument must be `MIN`, `MIN5`, `MIN10`, `MIN15`, `MIN30`, or `HOUR`.
  - For the `d` overload, the resolution must be less than 24 hours and divide evently into it
    (`d < 24 hours` and `24 hours % d == 0`).
  - The transformation method argument must be `SUM` or `AVG`.

  See also [Special considerations about `@TRANSFORM`](#special-considerations-about-transform)

All other operations will currently result in an error, including re-calculations
that hit the above operations.

### Special considerations about `@TRANSFORM`

When transforming from coarser to finer resolutions, the time zone-naive
time series implementation of `@TRANSFORM` differs from the time zone-aware one
in a few ways:
* The time zone-naive implementation allows for arbitrary strings to be passed
  as a transformation method; if it contains (case insensitive) `SUM`,
  it will use `SUM`, otherwise it will use `AVG`. The time zone-aware implementation
  strictly checks for either `SUM` or `AVG` (also case insensitive).
* The time zone-naive implementation does not properly handle cases where the
  number of output points between each input is variable (such as monthly and yearly
  input time series). The time zone-aware implementation correctly handles these cases.

Note that time zone-aware time series can only be reliably transformed using
`@TRANSFORM`. APIs such as gRPC, REST, the Python SDK, or tools such as Nimbus
may return erroneous results when trying to transform time zone-aware time series
or change their resolution.

## Making an existing time series time zone-aware

Time zone-aware time series have a stricter set of validations than time
zone-naive ones, which may result in alignment errors when trying to set a time
zone for an existing time series for the first time. When a time zone-aware
time series reads its points from the database, they must be aligned as
described in [Alignment](#alignment) on _the database's_ local time, meaning
that an existing time zone-naive time series must have its points properly
aligned before a time zone can be assigned to it.

To fix these cases you can follow one of these approaches:

* Remove all the existing points from the time series, then set the time zone.
  This is the simplest approach, assuming the historical data is not
  important.
* Backup the existing points (for example into another time series, a file,
  etc), remove them from the time series, set the time zone, commit, then
  write the points again. They must be aligned to the time series' newly-set
  time zone.
* Create a new physical time series with a time zone set, connect it to the
  relevant time series attributes to replace the old one, then write the points
  to it. The points must be aligned to the new time series' time zone. The new
  series can be created via the gRPC API, the Python SDK or Volue UIs
  (e.g. Asset Manager, with points added via Nimbus or the Time Series
  application). Note that if any calculation expressions refer to the old
  physical time series directly, they will have to be updated as well.
* Align the existing points to the database's time zone first, then set a time
  zone for the time series. This can be convenient if most of the points are
  already properly aligned, and only a few stray cases need to be fixed.

[This Mesh Python SDK example]
(https://volue-public.github.io/energy-mesh-python/examples.html#<AREKS_SCRIPT>)
shows how to prepare time series with specific alignment issues before setting
a time zone on them.

## See also

* [Time series](./time-series.md)
* [Mesh sessions](./sessions.md)
