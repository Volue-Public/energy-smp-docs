## gRPC API specification

The details of the Mesh gRPC API are defined in a set of Protocol Buffer (`.proto`) files. These files specify the available services, messages, and methods for interacting with the Mesh via gRPC.

Available proto files:

- [allocate_reserves/v1alpha/allocate_reserves.proto](proto/allocate_reserves/v1alpha/allocate_reserves.proto) — Allocate reserves service definitions
- [auth/v1alpha/auth.proto](proto/auth/v1alpha/auth.proto) — Authentication service definitions
- [availability/v1alpha/availability.proto](proto/availability/v1alpha/availability.proto) — Availability service definitions
- [calc/v1alpha/calc.proto](proto/calc/v1alpha/calc.proto) — Calculation service definitions (v1 alpha)
- [calc/v2alpha/calc.proto](proto/calc/v2alpha/calc.proto) — Calculation service definitions (v2 alpha)
- [config/v1alpha/config.proto](proto/config/v1alpha/config.proto) — Configuration service definitions
- [hydsim/v1alpha/hydsim.proto](proto/hydsim/v1alpha/hydsim.proto) — Hydro simulation service definitions
- [model/v1alpha/model.proto](proto/model/v1alpha/model.proto) — Model service definitions
- [model/v1alpha/resources.proto](proto/model/v1alpha/resources.proto) — Model resources definitions
- [model_definition/v1alpha/resources.proto](proto/model_definition/v1alpha/resources.proto) — Model definition resources
- [resource/v1alpha/resource.proto](proto/resource/v1alpha/resource.proto) — Resource service definitions
- [session/v1alpha/session.proto](proto/session/v1alpha/session.proto) — Session service definitions
- [time_series/v1alpha/time_series.proto](proto/time_series/v1alpha/time_series.proto) — Time series service definitions (v1 alpha)
- [time_series/v2alpha/timeseries.proto](proto/time_series/v2alpha/timeseries.proto) — Time series service definitions (v2 alpha)
- [time_series/v2alpha/timeseries_resource.proto](proto/time_series/v2alpha/timeseries_resource.proto) — Time series resource service definitions (v2 alpha)
- [type/resources.proto](proto/type/resources.proto) — Type resources definitions

Refer to these proto files for the most up-to-date and detailed information about the Mesh gRPC API, including message formats, methods, and request/response structures.
