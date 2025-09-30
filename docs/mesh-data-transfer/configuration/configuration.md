## Configuration

### Logging

The logging functionality in Mesh Data Transfer is provided by the Serilog library.

```json
 "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
```
`MinimumLevel` options sets the minimum severity level of messages that will be put in the log.
Serilog supports 5 different logging levels: `Verbose`, `Debug`, `Information`, `Warning`, `Error` and `Fatal`. 
This option can be changed at the runtime and will take effect immediately.

```json
    },
    "Enrich": [ "WithMachineName", "WithProcessName", "WithThreadId" ],
```
`Enrich` specifies additional information that will be added to all log entries. For more information refer to enrichers [documentation](https://github.com/serilog/serilog/wiki/Enrichment).

```json
    "WriteTo": [
```
`WriteTo` section specifies list of all destination that logs will be saved to. By default the only destination is `File`. Other possible and useful option could be `Console`.

```json
      {
        "Name": "File",
        "Args": {
          "path": ".\\log.json",
          "formatter": "Serilog.Formatting.Json.JsonFormatter, Serilog"
```
`path` defines location and name of the log file.
`formatter` defines the way of storing log data. By default logs are stored as a json file. For more options refer to formatters [documentation](https://github.com/serilog/serilog/wiki/Formatting-Output).
Other useful options in `Args` section are:
- `rollOnFileSizeLimit` - enables log rotation when `fileSizeLimitBytes` is reached (bool, default is false),
- `fileSizeLimitBytes` - specifies maximum size of log file in bytes (default is 1 GB),
- `retainedFileCountLimit` - specifies how many log files will be kept (default value is 31, use `null` to disable the limit),
- `rollingInterval` - enables log rotation when specific interval elapses (e.g. `Day`, `Month`, `Year`).

More information can be found in serilog file sink [documentation](https://github.com/serilog/serilog-sinks-file).

### Brokers Configuration

Mesh Data Transfer service operates on AMQP entities. AMQP broker is a piece of software capable of relaying messages from one service to another.
`BrokersConfiguration` configuration item allows the user to specify broker connection strings - more than one connection string is allowed.
In case of connection failure, the service will choose the next connection string from the list and will try to establish a new connection.

```json
  "BrokersConfiguration": {
    "B1": {
      "ConnectionStrings": [
        "amqp://localhost:5672",
        "amqp://otherhost:5672"
      ]
    },
    "B2": {
      "ConnectionStrings": [
        "amqp://localhost:5672"
      ]
    }
  },
```

Each connection string should start with:
- `amqp://` - Non secure amqp connection will be created. Messages will be sent using AMQP protocol.
- `amqps://` - Secure amqp connection will be created. Messages will be sent using AMQP protocol.
- `Endpoint=sb://` - Instead of using AMQP protocol, Azure Service Bus communication library will be used for connection and messaging.

We support RabbitMQ Virtual Host feature (see [RabbitMQ docs](https://www.rabbitmq.com/docs/vhosts)). Example Virtual Host configuration:

```json
  "BrokersConfiguration": {
    "B1": {
      "ConnectionStrings": [
        "amqp://localhost:5672",
        "amqp://otherhost:5672"
      ],
      "VirtualHost": "Virtus"
    }
  },
```

### Queues Configuration

Mesh Data Transfer allows a configuration of queues that can be later assigned to various components.
Each json object in `Queues Configuration` describes a single queue. It can have any name that is unique within `Queues Configuration`.

```json
"QueuesConfiguration": {
    "Queue1": {
      "Broker": "B1",
```

`Broker` is a reference to one of the broker names defined in the `BrokersConfiguration`, for example `B1`.

```json
      "QueueName": "exportQueue",
```

`QueueName` specifies a queue to connect to on the broker. In case of Azure Service Bus, it can be both the name of the queue or the topic (see the description of `Subscription` parameter below).

```json
      "Role": "Sender",
```

`Role` specifies whether this queue will be used to send to or receive from. Valid values are: `Sender`, `Receiver`, `Failure`, `Confirmation` and `ReimportSender`.

```json
      "Priority": 0
```

`Priority` is an integer used for indicating import queue priority. The lower the number, the more important given queue is. Mesh Data Transfer processes messages placed in the queues with higher priority before messages placed in the queues with lower priorities. Default `Priority` is 50.

```json
      "Subscription": "Sub1"
```

`Subscription` enables the use of Azure Service Bus Topics feature. When `Subscription` is provided, the `QueueName` parameters serves as the topic name. `Subscription` is only valid for queues with the `Receive` role. For the `Sender` role, `QueueName` can serve both as the queue name and the topic name.

### Kestrel Configuration

`Kestrel` is an HTTP server used by Mesh Data Transfer in order to expose the endpoint for receiving the orders and for the health endpoint.

```json
"Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:7000"
```
`Url` specifies address and port that should be used when accessing the service. The `Url` specification may influence the ability to listen for exports coming from external machines. For most cases it is reasonable to replace `localhost` with server `hostname`.

### Mesh connection configuration 

```json
"HttpEndpoints": {
  "Mesh": {
    "Uri": "https://localhost:50001/mesh",
    "ServerPrincipal": "HOST/server.mydomain.com",
    "TokenRefreshIntervalMinutes": 30,
    "RequestTimeout": 60,
    "MaxReceiveMessageSizeInBytes": 16777216,
    "MaxRetryAttempts": 5
  }
},
```

`HttpEndpoints:Mesh:Uri` contains the address of `Mesh` server endpoint that is used for all the exports and imports of data.
Use `https` in the `Uri` to enable Transport Layer Security (TLS) and communicate with Mesh over secure channel.

`HttpEndpoints:Mesh:ServerPrincipal` field should be set if the user wants to enable Kerberos authentication.
The value should be set to Kerberos server principal of the Mesh server.
`HttpEndpoints:Mesh:TokenRefreshIntervalMinutes` is the refresh period of the Kerberos token. By default it is set to 30 minutes.

`HttpEndpoints:Mesh:MaxReceiveMessageSizeInBytes` is an optional size limit for the messages received from Mesh (e.g. time series export response). Defaults to 4 MB (4194304 bytes) when not provided. The example extends the received message size limit to 16 MB.

`HttpEndpoints:Mesh:MaxRetryAttempts` is an optional retry count for messages that fail to reach Mesh due to transient errors (when Mesh is not accessible). Defaults to 5 attempts.

`HttpEndpoints:Mesh` can specify an optional `RequestTimeout` attribute (defaults to `60`).

Additionally, `MeshMonitor` contains the address of `Mesh` server health endpoint. It is used to establish whether `Mesh` is in suitable condition to perform exports and imports.

```json
  "MeshMonitor": {
    "MeshHealthEndpoint": "http://localhost:20000/meshHealth/health",
    "CheckInterval": 5000
  }
```

### Database Configuration

The Mesh Data Transfer service requires direct database access. Currently data required to access the database is stored in the configuration file.

```json
"Database": {
    "User": "dbuser",
    "Password": "dbpass",
    "DataSource": "dbserver",
    "OpunKeyMode": "SHORNAME", // legal values: SHORNAME/BANKACC/POSTACC/ESETT_ID, SHORNAME is default if not specified
    "ReadOnly": false // optional parameter that disables database modifications when true, default value is false; NOTE: it does not impose read only mode in Mesh! 
  }
```

### Import and export common configuration

`FailedMessages` section defines how the errors are handled when import requests are processed. Internal errors are the ones that originated from the inside of Mesh Data Transfer (for example `XML`/`JSON` parsing problem). 
External errors come from `Mesh`. If set to true the problematic message is sent to the failure queue.
Otherwise the application tries to put the message back on the queue to process it again later.

```json
  "FailedMessages": {
    "UseFailureQueueOnInternalError": true,
    "UseFailureQueueOnExternalError": false
  },
```

The `ServiceBus` node is used to configure the behaviour of Service Bus communication.
- The `PrefetchCount` parameter adjusts the number of messages prefetched and cached before the actual message is requested. Default number is 0, meaning no prefetch.
- `MaxRetries` defines how many times the service should retry an operation on transient network issues.
- `MaxRetryDelay` controls the maximum delay (in milliseconds) between retry attempts when transient network issues happen. Default is 10 seconds (10000 ms).


```json
"ServiceBus": {
  "PrefetchCount": 3,
  "MaxRetries": 3,
  "MaxRetryDelay": 10000
}

```

The `Amqp:FrameTracingEnabled` flag can be used to debug low level communication issues with AMQP brokers.

```json
"Amqp": {
  "FrameTracingEnabled": false
}
```

### Import specific configuration 

`ImportWorker` is used to handle import requests. 

```json
  "ImportWorker": {
    "Queues": [
      "Q3",
      "Q4",
      "FailureQ"
    ],
    "ICC_TRANSLOG_DIR": "C:\\ICC_TRANSLOG_DIR\\",
    "ReimportEnabled": false,
    "PartialImportSuccess": false,
    "Delay": 100,
    "DisableImportReply": false,
    "ReceiveTimeout": 1000
  },
```

In order to work properly it needs `Queues` to contain a list of queues from `QueuesConfiguration`. One of the queues needs to be a `Receiver` queue which will be used to receive import orders. Another queue needs to be a `Sender` queue, used for sending import status data.
The third, optional queue, needs to be a `Failure` queue. Its use depends on `FailedMessages` node below.
If `ReimportEnabled` flag is set to `true`, `ICC_TRANSLOG_DIR` is a directory where received import requests are kept for potential reimports.
`PartialImportSuccess` is an optional flag that makes Mesh Data Transfer include `<ImportSuccess>true</ImportSuccess>` in the time series import reply when the import was partially successful. The default value is `false`, which means `ImportSuccess` is `true` only when all of the requested time series were imported correctly.
The `Delay` parameter is used to control the timeout between the import requests.
`DisableImportReply` is an optional flag used to disable the confirmation reply when the import request was processed successfully and an error reply when the import request had invalid syntax and could not be deserialized. It doesn't affect failure queue replies. Defaults to false.
The ReceiveTimeout parameter controls the timeout of a message receive call. The unit is milliseconds. Default value is 100 milliseconds.

`AmqpSender` is used to send reimport requests and availability confirmation messages to the queues. 

```json
"AmqpSender": {
  "Queues": [
    "ExportQueue"
  ]
},
```

The `Queues` array is expected to contain the names of the queues defined in `QueuesConfiguration` section with `Sender` role.

### Export specific configuration

```json
"AdditionalPvplanPrefix": {
  "Separator": ";"
},
```

`AdditionalPvplanPrefix:Separator` is a character used in the Participant application export definition. It separates the External Reference from prefix string being added to the PVPLAN data file names.

```json
"ContentCode": {
  "Separator":  ";"
},
```

`ContentCode:Separator` is a character used in the Participant application export definition. It separates the Product Code from exact protocol name ('APOR' or 'APOT') in case of APOR/APOT exports.

```json
"ParticipantSettings": {
  "DefaultSender": 26,
  "EDI_DEFAULT_IDORG": "9::14::UNOC:3:",
  "EDI_COUNTRY_IDORG": {
    "SE": "260:SVK:ZZ::UNOC:3:"
  },
  "EDI_CODELIST_RESPONSIBLE": "91"
}
```

`ParticipantSettings:DefaultSender` specifies the default sender to be used when exporting time series or availability data. The `DefaultSender` participant key is used as a fallback when the sender is not defined in the time series export definition or in the export request.

`ParticipantSettins:EDI_DEFAULT_IDORG`, `ParticipantSettings:EDI_COUNTRY_IDORG` and `ParticipantSettings:EDI_CODELIST_RESPONSIBLE` are relevant for EDIEL DELFOR and MSCONS time series exports. `EDI_DEFAULT_IDORG` stores the default string used to specify values in the UNB segment and the NAD segment in the EDIFACT message. `EDI_COUNTRY_IDORG` is a dictionary that maps a country key to a custom `IDORG` value. `EDI_CODELIST_RESPONSIBLE` is the value for code list responsible used when exported time series external reference is not an EAN number and the receiver has no code list responsible defined.

`MercatoMapping` is used only for Bidding Strategy export protocol. It associates numbers with user-defined strings.
They are used later in the Bidding Strategy export file to map timeseries values to strings.

```json
  "MercatoMapping": {
    "0": "MGP",
    "1": "MI1",
    "2": "MI2",
    "3": "MI3",
    "4": "MI4",
    "5": "MI5",
    "6": "MI6",
    "7": "MI7",
    "8": ""
  },
```

`UnitScheduleMapping` is similar to `MercatoMapping`. It is used for Bidding Strategy export protocol as well.

```json
  "UnitScheduleMapping": {
    "A": "dummyA",
    "B": "dummyB"
  },
```

`StoragePerProtocol` node contains storage settings for each protocol. `StorageKinds` valid values are `File` and `Queue` - it is allowed to specify the target storage: filesystem, AMQP/ServiceBus queue or both.
Parameter called `StoragePath` specifies disk storage location in case of the `StorageKinds` array containing a `File` value. 

`DestinationQueues` is a (protocol, receiver)-to-queue mapping. It is a dictionary consisting of keys being export receiver identfiers and values being queue aliases arrays.
When the `DestinationQueues` contains a key equal to an export receiver value for given export protocol, the export data will be sent to the queues in the respective array.

In the `StoragePerProtocol` nodes there is also an array called `DefaultQueues`.
If the `DestinationQueues` mapping does not provide target queue information needed, `DefaultQueues` values are used as target queues.

It is allowed to have one of (`DestinationQueues`, `DefaultQueues`) empty, but not both.

Another parameter for `StoragePerProtocol` nodes is `DefaultDecimals`. It defines the number of decimals that is saved in the exported time series values if the decimals parameter is not defined in the time series export definition. It is optional and currently it is only supported for EDIEL DELFOR, ExcelCSV and GS2 export types.

`ICC_TRANSLOG_DIR` is a directory where export files are kept in order to look them up from MessageLog application.
Please make sure that these directories are created.
`AvailabilityExportQueue` is a reference to one of the queues defined in `QueuesConfiguration` item.
```json
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
    },
    "GS2": {
      "StorageKinds": [ "File" ],
      "StorePath": "C:\\files\\",
      "DefaultDecimals": 3 // optional, used when the time series export definition does not define the decimals parameter; for GS2 the default value is null (number of decimals not specified)
    },
    "EdielDelfor": {
      "StorageKinds": [ "File" ],
      "StorePath": "C:\\files\\",
      "DefaultDecimals": 2 // optional, used when the time series export definition does not define the decimals parameter; for EDIEL DELFOR the default value is 3
    },
    "ExcelCSV": {
      "StorageKinds": [ "File" ],
      "StorePath": "C:\\files\\"
      "DefaultDecimals": 2, // optional, used when the time series export definition does not define the decimals parameter; for Excel CSV the default value is 6
    }
  },
  "ICC_TRANSLOG_DIR": "C:\\ICC_TRANSLOG_DIR\\",
  "AvailabilityExportQueue": "Q",
  "PvPlan2023": false
}
```

The Time Series Volumes Web Service export can be configured in the `TsVolumesWebServiceExport` section:

```json
"TsVolumesWebServiceExport": {
  "DefaultAddress": "http://localhost:8181/TSVolumesWS",
  "ParticipantAddresses": {
    "13": "http://localhost:8182/TSVolumesWS"
  }
}
```

If the export receiver is found in `ParticipantAddresses`, its corresponding address is used as the export target. Otherwise, the `DefaultAddress` is used.

## Recommended Kerberos authorisation settings

There are two main approaches to configure data-transfer services:
* Install data-transfer to run as the `LocalSystem` account (when Mesh and data-transfer are on the same server)
* Install data-transfer to run as a dedicated account (same server/separate servers configurations)

Then, it is required to set the authorisation scopes in the Mesh groups file (defined in the `GroupsFile` authorisation setting of Mesh).
When data-transfer is running as `LocalSystem`, use the group name `System`.
Otherwise, use the dedicated group name.
