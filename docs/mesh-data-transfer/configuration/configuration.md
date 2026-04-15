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
If the sections or any parameters within the section is not present, they are ignored. 

Note! If a protocol is configured to export to a queue defined in the BrokersConfiguration section, the configuration is mandatory.

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

#### Queue Durability Configuration

The `Durable` parameter allows you to configure queue persistence for AMQP/RabbitMQ connections. This setting determines whether queues survive broker restarts.

**Note:** This parameter applies only to AMQP/RabbitMQ connections and is ignored for Azure Service Bus.

```json
  "BrokersConfiguration": {
    "B1": {
      "ConnectionStrings": [
        "amqp://localhost:5672"
      ],
      "VirtualHost": "Virtus",
      "Durable": 1
    }
  },
```

Valid values for `Durable`:
- `0` - **Non-durable** (default): Transient link. Does not persist across broker restarts.
- `1` - **Durable**: Persistent link. Broker retains state and messages after restart.
- `2` - **Transient**: Temporary link optimized for short-lived sessions. No persistence.

If not specified, the default value is `0` (non-durable).

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

```json
      "ReplyQueueName": "ReplyQueue1",
      "FailureQueueName": "FailureQueue1"
```

`ReplyQueueName` and `FailureQueueName` are optional properties that specify which reply and failure queues should be used for a specific receiver queue. These properties enable source-specific message routing in import operations:

- **`ReplyQueueName`**: References a queue (by its identifier in `QueuesConfiguration`) with `Sender` role that will receive import reply messages for this receiver queue
- **`FailureQueueName`**: References a queue (by its identifier in `QueuesConfiguration`) with `Failure` role that will receive failed messages for this receiver queue

**Configuration Scenarios:**
1. **Explicit Configuration**: Directly reference existing queues to establish dedicated reply/failure channels
2. **Auto-creation**: If not specified and no suitable queues are found, MDT automatically creates queues with naming pattern: `{receiver-queue-name}-reply` and `{receiver-queue-name}-failure`
3. **Shared Queues**: Multiple receiver queues can reference the same reply or failure queue for consolidated processing
4. **Fallback**: Receiver queues without explicit configuration will use any available `Sender` or `Failure` role queues as fallback

**Example Configuration:**
```json
"QueuesConfiguration": {
  "SourceAReceiver": {
    "Broker": "B1",
    "QueueName": "source-a-input",
    "Role": "Receiver",
    "ReplyQueueName": "SourceAReply",
    "FailureQueueName": "CommonFailure"
  },
  "SourceAReply": {
    "Broker": "B1",
    "QueueName": "source-a-replies",
    "Role": "Sender"
  },
  "CommonFailure": {
    "Broker": "B1",
    "QueueName": "all-failures",
    "Role": "Failure"
  }
}
```

