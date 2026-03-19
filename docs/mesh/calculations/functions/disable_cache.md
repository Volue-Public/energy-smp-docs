# DisableCache

The `@DisableCache()` function disables caching of calculation results for
the calculation expression it is used in and all calculations referencing that
calculation. `@DisableCache()` may be used for debugging purposes or to work
around issues with caching.

Nimbus and the gRPC notification service will not receive notifications about
changes to a calculation or its inputs if caching is disabled for that
calculation.

The [`@CopyTS`][copy_ts.md] function implicitly disables caching.

The `@Apply` VTS function implicitly disables caching if evaluated by Mesh.
