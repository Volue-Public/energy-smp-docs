# Change Log
All notable changes to this project will be documented in this file.

Version 2.19
======================

Features
--------

- [We have added support for the `DisableImportReply` toggle in the `ImportWorker` settings that allows disabling the import replies.][#667]

[#667]: https://github.com/Volue/energy-mesh-data-transfer/issues/667

Version 2.18.1
======================

Features
--------

- [We have added support to Service Bus Topics and Subscriptions.][#600]
A new `Subscription` parameter was added to the queue configuration. When `Subscription` is provided, `QueueName` becomes the name of the topic.

[#600]: https://github.com/Volue/energy-mesh-data-transfer/issues/600

Fixes
-----

- [We have fixed an issue where intermittent delays were observed when receiving messages from Service Bus queues.][#665]
Fixing the issue requires configuration changes.
- The `ImportWorker:ReceiveTimeout` parameter controls the timeout of a message receive call, with a default value of 100 ms. Increasing the timeout might help to fix the issue.
- The `ServiceBus:PrefetchCount` parameter specifies the number of messages prefetched and cached before the actual message is requested. Default number is 0, meaning no prefetch. Increasing the value of `PrefetchCount` might help to fix the issue.

- [We have fixed an issue where the import requests could not be identified in the debug logs.][#664]

[#665]: https://github.com/Volue/energy-mesh-data-transfer/issues/665
[#664]: https://github.com/Volue/energy-mesh-data-transfer/issues/664

Version 2.18
======================

Breaking changes
----------------

- [We have merged the Database Gateway, Export Data Store, Mesh AMQP Relay and Trigger Relay services into a single Mesh Data Transfer service.][#375]

The configuration file of the Trigger Relay service should be used as the base for the configuration of the new Mesh Data Transfer service.

The database configuration from the Database Gateway service needs to be applied to the Mesh Data Transfer settings file. The `HttpEndpoints:DatabaseGateway` node should be removed from Mesh Data Transfer configuration. The `Kestrel` configuration from the Database Gateway service should be dropped.

The configuration from Export Data Store settings file needs to be applied to Mesh Data Transfer settings file. Specifically:

- the `Storage`, node should be moved to Mesh Data Transfer settings,
- if present, the `MercatoMapping`, `UnitScheduleMapping` and `TsVolumesWebServiceExport` nodes should be moved to Mesh Data Transfer settings,
- the export queue should be added to the `QueuesConfiguration` section,
- the contents of `ParticipantSettings` node should be merged (previously the node existed in the configuration files of both services),
- the `HttpEndpoints:ExportDataStore` node should be removed from Mesh Data Transfer configuration.

The `Kestrel` configuration from the Export Data Store service should be dropped.

The configuration from Mesh AMQP Relay settings file needs to be applied to Mesh Data Transfer settings file. Specifically:

- `ImportWorker` and `FailedMessages` nodes should be applied to Mesh Data Transfer settings,
- `QueuesConfiguration` in Mesh Data Transfer should be updated with the queues used for the imports (the import, import reply and failure queues),
- `ImportExportCommonSettings:Delay` configuration parameter in Mesh AMQP Relay configuration is now moved to `ImportWorker:Delay` in Mesh Data Transfer configuration,
- `ExportWorker` settings were removed and should not be applied in Mesh Data Transfer configuration file.

Additionally, the export related queues should be removed from `AmqpSender:Queues`, as they were used to forward export requests to Mesh AMQP Relay and are not relevant anymore.

[#375]: https://github.com/Volue/energy-mesh-data-transfer/issues/375

Fixes
-----

- [We have fixed an issue where the `Date Created` column in the `MessageLog` application would not be filled properly for Bidding Strategy exports.][#649]

- [We have fixed an issue where the `Date Created` column in the `MessageLog` application would not be filled properly for availability exports and availability imports.][#475]

[#649]: https://github.com/Volue/energy-mesh-data-transfer/issues/649
[#475]: https://github.com/Volue/energy-mesh-data-transfer/issues/475

Version 2.17.3
======================

Breaking changes
----------------

- [We have removed the "equal sign" characters from GS2, EDIEL DELFOR, MSCONS and Excel CSV export file names.][#638]

[#638]: https://github.com/Volue/energy-mesh-data-transfer/issues/638

Fixes
-----

- [We have fixed an issue where using invalid/outdated authentication token to communicate with the Mesh server would be treated as actual message handling error.][#639] 

 [#639]: https://github.com/Volue/energy-mesh-data-transfer/issues/639

Version 2.17.2
======================

Fixes
-----

- [We have fixed an issue where transient authentication errors were treated as actual message handling errors.][#622]

Version 2.16.3
======================

Fixes
-----

- [We have fixed an issue where transient authentication errors were treated as actual message handling errors.][#622]


Version 2.15.6
======================

Fixes
-----

- [We have fixed an issue where transient authentication errors were treated as actual message handling errors.][#622]

[#622]: https://github.com/Volue/energy-mesh-data-transfer/issues/622

Version 2.16.2
======================

Fixes
-----

- [We have fixed an issue where the Message Log entries would not be created when exporting time series with the Time Series Volumes Web Service export protocol.][#604]

- [We have fixed an issue where transient errors in Mesh communication were treated as actual message handling errors.][#594]

Version 2.15.5
======================

Fixes
-----

- [We have fixed an issue where transient errors in Mesh communication were treated as actual message handling errors.][#594]

Version 2.17.1
======================

Fixes
-----

- [We have fixed an issue where the Message Log entries would not be created when exporting time series with the Time Series Volumes Web Service export protocol.][#604]

- [We have fixed an issue where transient errors in Mesh communication were treated as actual message handling errors.][#594]

[#604]: https://github.com/Volue/energy-mesh-data-transfer/issues/604
[#594]: https://github.com/Volue/energy-mesh-data-transfer/issues/594

Version 2.17
======================

Breaking changes
----------------

- [We have replaced malfunctioning counter with a set of randomly-generated characters in GS2 export filenames to ensure the filenames are unique.][#512]

- [When exporting revision availability events, the category attribute will now contain a string "Revision".][#504]
  Previously the category was an empty string for the revision events.

[#512]: https://github.com/Volue/energy-mesh-data-transfer/issues/512

Features
--------

- [We have added support for the MSCONS export][#534]

- [We have updated reading empty time series to align with changes in Mesh 2.17 changes.][#590]

- [We have added a new `ReadOnly` parameter to the DatabaseGateway service that prevents the service from modifying the database.][#546]
  Note: it does not prevent Mesh from database modifications. The read only mode in Mesh needs to be set separately in the Mesh configuration file.

[#534]: https://github.com/Volue/energy-mesh-data-transfer/issues/534
[#546]: https://github.com/Volue/energy-mesh-data-transfer/issues/546
[#590]: https://github.com/Volue/energy-mesh-data-transfer/issues/590

Fixes
-----

- [We have fixed an issue where timestamps in CSV export would not take UTC offset into account.][#584]

[#584]: https://github.com/Volue/energy-mesh-data-transfer/issues/584

Version 2.16.1
======================

Features
--------

- [We have added support for Time Series Volumes Web Service time series exports.][#482]
  The settings for the new protocol are placed in `TsVolumesWebServiceExport` node in Export Data Store configuration file.

[#482]: https://github.com/Volue/energy-mesh-data-transfer/issues/482

Fixes
-----

- [We have fixed an issue where exporting a large number of time series data using the standard export protocol would fail.][#563]

Version 2.16
======================

Features
--------

- [We have added support for Excel CSV time series export.][#458]

[#458]: https://github.com/Volue/energy-mesh-data-transfer/issues/458

- [We have added support for RabbitMQ Virtual Host feature.][#185]

[#185]: https://github.com/Volue/energy-mesh-data-transfer/issues/185

- [We have added full support for the Service Bus queues.][#457]
  If the queues defined in the configuration file do not exist, data-transfer will attempt to create them automatically.
  The message lock time will be set to 5 minutes, other settings will remain default.

[#457]: https://github.com/Volue/energy-mesh-data-transfer/issues/457

Fixes
-----

- [We have fixed an issue where the time series results would be grouped incorrectly when the sender host feature is used for the CSV export.][#535]

- [When the result of an availability event export has an empty category attribute, it is now guaranteed that this is a revision availability event.][#504]

[#504]: https://github.com/Volue/energy-mesh-data-transfer/issues/504

Version 2.15.4
======================

Features
--------

- [We have added an option to choose between `ora` and `periodo` nodes in Bidding export protocol.][#571]
  A new `UsePeriodo` flag in the Bidding export protocol section in EDS configuration is used to switch between the nodes.

[#571]: https://github.com/Volue/energy-mesh-data-transfer/issues/571

Fixes
-----

- [We have fixed an issue where exporting a large number of time series data using the standard export protocol would fail.][#563]

[#563]: https://github.com/Volue/energy-mesh-data-transfer/issues/563

Version 2.15.3
======================

Features
--------

- [We have added an option to report `ImportSuccess = true` for partially successful time series import requests.][#547]
  The feature is toggled with an optional `PartialImportSuccess` parameter in the `ImportWorker` section of Mesh AMQP Relay configuration file.

Fixes
-----

- [We have fixed an issue where debug logs could leak `AMQP`/`ServiceBus` connection strings.][#549]

[#547]: https://github.com/Volue/energy-mesh-data-transfer/issues/547
[#549]: https://github.com/Volue/energy-mesh-data-transfer/issues/549

Version 2.15.2
======================

Breaking changes
----------------

- [We have added support for the Decimals export attribute in GS2 time series export.][#514]
  Since this attribute was previously ignored, GS2 time series export might start to produce different results if the Decimals attribute was already defined in the time series export definition.

- [We have added support for the UTC offset in GS2 time series export.][#516]
  The standard time is used when custom UTC offset is not provided.

Features
--------

- [We have added a new optional parameter named DefaultDecimals that can be applied per export protocol in the Export Data Store configuration.][#514]
  The DefaultDecimals parameter is supported for the EDIEL DELFOR and GS2 export types only.

[#514]: https://github.com/Volue/energy-mesh-data-transfer/issues/514

Fixes
-----

- [We have fixed an issue where the time series results would be grouped incorrectly when the sender host feature is used for the EDIEL DELFOR export.][#535]

[#535]: https://github.com/Volue/energy-mesh-data-transfer/issues/535

- [We have fixed an issue where the precision of the total sum of time series values would be lost in the GS2 time series export.][#531]

[#531]: https://github.com/Volue/energy-mesh-data-transfer/issues/531

- [We have fixed an issue where EDIEL export output file could contain zeros formatted with leading minus sign.][#517]

[#517]: https://github.com/Volue/energy-mesh-data-transfer/issues/517

- [We have fixed an issue where time series export would fail due to invalid UTC to local time conversions.][#516]

[#516]: https://github.com/Volue/energy-mesh-data-transfer/issues/516

- [We have changed the name of `ora` node to `periodo` in Bidding Strategy export.][#520]

[#520]: https://github.com/Volue/energy-mesh-data-transfer/issues/520

Version 2.15.1
======================

Breaking changes
----------------

- [We have changed the behaviour of the time series export when different export senders are used.][#485]
The export results are now **grouped per sender**.
If no sender is defined as the export request parameter, then the time series sender is either the sender host from the export definition or the default sender when the sender host is not defined.
If the sender is defined as the export request parameter, the time series export definitions with a defined **sender host that doesn't match the request sender are ignored** during the export; the sender of all the time series is the request sender.

Fixes
-----

- [We have fixed an issue where a failure of a single time series export in the Export Data Store would cause a failure of the whole time series export request.][#499]

[#499]: https://github.com/Volue/energy-mesh-data-transfer/issues/499

- [We have fixed an issue where participant short name would be used instead of the full name in the GS2 export.][#485]

- [We have fixed an issue where missing numbers (NaN) would not be converted to zeroes in the GS2 time series export.][#486]

[#486]: https://github.com/Volue/energy-mesh-data-transfer/issues/486

- [We have fixed an issue where the output of the GS2 time series export would be incompatible with the SmG gs2imp time series import tool.][#484]

[#484]: https://github.com/Volue/energy-mesh-data-transfer/issues/484

- [We have fixed an issue where the sender host would be ignored in time series export.][#485]

[#485]: https://github.com/Volue/energy-mesh-data-transfer/issues/485

Version 2.15
======================

Breaking changes
----------------

- We have added a new mandatory configuration parameter for TriggerRelay: `ParticipantSettings:DefaultSender`. It was done as a part of [#283] and [#316].
The `DefaultSender` parameter is a number that denotes a participant key to be used by default when exporting data from Mesh.
Example configuration:
```json
  "ParticipantSettings": {
    "DefaultSender": 13
  }
```

- [We have removed the support for the Mesh XML interface.][#309]

[#309]: https://github.com/Volue/energy-mesh-data-transfer/issues/309

Features
--------

- [We have added support for Bidding Strategy export with a 15-minute time series resolution.][#425]

[#425]: https://github.com/Volue/energy-mesh-data-transfer/issues/425

- [We have added support for changing the resolution of the exported time series.][#324]
NB! The behavior of an export with a target resolution differs from the old export in release 2.15.
When exporting time series points from an attribute that holds a physical time series,
the `Id` field in the Standard Export `Points` node will contain a time series source ID instead of a physical time series ID.
If the target export resolution is not defined, the `Id` will still contain the physical time series ID.

```
    <Timeseries QueryId="2ad565bc-412c-4674-b981-b1ad24537799">
      <Points Id="d3163dae-81de-413a-8c55-bc11ad5080c8" Path="XYZ" DeltaT="PT15M" Reference="ABC" UnitOfMeasurement="MW" UnitOfMeasurementName="MW" CurveType="StaircaseStartOfStep">
        <Segments>
        ...
        </Segment>
```
We plan to place the time series source ID in the Standard Export's `Id` field unconditionally starting from the release 2.16 (Smart Power 2024.5).

[#324]: https://github.com/Volue/energy-mesh-data-transfer/issues/324

- [We have added support for specifying the export sender.][#316]

[#316]: https://github.com/Volue/energy-mesh-data-transfer/issues/316

- [We have added support for EDIEL DELFOR time series exports.][#283]

[#283]: https://github.com/Volue/energy-mesh-data-transfer/issues/283

Fixes
-----

- [We have changed the type of the attribute `UnitOfMeasurement` in `TimeseriesPoints` type from `UUID` to `xsd:string`.
  In consequence, the `AmqpMessageTypes.xsd` schema version has been bumped to 1.1.][#399]
  To start using version 1.1, please set `Storage:StoragePerProtocol:StdExport:SchemaVersion` item to "1.1" in Export Data Store `appsettings.json`.
  If this value is not specified, it defaults to version 1.0.
  Note! We will stop supporting schema version 1.0 in Mesh Data Transfer release 2.17.
  Note! When using schema version 1.0, the `UnitOfMeasurement` attribute value does not comply with its type defined in the schema.

[#399]: https://github.com/Volue/energy-mesh-data-transfer/issues/399

- [We have fixed an issue where the Mesh export response message size would exceed the default 4 MB][#460]

[#460]: https://github.com/Volue/energy-mesh-data-transfer/issues/460

- [We have fixed an issue where a failure to access the export directory did not cause the time series export request to fail.][#437]

[#437]: https://github.com/Volue/energy-mesh-data-transfer/issues/437

- [We have fixed an issue where the Message Log entries would not be created when exporting time series with the GS2 export protocol.][#388]

[#388]: https://github.com/Volue/energy-mesh-data-transfer/issues/388

- [We have fixed an issue where Message Log timestamps would not be aligned to the database time zone.][#379]

[#379]: https://github.com/Volue/energy-mesh-data-transfer/issues/379

Version 2.14.2
======================

- [We have brought back the `UnitOfMeasurementName` attribute to the standard export format due to compatibility reasons. It carries a human-readable version of the unit of measurement. Its value will be the same as the value of `UnitofMeasurement` attribute.][#428]

[#428]: https://github.com/Volue/energy-mesh-data-transfer/issues/428

- [We have fixed an issue where MAR and TR could occupy a lot of network ports when using Kerberos authorization.][#394]

[#394]: https://github.com/Volue/energy-mesh-data-transfer/issues/394

Version 2.14.1
======================

- [We have fixed an issue where import requests using `Reference` parameter could delete points outside of the original request interval.][#385]

[#385]: https://github.com/Volue/energy-mesh-data-transfer/issues/385


Version 2.14
======================

As of time of writing this note (release 2024.3 in progress) data-transfer uses a separate version for every service.
Since data-transfer is part of Smart Power, we see value in unifying the data-transfer versioning scheme with the Mesh versioning system.

All releases (originating from new development and from backporting to the past releases) will start to receive a version according to the Mesh versioning system.
All new data-transfer executables will be stamped with release indicator and the build number: `Major.Minor.Patch.(BuildNumber)`, where `Major` and `Minor` will match with corresponding Mesh version.

Changelog will be divided into release sections.
We will leave current changelog entries unchanged as all data-transfer deployed at the customers
use the old versioning scheme.


- [We have fixed an issue where the import request could not be opened using `MessageLog` application.][#369]

[#369]: https://github.com/Volue/energy-mesh-data-transfer/issues/369

- [We have fixed an issue where the request timeout would not be taken into account when communicating with Mesh using gRPC interface.][#337]

[#337]: https://github.com/Volue/energy-mesh-data-transfer/issues/337

- [We have fixed an issue where an export of complex availability events would fail.][#354]

[#354]: https://github.com/Volue/energy-mesh-data-transfer/issues/354

- [We have upgraded data-transfer services to .NET8.][#341]

[#341]: https://github.com/Volue/energy-mesh-data-transfer/issues/341

- [We have fixed a memory leak that occurred during timeseries export.][#340]

[#340]: https://github.com/Volue/energy-mesh-data-transfer/issues/340


Version 2.13
======================

## [TR3.6.3] [MAR4.5.3] [EDS4.1.1] [DBGW2.1.1]
- [We have renamed the `appsettings.json` file to `appsettings.json.sample` to improve the upgrade process.][#207]

[#207]: https://github.com/Volue/energy-mesh-data-transfer/issues/207

## [TR3.6.2] [MAR4.5.2]
- [We have fixed an issue where availability event occurrences would not be handled correctly.][#321]

[#321]: https://github.com/Volue/energy-mesh-data-transfer/issues/321

## [TR3.6.1] [MAR4.5.1]
- [We have fixed an issue where `ForceAvailabilityEventCreation` flag would not work correctly.][#319]

[#319]: https://github.com/Volue/energy-mesh-data-transfer/issues/319


## [TR3.6.0] [MAR4.5.0]
- [We have switched to the Mesh gRPC NuGet package used for the communication with the Mesh server.][#315]

[#315]: https://github.com/Volue/energy-mesh-data-transfer/issues/315

## [DBGW2.1.0] [EDS4.1.0] [MAR4.4.0] [TR3.5.0]

- [We have added support for GS2 time series exports][#282]

[#282]: https://github.com/Volue/energy-mesh-data-transfer/issues/282

## [MAR4.3.13]
- [We have added functionality to automatically unzip import messages if the ContentType or ContentEncoding property of the import message contains the string 'gzip'.][#296]

[#296]: https://github.com/Volue/energy-mesh-data-transfer/issues/296


Version 2.12.1
======================

- [We have fixed a memory leak that occurred during timeseries export.][#340]

[#340]: https://github.com/Volue/energy-mesh-data-transfer/issues/340


Version 2.12.0
======================

We are backporting .NET8 upgrade to data-transfer in Smart Power 2024.1.
As of time of writing this note (release 2024.3 in progress) data-transfer uses a separate version for every service.
Since data-transfer is part of Smart Power, we see value in unifying the data-transfer versioning scheme with the Mesh versioning system.

All releases (originating from new development and from backporting to the past releases) will start to receive a version according to the Mesh versioning system.
All new data-transfer executables will be stamped with release indicator and the build number: `Major.Minor.Patch.(BuildNumber)`, where `Major` and `Minor` will match with corresponding Mesh version.

Changelog will be divided into release sections.
We will leave current changelog entries unchanged as all data-transfer deployed at the customers
use the old versioning scheme.

- [We have upgraded data-transfer services to .NET8.][#341]

[#341]: https://github.com/Volue/energy-mesh-data-transfer/issues/341

## [MAR4.3.12]

- [We have fixed an issue where import files were incorrectly stored in a directory named with local date][#302]

[#302]: https://github.com/Volue/energy-mesh-data-transfer/issues/302

## [DBGW2.0.2]

- [We have fixed an issue where we would try to export time series points outside of the time series' validity interval][#281]

[#281]: https://github.com/Volue/energy-mesh-data-transfer/issues/281

## [TR3.4.4] [MAR4.3.11]

- [We have added Kerberos authentication support to the gRPC interface.][#284]
  Services talking to Mesh using gRPC will now be able to authenticate to Mesh using Kerberos.
  We have added a `ServerPrincipal` configuration item in `HttpEndpoints:Mesh` node.
  The user should set its value to the server principal of the Mesh server.
  We have also removed the `TlsCertificate` configuration item from `HttpEndpoints:Mesh` node.
  Users should enable secure Mesh communication by using `https` protocol in `HttpEndpoints:Mesh:Uri`.
  
[#284]: https://github.com/Volue/energy-mesh-data-transfer/issues/284

## [TR3.4.3] [MAR4.3.10]

- [We have added support for 30 minute resolution time series][#285]

[#285]: https://github.com/Volue/energy-mesh-data-transfer/issues/285

## [TR3.4.2] [DBGW2.0.1] [MAR4.3.9] [EDS4.0.1]

- [We have changed the way `Created` and `Transferred` columns work in `Message Log`.][#277]
  Until now, `Created` would display the time when the export has completed and `Transferred` would be empty.
  `Created` will now display the time when the export order was received in `Trigger Relay` and `Transferred` will display the time when the export has completed.

[#277]: https://github.com/Volue/energy-mesh-data-transfer/issues/277

## [EDS4.0.0] [DBGW2.0.0]

- [We have changed the way EDS retrieves target queue names.][#272]
In the previous versions there were 2 ways to specify target queue names to send the exports to.
1. Using the `Queues` array filled with queue aliases in the config file
2. Using `RECADR` database table to store the queue names. Broker should be specified in the `Broker` configuration item. Queue names were associated with an export protocol and a receiver identifier.

Approach #1 turned out to be not flexible enough and approach #2 is too messy (keeping the broker name and the queue name separately).
In this version we introduce (protocol, receiver)-to-queue mapping into EDS configuration file:
```
  "Storage": {
    "StoragePerProtocol": {
      "PVPLAN": {
        "StorageKinds": [ "Queue" ],
        "DestinationQueues": {
          "1": [ "exportReplyQueue" ],
          "13": [ "exportReplyQueue", "someOtherQueue" ]
        },
        "DefaultQueues": [ "exportReplyQueue" ]
      },
      "PVPLAN2023": {
        "StorageKinds": [ "File" ],
        "StorePath": "C:\\files\\"
      },
      "StdExport": {
        "StorageKinds": [ "Queue" ],
        "DestinationQueues": {
          "1": [ "exportReplyQueue" ],
          "13": [ "exportReplyQueue", "someOtherQueue" ]
        },
        "DefaultQueues": [ "exportReplyQueue" ]
      },
      "APORAPOTExport": {
        "StorageKinds": [ "Queue" ],
        "DestinationQueues": {
          "1": [ "exportReplyQueue" ],
          "2": [ "exportReplyQueue", "someOtherQueue" ]
        },
        "DefaultQueues": [ "exportReplyQueue" ]
      },
      "BiddingTool": {
        "StorageKinds": [ "File" ],
        "StorePath": "C:\\files\\"
      }
    }
  },

  "QueuesConfiguration": {
    "exportReplyQueue": {
      "Broker": "B1",
      "QueueName": "exportReplyQueue",
      "Role": "Sender"
    },
    "someOtherQueue": {
      "Broker": "B1",
      "QueueName": "someOtherQueue",
      "Role": "Sender"
    }
  },
```
- We introduce `DestinationQueues` mapping into `StoragePerProtocol` children nodes.
It is a dictionary consisting of keys being export receiver identfiers and values being queue aliases arrays. When the `DestinationQueues` has a key equal to an export receiver value for given export protocol, the export data will be sent to the queues in the respective array.

- In the `StoragePerProtocol` nodes the `Queues` array is renamed to `DefaultQueues`.
If the `DestinationQueues` mapping does not provide target queue information, `DefaultQueues` values are used as target queues.


[#272]: https://github.com/Volue/energy-mesh-data-transfer/issues/272

## [MAR4.3.8]

- [We have modified the content of the standard XML format slightly. If you specify an external reference in the export definition, this information will now be put into both the Path (as before) and the Reference field. For breakpoint time series, the DeltaT field has now changed from 0 to PT0S (which is a legal resolution value).][#276]

[#276]: https://github.com/Volue/energy-mesh-data-transfer/pull/276

- [We have fixed an issue where `Receiver` and `Sender` fields in time series import request could be translated incorrectly.][#270]
 
[#270]: https://github.com/Volue/energy-mesh-data-transfer/pull/270
 
## [TR3.4.1]

- [We have added a possibility to specify a `SessionId` in timeseries and availability export requests.][#261]
  The session ID can be provided in an optional `SessionId` header in `Order` and `AvailabilityExport` endpoints
[#261]: https://github.com/Volue/energy-mesh-data-transfer/pull/261

## [TR3.4.0]

- [We have introduced status reporting to Trigger Relay time series and availability export requests.][#244] (issue [#196])

[#244]: https://github.com/Volue/energy-mesh-data-transfer/pull/244
[#196]: https://github.com/Volue/energy-mesh-data-transfer/issues/196

## [EDS3.3.3]

- [We have fixed an issue where PvPlan 2023 export results would be overwritten if input interval would span for more than one day.][#259]

[#259]: https://github.com/Volue/energy-mesh-data-transfer/pull/259

## [MAR4.3.6]

- [We have fixed gRPC session handling in case of Mesh unavailability.][#257]

[#257]: https://github.com/Volue/energy-mesh-data-transfer/pull/257/

## [MAR4.3.5]

- [We have added automatic extension of session in gRPC Mesh communication interface.][#255]

[#255]: https://github.com/Volue/energy-mesh-data-transfer/pull/255/

## [EDS3.3.2]

- [We have fixed an issue where PvPlan 2023 export results would be corrupted if input interval would span for more than one day.][#254]

[#254]: https://github.com/Volue/energy-mesh-data-transfer/pull/254

## [MAR4.3.4]

- [We have fixed an issue where `AvailabilityEventRemove` import would fail.][#251]

[#251]: https://github.com/Volue/energy-mesh-data-transfer/pull/251

## [MAR4.3.3]

- [We have added `Reason` field to availablity events import and export.][#249]

[#249]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/249

## [MAR4.3.2]

- [We have fixed an issue where revision availability events import would fail.][#250]

[#250]: https://github.com/Volue/energy-mesh-data-transfer/pull/250

## [MAR4.3.1]

- [We have fixed an issue where time series import logs would not be visible in `MessageLog`.][#238]

[#238]: https://github.com/Volue/energy-mesh-data-transfer/pull/238

## [MAR4.3.0]

- [It is now possible to import timeseries using a reference and Id when using gRPC Mesh communication interface.][#235]

[#235]:https://github.com/Volue/energy-mesh-data-transfer/pull/235

## [DBGW1.1.1]

- [Mapping of sender and receiver participants are now possible to configure using the `Database/OpunKeyMode` option in the appsettings.json file. SHORNAME is the default mapping item if not specified.][#232]

[#232]:https://github.com/Volue/energy-mesh-data-transfer/pull/232

## [MAR4.2.8]

- [We have fixed an issue where putting arbitrary MessageId in import request would break the timeseries import.][#228]

[#228]:https://github.com/Volue/energy-mesh-data-transfer/pull/228

## [MAR4.2.7]

- [An issue with high CPU usage by MAR while Mesh was unavailable was fixed.][#224]

[#224]:https://github.com/Volue/energy-mesh-data-transfer/pull/224

## [MAR4.2.6]

- [We have fixed an issue where availability `update` request would be mapped to `create` request][#223]

[#223]:https://github.com/Volue/energy-mesh-data-transfer/pull/223

## [MAR4.2.5]

- [We have fixed an issue where `igoreImportErrors` and `logRequest` flags would not be present in availability import request sent to Mesh server.][#221]

[#221]: https://github.com/Volue/energy-mesh-data-transfer/pull/221

## [EDS3.3.1] [MAR4.2.4]

- [We have fixed an issue where exported XML files contained numbers in invalid format][#217]

[#217]: https://github.com/Volue/energy-mesh-data-transfer/issues/217

## [MAR4.2.3]

- [We have fixed an issue where `IgnoreImportErrors` flag would not be present][#215]

[#215]: https://github.com/Volue/energy-mesh-data-transfer/pull/215

## [MAR4.2.2]

- [We have fixed an issue where time series import reply would contain `MessageId` instead of `RequestMessageId` field.][#213]

- [We have fixed import logging when using XML protocol][#212]

[#212]: https://github.com/Volue/energy-mesh-data-transfer/pull/212

[#213]: https://github.com/Volue/energy-mesh-data-transfer/pull/213

## [MAR4.2.1]

- [We have fixed an issue where export would not work due to incorrect `QueryId` comparison.][#208]

[#208]: https://github.com/Volue/energy-mesh-data-transfer/pull/208

## [MAR4.2.0]

- [We have fixed an issue where `UnitOfMeasurementName` parameter would not be present in exported data.][#205]

[#205]: https://github.com/Volue/energy-mesh-data-transfer/pull/205

## [MAR4.1.1]

- [We have fixed an issue where `Path` parameter would not be visible in data exports.][#204]

[#204]: https://github.com/Volue/energy-mesh-data-transfer/pull/204

## [EDS3.3.0] [TR3.3.0] [MAR4.1.0] [DBGW1.1.0]

- [A new PVPLAN 2023 export format is introduced][#197]

[#197]: https://github.com/Volue/energy-mesh-data-transfer/pull/197

## [TR3.2.1] [EDS3.2.3] [MAR4.0.1] [DBGW1.0.1]

- [We have fixed a memory leak caused by incorrect usage of `XmlSerializer` class.][#201]

[#201]: https://github.com/Volue/energy-mesh-data-transfer/pull/201

## [EDS3.2.2]

- [We have updated allowed symbol set for Bidding Strategy's `Mercato` and `US` parameters.][#198]

[#198]: https://github.com/Volue/energy-mesh-data-transfer/pull/198

## [EDS3.2.1]

- [We have fixed an issue where breakpoint time series would be exported incorrectly using BiddingTool protocol][#189]

[#189]: https://github.com/Volue/energy-mesh-data-transfer/pull/189

## gRPC Interface Support [MAR4.0]

- [Mesh AMQP Relay is now able to communicate with Mesh using gRPC interface.][#69]
  New parameters are introduced to `HttpEndpoints::Mesh` node:
    - `MeshInterface` - allows the user to choose how MAR communicates with Mesh. Possible values: { `gRPC`, `XML` }.
    - `TslCertificate` - allows the user to specify the certificate used to encrypt the communication when using `gRPC` interface and `HTTPS`. It can be set to `null` when using `XML` interface.
  `Uri` should be adjusted to the URI of `XML` Mesh server or `gRPC` Mesh server.

  ```json
    "HttpEndpoints": {
      "Mesh": {
        "Uri": "https://localhost:50051",
        "MeshInterface": "gRPC",
        "TslCertificate": "C:\\certs\\certificate.crt",
        "RequestTimeout": 60
      },
      "ExportDataStore": {
        "Uri": "http://localhost:17000"
      },
      "DatabaseGateway": {
        "Uri": "http://localhost:7137"
      }
  }

  ```

[#69]: https://github.com/Volue/energy-mesh-data-transfer/pull/69


## [EDS 3.2.0]

- [PvPlan and APOR/APOT report filenames are extended with milliseconds to prevent report overwriting.][#177]

[#177]: https://github.com/Volue/energy-mesh-data-transfer/pull/177

## Single File Builds

- [Since build #390 we will publish services with `Single File Build` option enabled. This will reduce number of files in the directories greatly.][#151]
This change requires adding following settings to `Serilog` options:
`    "Using": [ "Serilog.Sinks.Console", "Serilog.Sinks.File", "Serilog.Enrichers.Thread" ],`

[#151]: https://github.com/Volue/energy-mesh-data-transfer/pull/151

## [TR 3.1.1]

`HttpEndpoints/DatabaseGateway` configuration is required for the database connection.

Example:

```json
"HttpEndpoints": {
  "DatabaseGateway": {
    "Uri": "http://localhost:7137"
  }
}
```

## [MAR3.2.0]
- [The configuration of HTTP endpoints has changed.][#139]

There is a new config container introduced: `HttpEndpoints`.

`MeshHttpEndpoint/MeshHttpInterface` is now moved to `HttpEndpoints/Mesh/Uri`.
`MeshHttpEndpoint/RequestTimeout` becomes `HttpEndpoints/Mesh/RequestTimeout`.
`ExportWorker/ExportServiceAddress` becomes `HttpEndpoints/ExportDataStore/Uri`.

Support of `MeshHttpEndpoint` and `ExportWorker/ExportServiceAddress` nodes is dropped.

`HttpEndpoints/DatabaseGateway` configuration is required for the database connection.

All the HTTP endpoints accept an optional `RequestTimeout` parameter (unit: seconds, default value: 60).

Example `HttpEndpoints` section:

```json
"HttpEndpoints": {
  "Mesh": {
    "Uri": "http://localhost:20000/mesh",
    "RequestTimeout": 60
  },
  "ExportDataStore": {
    "Uri": "http://localhost:17000/",
    "RequestTimeout": 30
  },
  "DatabaseGateway": {
    "Uri": "http://localhost:7137"
  }
}
```

## [DBGW1.0.0]

- [There is a new service: DatabaseGateway.][#139]

It is supposed to be a database proxy for other data-transfer services.
Currently DatabaseGateway is utilized by MAR and Trigger Relay.
EDS still invokes database operations on its own.

There is a [README](./src/DatabaseGateway/README.md) for DatabaseGateway service.

[#139]: https://github.com/Volue/energy-mesh-data-transfer/pull/139

## [MAR3.0.9]
- [We have changed an error category of the condition where Mesh would return an error to time series query from internal to external.][#135]

[#135]: https://github.com/Volue/energy-mesh-data-transfer/pull/135

## [EDS3.0.7]

- [We have fixed an issue where APOT/APOT time series export would fail if export start time was set to some specific value.][#123]

[#123]: https://github.com/Volue/energy-mesh-data-transfer/pull/123

## [EDS3.0.6]

- [We have added tracking of export index file numbers in PDDBENV table to support failover case.][#121]

[#121]: https://github.com/Volue/energy-mesh-data-transfer/pull/121

## [TR3.0.5] [EDS3.0.5]

- [We introduced bidding strategy export customisation to make sure full days are always exported.][#118]

[#118]: https://github.com/Volue/energy-mesh-data-transfer/pull/118

## [MAR3.0.8]

- [We have added more fine-grained error handling in Mesh AMQP Relay.
   `FailedMessages` setting now contains two items: `UseFailureQueueOnInternalError` and `UseFailureQueueOnExternalError` of boolean type.
    Internal errors are the ones that originated from inside Mesh AMQP Relay (for example XML/JSON parsing problem). 
    External errors come from Mesh and EDS (like an Oracle issue). If set to true the problematic message will be sent to failure queue.
    Otherwise the application will try to put it back on the queue process it again.][#110]

[#110]: https://github.com/Volue/energy-mesh-data-transfer/pull/110

## [MAR3.0.7] [TR3.0.4] [EDS3.0.4]

- [We have fixed an issue where CreationDate would be presented incorrectly in MessageLog.][#109]

[#109]: https://github.com/Volue/energy-mesh-data-transfer/pull/109


## [MAR3.0.6] [TR3.0.3] [EDS3.0.3]

- [We have fixed an issue that prevented AMQP receiver links from properly removing messages from the queue.][#104]

[#104]: https://github.com/Volue/energy-mesh-data-transfer/pull/104

## [MAR3.0.5] [TR3.0.2] [EDS3.0.2]

- [We have fixed an issue with common config that stopped is from being recognized.][#99]

[#99]: https://github.com/Volue/energy-mesh-data-transfer/pull/99

## [MAR3.0.4]

- [We have added a configuration file option to enable/disable reimport.][#98]

[#98]: https://github.com/Volue/energy-mesh-data-transfer/pull/98

## [TR3.0.1] [MAR3.0.3] [EDS3.0.1]

- [We have fixed a problem with service logs not being written to log files.][#97]

[#97]: https://github.com/Volue/energy-mesh-data-transfer/pull/97

## [MAR3.0.2]

- [We have added experimental support for Open Telemetry tracing and metrics.][#74]

New `OpenTelemetry` can be used in the MAR configuration file. 
It offers following options:
```
  "OpenTelemetry": {
    "UseTraces": true, // Enable traces
    "UseMetrics":  true, // Enable metrics
    "MetricsEndpoint": "http://localhost:3303" //Endpoint for metrics reading. 
  }
```

[#74]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/74

## [MAR3.0.1]

- [We have fixed an issue where MAR would store imported files in wrong directory.][#96]

[#96]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/96

## [TR3.0.0] [MAR3.0.0] [EDS3.0.0]

- [We have added support for reimport functionality. Data transfer services from now on require Mesh 2.5.2 or newer to work.][#72]

Import Worker settings must contain `ICC_TRANSLOG_DIR`

[#72]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/72

## [TR2.0.7] 

- [We have fixed an issue that caused MessageId to be an empty GUID when exporting timeseries.][#70]

[#70]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/70

## [TR2.0.6] [MAR2.0.8] [EDS2.0.13]

### Changed

- [We have changed appsettings.json organisation. Now common parts of the configuration can be kept in src/CommonConfig/appsettings_common.json. Also developers can use VOLUE_IMPORTEXPORT_COMMON_CONFIG_PATH environmental variable to change the common config directory in the development process.][#54]

[#54]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/54

## [MAR2.0.7] [EDS2.0.12]

- [We have increased max HTTP body request size from 28.6 MB to 2048 MB][#68]

[#68]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/68

## [EDS2.0.11]

- [We have fixed CREATION_DATE in MESSAGE_HEADER table][#67]

[#67]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/67

## [EDS2.0.10]

- [We have changed Unit Schedule path and added Err values to dinamici file.][#64]

[#64]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/64

## [EDS2.0.9]

- [We have changed the format of Bidding Strategy export. We filled the US parameter and moved it to the giorno node.][#63]

[#63]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/63

## [TR2.0.5] [MAR2.0.6] [EDS2.0.8]

### Fixed

- [We have changed an internal AMQP Session parameter responsible for maximal number of queues attached to the session from 10 to 30.][#62]

[#62]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/62

## [MAR2.0.5] [EDS2.0.7] - 2022-02-09

### Fixed

- [We have added a property validator attribute that supports local and network volumes. Fixed internal enum translation problem][#60]

[#60]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/60

## [EDS2.0.6] - 2022-02-07

### Added

- [We have added a possiblity to store Standard Export content on the disk.][#59]

[#59]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/59

## [EDS2.0.5] - 2022-02-04

### Fixed

- [We have fixed an issue where StorePath network storage volumes parsing would not work. Disk space health check removed.][#57]

[#57]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/57

## [EDS2.0.4] - 2022-02-03

### Fixed

- [We have fixed an issue where network storage volumes in StorePath would stop EDS from starting][#56]

[#56]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/56

## [TR2.0.4] [EDS2.0.3] - 2022-02-01

### Changed

- [We have changed bidding strategy export according to the new requirements provided by Enel][#49]

[#49]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/49

## [MAR2.0.4] [TR2.0.3] [EDS2.0.2] - 2022-02-01

### Fixed

- [We have fixed an issue where services would not log configuration validation errors][#50]

[#50]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/50/

## [MAR2.0.3] [TR2.0.2] - 2022-21-01

### Added

- [We have added support for multiple import queues with priorities. Introduced configuration parameter called `Priority`. Full description on how to use it in README][#42]

[#42]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/42

## [EDS2.0.1] - 2022-14-01

### Fixed

- [Fix month format in directory names for month numbers < 10][#45]

[#45]: https://github.com/PowelAS/sme-mesh-data-transfer/pull/45