This feature is particularly useful in multi-tenant or multi-source scenarios where different import sources require isolated reply channels.

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
    "AuthType": "Kerberos",
    "ServerPrincipal": "HOST/server.mydomain.com",
    "TokenRefreshIntervalMinutes": 30,
    "RequestTimeout": 60,
    "MaxReceiveMessageSizeInBytes": 16777216,
    "MaxRetryAttempts": 5
  }
},
```

#### Authentication Configuration

Mesh Data Transfer supports three authentication types for the Mesh gRPC connection:
- `None` - No authentication (default)
- `Kerberos` - Windows/Kerberos authentication
- `EntraId` - Entra ID/OAuth authentication

Set `HttpEndpoints:Mesh:AuthType` to the desired authentication method.

The same `AuthType` also controls authentication for the **MDT REST API** (see [MDT REST API Authentication](#mdt-rest-api-authentication) below).

##### Kerberos Authentication

For Kerberos authentication, set:
- `AuthType` to `"Kerberos"`
- `ServerPrincipal` to the Kerberos server principal of the Mesh server (e.g., `"HOST/server.mydomain.com"`)

```json
"HttpEndpoints": {
  "Mesh": {
    "Uri": "https://localhost:50001/mesh",
    "AuthType": "Kerberos",
    "ServerPrincipal": "HOST/server.mydomain.com",
    "TokenRefreshIntervalMinutes": 30
  }
}
```

**Note:** For backward compatibility, if `ServerPrincipal` is set without `AuthType`, Kerberos authentication will be used automatically.

##### EntraId Authentication

EntraId credentials are configured in a dedicated top-level `EntraId` section (not under `HttpEndpoints:Mesh`).

**With client secret:**
```json
"HttpEndpoints": {
  "Mesh": {
    "Uri": "https://localhost:50001/mesh",
    "AuthType": "EntraId",
    "TokenRefreshIntervalMinutes": 30
  }
},
"EntraId": {
  "TenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientSecret": "your-client-secret",
  "Scopes": [
    { "Role": "Mesh", "Value": "api://mesh/.default" }
  ]
}
```

**With certificate file (.pfx/.pem):**
```json
"EntraId": {
  "TenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "CertificatePath": "/path/to/certificate.pfx",
  "CertificatePassword": "certificate-password",
  "Scopes": [
    { "Role": "Mesh", "Value": "api://mesh/.default" }
  ]
}
```

**With certificate from Windows certificate store:**
```json
"EntraId": {
  "TenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "CertificateThumbprint": "1234567890ABCDEF1234567890ABCDEF12345678",
  "CertificateStoreLocation": "CurrentUser",
  "CertificateStoreName": "My",
  "Scopes": [
    { "Role": "Mesh", "Value": "api://mesh/.default" }
  ]
}
```

The `Mesh` scope is used for the gRPC connection to the Mesh server. Additional roles (`Api`, `ServiceBus`, `Storage`) can be added to the `Scopes` list to enable Entra ID authentication for the HTTP API, Azure Service Bus, and Azure Blob Storage respectively — see the [Azure Service Bus and Blob Storage](#azure-service-bus-and-blob-storage-entra-id) section.

**Security Note:** Store sensitive credentials like `ClientSecret` and `CertificatePassword` securely using Azure Key Vault, environment variables, or other secure configuration providers. Do not commit secrets to source control.

#### MDT REST API Authentication

MDT REST API endpoints can be independently secured using `ApiSettings:RequireAuthentication`. When enabled, all endpoints except `/health` require authentication. The `AuthType` set in `HttpEndpoints:Mesh` determines the scheme used.

```json
"ApiSettings": {
  "EnableSwagger": true,
  "RequireAuthentication": true
}
```

##### No Authentication (default)

```json
{
  "HttpEndpoints": { "Mesh": { "Uri": "...", "AuthType": "None" } },
  "ApiSettings": { "RequireAuthentication": false }
}
```

##### Kerberos (Windows integrated authentication)

```json
{
  "HttpEndpoints": {
    "Mesh": { "Uri": "...", "AuthType": "Kerberos", "ServerPrincipal": "HOST/server.mydomain.com" }
  },
  "ApiSettings": { "RequireAuthentication": true }
}
```

Swagger UI will prompt for Windows credentials using the Negotiate scheme.

##### EntraId (OAuth 2.0)

```json
{
  "HttpEndpoints": { "Mesh": { "Uri": "...", "AuthType": "EntraId" } },
  "EntraId": {
    "TenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "ClientSecret": "your-client-secret",
    "Scopes": [
      { "Role": "Mesh", "Value": "api://mesh/.default" },
      { "Role": "Api",  "Value": "api://<this-app-id>/.default" }
    ]
  },
  "ApiSettings": { "RequireAuthentication": true }
}
```

When `AuthType` is `EntraId`, Swagger UI is automatically configured with an OAuth 2.0 Authorization Code + PKCE flow:

1. Navigate to Swagger UI (e.g., `http://localhost:7000/swagger`)
2. Click the **Authorize** button
3. Complete the Microsoft login flow and consent to requested permissions
4. The access token is automatically included in subsequent API requests

#### Other Mesh Configuration Options

`HttpEndpoints:Mesh:TokenRefreshIntervalMinutes` is the refresh period for authentication tokens. Defaults to 30 minutes.


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

### JSON time series import

Mesh Data Transfer supports importing time series data sent as Volue time series JSON AMQP messages. The message contains a header (origin, document identification, creation date) and one or more time series, each with a `TSReference` path pointing to the target Mesh time series, a time interval, and a list of value points.

#### AMQP message type annotation

To have the message recognized and processed as a Volue time series JSON import, the AMQP message must include a message annotation with the key `Action` set to `MeshTimeSeriesJson`:

```
Message annotation key:   Action
Message annotation value: MeshTimeSeriesJson
```

Messages without this annotation are treated as standard XML time series imports.

#### Quality flags

Each value point may include a quality string. Supported values are:

