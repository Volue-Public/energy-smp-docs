# Changelog

## Version 1.9.1

- We have modified how exception status codes from the Mesh gRPC API are converted into REST API status codes. (#86)

## Version 1.9.0

- We have updated the Rest API to use the Mesh v2.19 gRPC interface.
- A new method `CreatePhysicalTimeSeries` is added to enable creation of physical time series in the database. (#78)

## Version 1.8.1

- We have updated the logging configuration to use pure Serilog configuration within the appsettings.json. NB! The MeshRestAPI:LoggingToFile parameter is no longer in use and can be removed. (#76)

## Version 1.8.0

- We have updated the Rest API to use the Mesh v2.18 gRPC interface.

## Version 1.7.0

- We have updated reading empty time series to align with changes in Mesh 2.17 changes. (#63)
- We have fixed an issue where MeshRestAPI.exe version would be marked improperly. (#64)
- We have updated the Rest API to use the Mesh v2.17 gRPC interface.
- We have added support for *MIN30* and *undefined* time series resolutions. (#61)
- We have fixed the Kerberos integration in order to authorise the user of the request correctly. We have also added the possibility to host the REST API in IIS. An extra startup test is also added to avoid running with security on http:// endpoints. (#41)
- We have added possibility to save log messages to file. This is activated by specifying a file path to the `LoggingToFile` attribute in appsettings.json. (#56)

## Version 1.6.0

- We have updated the Rest API to use the Mesh v2.16 gRPC interface.

## Version 1.5.2

- We have modified the response from `GetAttribute` and `GetObject` to contain the complete attribute definition as the `MeshAttribute` object instead of the `MeshTsId` object. We have also created a new method `GetTimeseriesResource` to get the time series resource information for a given time series key, and at the same time the `attributeKey` parameter is removed from the `GetAttributeMethod`. (#46)
- We have changed the internal error handling in the API in order to return more correct status codes. (#25)
- We have added a new method `IdentifyVirtualTSusage` to identify SmG virtual time series in the Mesh model. (#57)

## Version 1.5.1

- We have fixed a crash situation related to `GetObject` when the time series in the database has a unit of measurement that is not supported by Mesh, i.e. it is null. (#45,#53)

## Version 1.5.0

- We have added a new method `ImportMultistepWaterValueFunctions` that imports multistep water value functions into the Mesh model for a given water course. The method will automatically also delete existing water value functions older than x days back in time, where x is defined by the `DeleteWaterValuesOlderThanDays` in the appsettings.json configuration. Default value for the `DeleteWaterValuesOlderThanDays` parameter is 20 (days). (#37)

## Version 1.4.1

- We have changed all string inputs referring to a path to be optional if there is an id or a key that may specify the same information. (#33)

## Version 1.4.0

- We have updated the API to support gRPC version for Mesh 2.14. (#23)
- We have modified the internal behaviour of the ReadTimeSeriesValues and ReadTimeSeriesValuesMulti to not use the `relative_to` object in the request since this is not necessary any more. (#24)

## Version 1.3.0

- We have fixed an issue when transferring the security header information from the incoming request to the Mesh gRPC request. (#21)

## Version 1.2.0

- We have fixed an issue when reading values using resource path or timeseriesKey to identify the time series. This fix involves the following methods: ReadTimeSeriesValues, ReadTimeSeriesValuesRaw, ReadTimeSeriesValuesMulti and ReadTimeSeriesValuesMultiRaw. (#9)
- We have enhanced the exception messages returned from the API to better pin-point the source of the exception. Exceptions originating from the Mesh service is containing a `MESH - ` part, otherwise it contains an `API - ` part. (#10)
- We have fixed exceptions from the ReadTimeSeriesValuesMulti, ReadTimeSeriesValuesMultiRaw and WriteTimeSeriesValuesMultiRaw methods to always return reference to the time series if the exception is related to a specific time series. (#11)

## Version 1.1.1

- We have updated the API to support gRPC version for Mesh 2.13.
- We have added authentication functionality for Kerberos and OAuth2. (#1)
- We have added a new function (ExtendSession) to extend lifetime of a session. Current timeout period is 5 minutes. (#2)
- We have added a new function (GetRatingCurveVersions) to get information of a rating curve attribute. (#2)
- We have added a new function (UpdateRatingCurveVersions) to add new, or change or delete existing information of a rating curve attribute. (#2)
- We have added a new function (GetXySets) to get information of an XySets attribute. (#2)
- We have added a new function (UpdateXySets) to add new, or change or delete existing information of an XySets attribute. (#2)
- We have changed all attribute functions by adding a new parameter making it possible to use the Mesh Guid as a reference to an attribute. (#2)
- We have changed the definition of the ReadTimeSeriesValuesMulti and ReadTimeSeriesValuesMultiRaw functions to use POST operation instead of GET. (#5)
- We have fixed an error in input check for the WriteTimeSeriesValuesMultiRaw function when only specifying the TimeseriesKey reference for the time series. (#7)