| Quality     | Description                                 |
|-------------|---------------------------------------------|
| `OK`        | Good quality — no quality bits set          |
| `Temporary` | Value is provisional                        |
| `Suspect`   | Value is suspect                            |
| `Missing`   | Value is missing                            |

Quality strings are mapped to Mesh flag bits using the status mapping defined for the transfer definition in the database (`tsstatus` table). If no quality is specified, or the value is `OK`, no quality bits are set. If a quality string is not found in the database mapping, the point is flagged as `Suspect` to avoid silently treating uncertain data as good quality.

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
    "CreateTransLogFile": true,
    "PartialImportSuccess": false,
    "Delay": 100,
    "DisableImportReply": false,
    "ReceiveTimeout": 1000
  },
```

In order to work properly it needs `Queues` to contain a list of queues from `QueuesConfiguration`. One of the queues needs to be a `Receiver` queue which will be used to receive import orders. Another queue needs to be a `Sender` queue, used for sending import status data.
The third, optional queue, needs to be a `Failure` queue. Its use depends on `FailedMessages` node below.

**Reply and Failure Queue Routing:**
- If receiver queues specify `ReplyQueueName` or `FailureQueueName` properties, those specific queues will be used for reply/failure messages
- If not specified, `ImportWorker` will:
  1. Look for queues with `Sender` role (for replies) or `Failure` role (for failures) in the `Queues` list
  2. Automatically create source-specific queues with naming pattern `{receiver-queue}-reply` and `{receiver-queue}-failure` if needed
- Multiple receiver queues can share the same reply or failure queue by referencing the same queue identifier
- This enables proper message routing in multi-tenant or multi-source scenarios

`CreateTransLogFile` is an optional flag which default value is set to true. If `CreateTransLogFile` flag is set to `true`, `ICC_TRANSLOG_DIR` is a directory where received import requests are kept for potential reimports. If `CreateTransLogFile` flag is set to `false`, files will not be created and `reimport` will not be available.
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

#### MeshTimeSeriesJson export to Azure Blob Storage

The `MeshTimeSeriesJson` protocol (ID 141) exports raw JSON directly to Azure Blob Storage and sends a lightweight notification containing the blob SAS URL to the configured AMQP queue.

Minimum configuration in `Storage:StoragePerProtocol`:

```json
"MeshTimeSeriesJson": {
  "StorageKinds": [ "Queue" ],
  "DefaultQueues": [ "ExportReplyQueue" ],
  "BlobContainer": "meshjson-exports"
}
```

The blob container is created automatically on first use. The queue notification carries the SAS URL in the `BlobPath` AMQP message annotation.

For local development with [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite), set `Storage:BlobConnectionString` to the Azurite connection string:

```json
"Storage": {
  "BlobConnectionString": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=<key>;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
}
```

For production with Entra ID passwordless authentication, see the [Azure Service Bus and Blob Storage Entra ID section](#azure-service-bus-and-blob-storage-entra-id) below.

#### Azure Service Bus and Blob Storage Entra ID

Both Azure Service Bus (broker transport) and Azure Blob Storage (blob uploads) support passwordless Entra ID authentication using the shared `EntraId` configuration section.

Add the relevant scopes to `EntraId:Scopes`:

```json
"EntraId": {
  "TenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ClientSecret": "your-client-secret",
  "Scopes": [
    { "Role": "Mesh",       "Value": "api://<mesh-app-id>/.default" },
    { "Role": "Api",        "Value": "api://<this-app-id>/.default" },
    { "Role": "ServiceBus", "Value": "https://servicebus.azure.net/.default" },
    { "Role": "Storage",    "Value": "https://storage.azure.com/.default" }
  ]
}
```

**Azure Service Bus**: Set the broker connection string to an `Endpoint=sb://...` string without `SharedAccessKey`. The application passes a `TokenCredential` into the Azure Service Bus SDK, which internally requests the appropriate scope (for example, `https://servicebus.azure.net/.default`); the `ServiceBus` scope entry in `EntraId:Scopes` is not used by the current implementation. The app registration must be assigned the **Azure Service Bus Data Owner** role on the namespace.

**Azure Blob Storage**: Set `Storage:BlobConnectionString` to the blob service endpoint URI (no `AccountKey`). The application passes a `TokenCredential` into the Azure Storage SDK, which internally requests the appropriate scope (for example, `https://storage.azure.com/.default`); the `Storage` scope entry in `EntraId:Scopes` is not used by the current implementation. The app registration must be assigned the **Storage Blob Data Contributor** role on the storage account:

```json
"Storage": {
  "BlobConnectionString": "https://<account>.blob.core.windows.net/"
}
```

When `BlobConnectionString` contains an `AccountKey`, key-based authentication is used automatically (Azurite / development scenarios). Entra ID is only activated when the key is absent.

#### Azure Blob Storage for Large Messages

When using Azure Service Bus, there is a message size limit that may be exceeded by large export files. To handle this, you can configure Azure Blob Storage:

- **`BlobContainer`** (per protocol): When specified in a protocol configuration, export messages are uploaded to Azure Blob Storage instead of being sent directly through the queue. The queue receives only a SAS token URL pointing to the blob.
- **`BlobConnectionString`** (global): Required when any protocol uses `BlobContainer`. This is the connection string to your Azure Storage account.

When a message is stored in blob storage:
1. The export content is uploaded to the specified container with optional compression
2. A SAS token with 1-year expiry is generated
3. The queue message contains only the blob URL in the `BlobPath` annotation
4. On import, the content is automatically downloaded from the blob storage

`ICC_TRANSLOG_DIR` is a directory where export files are kept in order to look them up from MessageLog application.
Please make sure that these directories are created.
`AvailabilityExportQueue` is a reference to one of the queues defined in `QueuesConfiguration` item.
If the sections or any parameters within the section is not present, they are ignored.
```json
"Storage": {
  "StoragePerProtocol": {
    "PVPLAN": {
      "StorageKinds": [ "Queue" ],
      "DestinationQueues": {
        "1": [ "exportReplyQueue" ],
        "13": [ "exportReplyQueue", "someOtherQueue" ]
      },
      "BlobContainer": "pvplan-exports" // Optional: Use blob storage for large messages
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
  "PvPlan2023": false,
  "BlobConnectionString": "DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=***;EndpointSuffix=core.windows.net",
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

### Installation dependencies

* Install Python proton package
  ```powershell
  python -m pip install python-qpid-proton
  ```
* TestWrapper requires Pester 5.0.0+ and jq package
  ```powershell
  Get-Module -ListAvailable Pester
  Install-Module -Name Pester -Force -SkipPublisherCheck
  choco install jq
  ```
* Use PowerShell version 7
  ```powershell
  $PSVersionTable
  ```

### Required running services

* Have DB container running on the PC before starting tests, connection details:
  ```json
  "User": "energy",
  "Password": "energy",
  "DataSource": "localhost:1600/energy"
  ```
  If running the db on a different port: 
  ```powershell
  $DBPort = 11521    
  ```
  * Use the ENEL DB: enel:20230815
  * If the tests have been run, recreate the existing docker container:
    * Stop the Mesh service
    * Stop the database container.
    * Delete the container, and confirm by pressing the `Delete forever` button.
    * Install the database docker image as described in https://github.com/Volue/energy-test-framework/tree/main/docker
      ```powershell
      docker run -d -p 1600:1521 --ulimit nofile=1024:65536 --ulimit nproc=2047:16384 --ulimit stack=10485760:33554432 --ulimit memlock=3221225472 --tmpfs "/dev/shm:exec,dev,suid" tdtrhatfdb01.voluead.volue.com/db/enel:20230815
      ```
    * Start the Mesh service
    * NB! Check that the Mesh service is ready with the startup process before starting a new test run:
      ```powershell
      Invoke-WebRequest -Uri "http://localhost:20000/meshHealth/health" -Method Get
      ```
* The following services must be configured correctly and be running:
  * Mesh
  * Mesh Data Transfer
* Optionally one can set up a message broker like RabbitMQ or Apache QPID AMQP broker.
    * Installing RabbitMQ with AMQP 1.0 support
    
  ```powershell
  choco install rabbitmq
  C:\Program Files\RabbitMQ Server\rabbitmq_server-3.12.10\sbin>rabbitmq-plugins.bat list
  C:\Program Files\RabbitMQ Server\rabbitmq_server-3.12.10\sbin>rabbitmq-plugins.bat enable rabbitmq_amqp1_0
  ```
* For export tests, make `export_files` directory in Mesh Data Transfer folder (f.ex. `C:\Dev\energy-mesh-data-transfer\src\MeshDataTransfer\bin\Release\net8.0\export_files`)

### Running tests

* Starting tests from `C:\Dev\energy-test-framework\tests` folder:
  ```powershell
  .\TestRunner.ps1 -ContextName mesh_datatransfer -dbg
  ```
