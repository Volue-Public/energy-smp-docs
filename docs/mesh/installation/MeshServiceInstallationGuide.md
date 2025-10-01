# Mesh Service Installation Guide

- [Mesh Service Installation Guide](#mesh-service-installation-guide)
  - [About this document](#about-this-document)
  - [Prerequisites](#prerequisites)
    - [System requirements](#system-requirements)
    - [Checklist before you start the installation](#checklist-before-you-start-the-installation)
    - [General setup](#general-setup)
      - [Hardware requirements](#hardware-requirements)
      - [Windows services and TCP communication](#windows-services-and-tcp-communication)
      - [Communication between Nimbus Client and Mesh server](#communication-between-nimbus-client-and-mesh-server)
  - [Install the Mesh Service](#install-the-mesh-service)
    - [Configuring core dump creation](#configuring-core-dump-creation)
  - [Configuration](#configuration)
    - [mesh.json - minimum version](#meshjson-minimum-version)
    - [Database connection](#database-connection)
    - [Mesh ports and authentication for ZMQ](#mesh-ports-and-authentication-for-zmq)
    - [Mesh gRPC server](#mesh-grpc-server)
      - [Enable the server and configure port numbers](#enable-the-server-and-configure-port-numbers)
    - [Use Transport Layer Security (TLS)](#use-transport-layer-security-tls)
      - [Certificates](#certificates)
      - [Loading certificates from file system](#loading-certificates-from-file-system)
      - [Windows Certificate Store](#windows-certificate-store)
    - [Authentication](#authentication)
      - [Kerberos](#kerberos)
      - [OAuth 2.0 access tokens](#oauth-20-access-tokens)
        - [Access token types](#access-token-types)
        - [Configuration](#oauth-configuration)
    - [Authorisation](#authorisation)
    - [Limit time series cache usage](#limit-time-series-cache-usage)
  - [Verify the installation](#verify-the-installation)
  - [Update the Mesh object model](#update-the-mesh-object-model)
  - [Error situations](#error-situations)
    - [General installation problems](#general-installation-problems)
    - [Problems related to Oracle 19](#problems-related-to-oracle-19)
  - [Security considerations](#security-considerations)
  - [mesh.json - complete](#meshjson-complete)
  - [Contact information](#contact-information)

<div style="page-break-after: always;"></div>

## About this document

This document describes how to install and upgrade the Mesh Service. Installation and upgrade follow the same steps. It is intended for a technical audience, to be used by system administrator/IT personnel or by Volue’s consultants.

## Prerequisites

### System requirements

- Operating system: Windows Server Standard 2019 or 2022, 64-bit
- SmG Database (with compatible SmG version)
- Microsoft Visual C++ Redistributable for Visual Studio 2015-2022
- .NET Framework 4.8

Database upgrades are done via the SmG database upgrade. Ensure you have the correct version of SmG, see latest release notes.

**Note!** Running more than one instance of Mesh against a single Oracle database may cause major errors. This configuration is only supported in some special cases.

### Checklist before you start the installation

Before installing the Mesh Service, ensure you have:

- Administrator access to the target server.
- The required Operating system installed on target server, see System requirements.
- The required Microsoft Visual C++ Redistributable installed on the target server, see System requirements.
- The information needed to connect to the Oracle database from the Mesh server. Usually a `TNSNAMES.ora` file, a database name, a username, and a password. The name of the directory containing `TNSNAMES.ora` should be specified in the `TNS_ADMIN` environment variable.
- The Mesh Service installation package.

### General setup

#### Hardware requirements

**Note!** You should dimension servers running Mesh to handle both high CPU load, expansive memory use and high I/O throughput regarding network interconnect towards the database. The results of requested calculations are kept in memory as much as possible; for this reason, we recommend a high amount of memory to gain optimal performance.

#### Windows services and TCP communication

Windows Firewall with Advanced Security: For remote calls, you must set an inbound rule, allowing TCP connections in the following default ports:

   |Port|Direction|Usage|
   |-|-|-|
   |1521|Outbound|Default port to access the Oracle database|
   |9000|Inbound|Http communication from Nimbus|
   |9001|Inbound|Net.Tcp communication from Nimbus|
   |20000|Inbound|Access to the Mesh health endpoint, used from Nimbus when failover is configured|
   |40321|Inbound|ZMQ communication|
   |50051|Inbound|Communication from clients using gRPC|

#### Communication between Nimbus Client and Mesh server

**Port 20000** must be open on the server where the Mesh server is installed in order to avoid performance issues in the Nimbus Client connected to Mesh. In addition, port 20000 is needed if failover of the Nimbus Client against the Mesh server is required.

<div style="page-break-after: always;"></div>

## Install the Mesh Service

**Mesh Service** is a Windows service. It can run as a user member of the local Administrator group or as a user with log on as a service rights.
The installer is distributed as a ZIP file named like Mesh-2.12.1.21.zip.
To install the Mesh Service:

1. Extract the zip file containing the installation package to desired location.
2. Navigate to this location and run:
  `.\mesh.ps1 -Install -UrlAclUser BUILTIN\Users`

This script will register necessary endpoints and create a Windows service named `Powel Mesh Service`.

### Configuring core dump creation

A core dump is an image of the process and all of its memory at a point in
time. These dumps make it significantly easier to debug and fix errors. We
recommend that all users enable automatic core dumps for the Mesh process,
and that core dumps for any crashes are sent to the Volue Support together
with the Mesh log and any information about what was happening in the system at
the time of the crash.

See https://docs.microsoft.com/en-us/windows/win32/wer/collecting-user-mode-dumps for more
information on how to collect core dumps. Alternatively set the following
registry values under `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\Windows Error Reporting\LocalDumps\Powel.Mesh.Server.exe`:

|Parameter|Type|Value|
|---|---|---|
|REG_EXPAND_SZ|DumpFolder|C:\MeshCoreDumps|
|REG_DWORD|DumpType|2|
|REG_DWORD|DumpCount|10|

The size of a Mesh core dump with the configuration above is equal to the
memory used by Mesh at the time of the dump. If disk space is an issue you
may reduce DumpCount, or set DumpType to 1 which makes the dumps smaller
but less useful.

<div style="page-break-after: always;"></div>

## Configuration

After the service is installed, the following configuration is required.

- Database connection
- Mesh ports and authentication for ZMQ
- Mesh gRPC server
- Use Transport Layer Security (TLS)
- Authentication
- Authorisation
- Limit cache

### mesh.json - minimum version

The Mesh configuration is defined in the `mesh.json` file which normally is located in the directory above the Mesh service application (`Powel.Mesh.Server.exe`).

A minimal configuration looks like this:

```json
{
    "Log": {
        "Console": true, // Log to stdout when not run as a service
        "WindowsEventLog": false, // Log to the Windows Event Log
        "Directory": "C:\\Powel\\Mesh\\logs", // Log to the given directory
        "Level": "info" // One of "trace", "debug", "info", "warning", "error", default "info"
    },
    "Oracle": {
        "Server": "<DatabaseServer>",
        "Username": "<DatabaseUser>",
        "Password": "<DatabasePassword>"
    },
    "Http": {
        "Port": 20000,
        "Kerberos": true,
        "Health": true // Enable the health endpoint.
    },
    "Grpc": {
        "Address": "[::]:50051",
        "Kerberos": true,
        "Tls": {
            "CertificatePath": "<PathToCertificateInPEMFormat>",
            "CertificateKeyPath": "<PathToPrivateKeyInPEMFormat>"
        }
    },
    "Zmq": {
        "Port": 40321,
        "Kerberos": true
    }
}
```

### Database connection

The Mesh database is part of the SmG database.
The Mesh service has to connect and operate on the SmG database as the SmG Schema Owner.

There are 2 ways of connecting to the database. Using credentials or using external authentication.
You define the database connection string in `mesh.json`:

#### Credentials

```json
  "Oracle": {
    "Server": "<Database>",
    "Username": "<DatabaseUser>",
    "Password": "<DatabasePassword>"
  },
```

Verify that the values in these files are correct by executing the following statement from command prompt:

```cmd
sqlplus <DatabaseUser>/<DatabasePassword>@<Database>
```

#### Oracle external authentication

To use it:
- The database server must be configured to support external authentication
  and the account running Mesh service must be granted proper privileges in
  the database. The following privileges are required:
  - `execute on sys.dbms_lock`
  - `execute on sys.dbms_change_notification`
  - `change notification`
- On the client side (i.e. server running Mesh service) the Oracle client
  must be configured to use NTS authentication. See `sqlnet.ora` file:
  ```
  SQLNET.AUTHENTICATION_SERVICES= (NTS)
  ```
- On the client side, set `ExternalCredentials` parameter to `true` in the
  `Oracle` section in `mesh.json` configuration file:
  ```json
  "Oracle": {
    "Server": "<Database>",
    "ExternalCredentials": true
  }
  ```

### Mesh ports and authentication for ZMQ

In the Mesh configuration file `mesh.json` the lines are used (with default values):

```json
  "Zmq": {
    "Threads": 8, //optional
    "Kerberos": true,
    "Port": 40321
  },
```

This defines which port Mesh use to listen for ZMQ requests. This port number must be the same in clients using ZMQ. The firewall must also be open on this port. Kerberization of ZMQ, is by default turned on. Clients using ZMQ are all Smart Power clients interfacing with Mesh, except Mesh Data Transfer.

### Mesh gRPC server

A gRPC interface is exposed for both external and internal usage.

There is also a gRPC client, **Mesh Python SDK**, that uses the gRPC interface and provides an easy and optimised way of working with Mesh for Python developers.

**Note!** The Mesh gRPC interface is still in alpha. The interface is changing rapidly, breaking changes are allowed and stability is not guaranteed nor expected.

#### Enable the server and configure port numbers

To enable Mesh gRPC server, configure the following lines in the Mesh configuration file `mesh.json`.

```json
  "Grpc": {
    "Kerberos": true,
    "OAuth": false,
    "Address": "[::]:50051",
    "Tls": {
      "CertificatePath": "<PathToCertificateInPEMFormat>",
      "CertificateKeyPath": "<PathToPrivateKeyInPEMFormat>"
    }
  },
```

This defines which port Mesh uses to listen for gRPC requests. This port number must be the same in the clients using gRPC. The firewall must also be open on this port. The example shows an unencrypted and unauthenticated configuration, and we highly recommend to both encrypt and authenticate/authorize the gRPC interface (see below for how to configure it).

### Use Transport Layer Security (TLS)

There are two possible types of connections to the gRPC server from the clients.

- An insecure, where data is unencrypted and sent as plaintext over the network, thus it is not recommended for production environment.
- A secure where the server is authenticated by the clients via the Transport Layer Security (TLS protocol) certificate and data is encrypted.

Mesh server gRPC interface can be configured to use Transport Layer Security (TLS) and if used then only TLS connections from the clients will be accepted.

The TLS server authentication serves two purposes:

- It authenticates the server, a client that connects to a server can verify the server's certificate and check if it is *trusted*.
- It encrypts the communication, by using HTTPS as a transport protocol. For security reasons, encryption is required for client authentication and authorisation.

#### Certificates

TLS uses X.509 digital certificates, further on referred as TLS certificate. Such certificate contains, among others, public key and information about the issuer. Additionally for each TLS certificate there is a corresponding private key. Contrary to the public key, it is a secret and must be kept secure.

The Mesh team requires/strongly advises to use certificates signed by publicly trusted Certificate Authorities (CAs). Such certificates can be obtained for free and they ensure no additional configuration is needed to be done on the client side in order to connect to a TLS secured Mesh gRPC server.

On the other hand using self-signed certificates, depending on the client environment, may require configuration work in order to connect to a TLS secured Mesh gRPC server. That is why we require/strongly suggest using the former type of certificates. For more information see the document about client certificates.

**Note!** As Volue we do not suggest using specific TLS certificate vendors. We provide a set of guidelines and requirements. The final decision belongs to the customer.

By default Mesh configuration (`mesh.json`) has the TLS enabled, but the certificate settings must be set manually for each environment.

There are two options to load the certificates.

#### Loading certificates from file system

Providing paths to certificate and private key in PEM format. The files mustn't be encrypted and must be accessible by the account that is running Mesh server.

```json
  "Grpc": {
    "Address": "[::]:50051",
    "Tls": {
      "CertificatePath": "C:\\certs\\certificate.crt",
      "CertificateKeyPath": "C:\\certs\\privatekey.pem"
    },
    ...
  },
```

For security reasons, access to private key MUST be restricted at the operating-system level.
Grant permissions only to the specific users or groups that require access (principle of least privilege).

#### Windows Certificate Store

Alternatively the certificates can be loaded from the Windows Certificate Store. To use it:

- The private key must be marked as "exportable" in the Windows Certificate Store.
- The certificate must have a corresponding private key defined in the Windows Certificate Store.
- The certificate must be accessible by the user account that is running Mesh. All current user certificate stores except the Current User/Personal store inherit the contents of the local machine certificate stores.

Moreover, currently the support is limited to private keys based on the RSA algorithm.

To enable reading certificate from the Windows Certificate Store you need to specify:

```json
  {
    "Grpc": {
      "Tls": {
        "WindowsCertStore": {
          "CertificateThumbprint": "142e888b1640210e83b1c21b6fc414aefb1f8813",
          "SystemStoreName": "ROOT"
        }
      },
      ...
    }
  }
```

Parameters:

- `CertificateThumbprint` is a 160 bit SHA1 hash. Listed in the certificate details section.
- `SystemStoreName` name of the system store. Some predefined system stores are:
  - `ROOT` - mapping to *Trusted Root Certification Authorities"
  - `MY` - mapping to Personal
  - `CA` - mapping to *Intermediate Certification Authorities"

### Authentication

Mesh server could be configured to protect its gRPC API so that only authenticated users that are assigned to specific roles can access it. There are two options:

- Kerberos
- OAuth 2.0 access tokens

**Note!** If the Mesh gRPC server is configured to use authentication, only authenticated users may work with Mesh.

#### Kerberos

Mesh authenticates users and grants access to specific APIs based on what AD groups the authenticated users belong to.

Configuration:

```json
  "Grpc": {
    "Address": "[::]:50051",
    "Tls": {
      "CertificatePath": "C:\\certs\\certificate.crt",
      "CertificateKeyPath": "C:\\certs\\privatekey.pem"
    },
    "Kerberos": true,
    "Authorization": {
      "GroupsFile": "roles_mapping.json"
    },
    ...
  }
```

If the gRPC client runs as "Local System" then in calls to Mesh it is represented as the machine account itself.
If Mesh service is running on the same machine then in such cases the gRPC client belongs to "System" group.
This is useful in cases where for example: customers do not want to create extra service accounts for Mesh Data Transfer services that are running locally.

Example groups file:

```json
{
  "Kerberos": {
    "Users": ["(time_series, read)", "(model, read)"],
    "Admins": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ],
    // For localhost services running as "Local System"
    "System": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ]
  }
}
```

Mesh clients need to provide a service principal name (SPN) when connecting to Mesh with Kerberos enabled.

**If Mesh is running as AD User:**

Start Windows Server PowerShell and enter:
```powershell
Get-ADUser -Filter {UserPrincipalName -eq "user.name@domain.com"} | Select-Object SamAccountName
```

Then check if SPN exists:

```powershell
setspn -L SamAccountName
setspn -L domain\SamAccountName
```

Depending on the SPN found, use it as the service principal name in clients like Mesh Data Transfer.

**If Mesh is running as a machine user (like Local System):** 

Then the service principal name will usually be `HOST/full.qualified.domain.name`
or `HOST/f.q.d.n@DOMAIN.COM` but it might be different in your environment.

#### OAuth 2.0 access tokens

The users authenticate and request access to Mesh from external authorisation servers, and Mesh validates the access token that is obtained from the authorisation server.

OAuth 2.0 is an industry-standard protocol for authorisation. Depending on the Identity Provider implementing the OAuth 2.0 protocol, there might be some differences in the access token structure, flows, etc. Implementation of Mesh server OAuth authorisation was tested against Microsoft Entra ID (previously known as Azure Active Directory) Identity Provider and supports:

- user access tokens acquired by using authorisation code flow (token version 1 and 2)
- application-only access tokens acquired by using client credentials flow (token version 1 and 2)

We do not guarantee that authorisation based on other Identity Providers will work.

##### Access token types

We distinguish between user and application-only access tokens:

- `User access token` - User tokens are used for flows like authorisation code flow where a user is authenticated and gives consent to the requested permissions. User access tokens must include scope (`scp` or `scope`) and `name` claims.
- `Application-only access tokens` - Application-only access tokens are acquired using client credentials flow. They are used in server-to-server interactions, where the client applications are referred to as *daemons* or *service accounts*. In this flow the client application is called confidential client. Contrary to user access tokens the application-only access tokens in Microsoft Entra do not contain scope (`scp` or `scope`) and `name` claims.
  
  Application-only access tokens have the same values of `sub` and `oid` claims. The client application must use authorisation based on *application permissions (app roles)*. With this approach the `roles` claim will be part of the access token.

##### OAuth configuration

To use it:

- An OAuth 2.0 JWT compatible access token must be signed using RSA algorithm.
- Authorisation is done using roles claim that must be part of the access token.
- Additionally, all access tokens must contain the following claims: oid, aud, iss and sub. All those claims must have string data types (not an array).
- Additionally, user access tokens must contain scope (scp or scope) and name claims. All those claims must have string data types (not an array).
- TLS connection must be enabled.

To enable OAuth support you need to specify (change the values according to customer's environment):

```json
  "Grpc": {
    "Address": "[::]:50051",
    "Tls": {
      "CertificatePath": "C:\\certs\\certificate.crt",
      "CertificateKeyPath": "C:\\certs\\privatekey.pem"
    },
    "OAuth": true,
    "Authorization": {
      "Audience": "api://CLIENT_ID",
      "JwksEndpoint": "https://login.microsoftonline.com/TENANT_ID/discovery/v2.0/keys",
      "Issuer": "https://sts.windows.net/TENANT_ID/",
      "Scope": "mesh.grpc", // this is required for user access tokens, not used for application-only access tokens
      "GroupsFile": "roles_mapping.json"
    },
    ...
  }
```

Note that Kerberos is enabled by default.

Parameters:

- `JwksEndpoint` - JSON Web Key Set (JWKS) endpoint URI. JWKS contains all public keys needed to validate (check signature) generated access token by the authorisation server.
- `Audience` - audience token claim. Must match aud token claim.
               Depending on the access token version, the expected format may be different.
               For v1.0 tokens it may have the “api://” prefix.
               For v2.0 tokens it is always just a client ID.
               It is best to check decode access token in e.g. jwt.io website and check the actual `aud` claim value.
- `Issuer` - issuer token claim. Must match iss token claim.
- `Scope` - scope token claim. Must match scp or scope token claim. The check is done only for user access tokens.
- `GroupsFile` - JSON file that maps roles to specific permissions in our API.
  Example groups file:

```json
{
  "OAuth": {
    "Users": ["(time_series, read)", "(model, read)"],
    "Admins": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ],
    "Daemons": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ]
  }
}
```


### Authorisation

We can limit access to Mesh functionality through the gRPC interface to the following groups:

- `time_series` - functionality accessing time series values.
- `model` - functionality accessing the model and model definition instances.

For each of these groups it is possible to limit access to the normal `CRUD` operations:

- `create` - functionality that will create new information.
- `read` - functionality that will read information without changing anything.
- `update` - functionality that will update existing information.
- `delete` - functionality that will delete existing information.

The `GroupsFile` defines the access to the different functionality for any user dependent on which `groups` or `roles` this user is assigned to in the company's user store. An example of such a definition is shown below giving all users in the `Users` group/role only read access to time series and model, while users in the `Admins` or `Daemons` group/role has full access to time series and model.

When a user is a member of multiple groups or assigned multiple roles, their effective access rights are the union of the rights granted by each group and role.

For security reasons, access to `GroupsFile` MUST be restricted at the operating-system level.
Grant permissions only to the specific users or groups that require access (principle of least privilege).

The Kerberos group names and OAuth roles mappings are defined separately.

```json
{
  "Kerberos": {
    "Users": ["(time_series, read)", "(model, read)"],
    "Admins": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ],
    "Daemons": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ],
    // For localhost services running as "Local System"
    "System": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ]
  },
  // if both OAuth and Kerberos are enabled:
  "OAuth": {
    "OAuthUsers": ["(time_series, read)", "(model, read)"],
    "Admins": [
      "(time_series, create)",
      "(time_series, read)",
      "(time_series, update)",
      "(time_series, delete)",
      "(model, create)",
      "(model, read)",
      "(model, update)",
      "(model, delete)"
    ]
  }
}
```

### Limit time series cache usage

By default, Mesh will read into memory all time series values found in the database for the requested time series and these values will stay in memory as long as the service is running.

It is possible to limit/control the memory usage by the cache by adding the following configuration:

```json
  "SharedPointCache": {
    "LimitMb": 1000,
    "DefaultIntervalDays": 20,
    "PreloadAllTimeSeries": false,
    "PreloadPreviousState": false,
    "CacheStateFileDirectory": "<path>"
  },
```

Parameters:

- `LimitMb` - the maximum number of megabytes allowed in the shared point cache.
- `DefaultIntervalDays` - when the preloading is enabled Mesh will not preload points before now minus the configured number of days.
- `PreloadAllTimeSeries` - if set to `true`, Mesh will preload all physical time series points on startup.
- `PreloadPreviousState` - if set to `true`, Mesh will preload previous cache state on startup. If both PreloadAllTimeSeries and PreloadPreviousState is set to true at the same time, Mesh will first preload the previous cache state and then the other time series values.
- `CacheStateFileDirectory` - path to the directory where Mesh persists the cache state.

**Note!** Most installations should not have to change the default configuration, except the CacheStateFileDirectory field, as it is related to the memory/performance tuning.

For security reasons, access to `CacheStateFileDirectory` should be restricted at the operating-system level.
Grant permissions only to the specific users or groups that require access (principle of least privilege).

<div style="page-break-after: always;"></div>

## Verify the installation

To verify the installation:

1. Check that the service is running.
2. Run tests using the service, e.g. the Mesh Configurator or Nimbus.

**Note!** You must be member of the correct security group to start Mesh Configurator.

<div style="page-break-after: always;"></div>

## Update the Mesh object model

There will be a new version of the Mesh object model (EnergySystem) delivered with each release. The installed object model must be updated to the latest version for the applications using Mesh to work correctly.

As part of a Smart Power release there exists a separate package named `ModelUpdate.zip` that contains the new model together with scripts and descriptions of how to update the Mesh model.

<div style="page-break-after: always;"></div>

## Error situations

### General installation problems

If errors occur during installation, you should:

1. Verify that you have followed the prerequisite steps, see Prerequisites. 
2. Verify that the installation is complete, see What the installer does.
3. Verify the configurations, see Server manager configuration and Application configuration.
4. Verify that the user executing the Mesh service is administrator or has been granted appropriate privileges (Logon as a Service, Logon as a Batch Job, URL ACLs).

The Mesh Service logs service calls and errors to the Windows Event Log. The relevant source names for log entries are `Powel Mesh` and `Powel.Object.Structure.Service`.

### Problems related to Oracle 19

If you get the error message **ORA-22922: nonexistent LOB value**, that may be caused by an incorrect value (`true`) for the Oracle init parameter `optimizer_capture_sql_plan_baselines`.

Verify this by executing the following SQL statement from SQL Plus:

```sql
show parameter optimizer_capture_sql_plan_baselines;
```

If the parameter is set to `true`, this must be changed to false with the following SQL statement:

```sql
alter system set optimizer_capture_sql_plan_baselines = false;
```

**Note!** This must be run by a user with system administrator privileges.

<div style="page-break-after: always;"></div>

## Security considerations

### File system

For security reasons, access to configuration files like: mesh.json, authorisation groups file, private key (if stored in file system), etc. MUST be restricted at the operating-system level.
Grant permissions only to the specific users or groups that require access (principle of least privilege).
Account running Mesh service MUST have access to those files.

### Database

It is strongly recommended to configure the database connection to use encryption.
This ensures that sensitive data, including credentials and queries, is protected from interception during transmission.

## mesh.json - complete

Below is the complete `mesh.json` listed with all options with default values.

```json
{
  "FailOnSyncErrors": false,
  "SerializationVersion": 25,
  "ComputerName": "localhost",
  "Log": {
    "Console": true, // Log to stdout
    "WindowsEventLog": false, // Log to the Windows Event Log
    "Directory": "C:\\Powel\\Mesh\\logs", // Log to the given directory
    "Level": "info", // One of "trace", "debug", "info", "warning", "error", default "info"
    "RequestLogging": true,
    "MaxLogFiles": 10,           // Maximum number of log files
    "MaxLogSizeMb": 10,          // Maximum size of each log file in MB
    "MaxRequestLogFiles": 10,    // Maximum number of request log files
    "MaxRequestLogSizeMb": 10    // Maximum size of each request log file in MB
  },
  "SynchronizationIntervalSeconds": 30,
  "Audit": {
    "Directory": "",
    "CircularLog": true
  },
  "Oracle": {
    "ExternalCredentials": false,
    "ReadOnly": false,
    "Cleanup": true,
    "SerializableCleanup": true,
    "Server": "",
    "Username": "",
    "Password": "",
    "TimeseriesPointsSplit": 8000000
  },
  "HighAvailability": {
    "KillProcessOnSwitchingToInactiveMode": true,
    "UsePingPongProtection": false,
    "UseServersInActiveZoneInfo": false,
    "HeartbeatIntervalSeconds": 10,
    "HeartbeatValiditySeconds": 20,
    "AllTransactionsDeadlineSeconds": 30,
    "PingPongIntervalSeconds": 600,
    "PingPongMaxStartAttemptsWithinInterval": 2,
    "ServiceName": "Mesh"
  },
  "HttpConfig": {
    "Port": 20000,
    "Kerberos": true,
    "HealthEnabled": true
  },
  "Grpc": {
    "Kerberos": true,
    "OAuth": false,
    "Address": "[::]:50051",
    "Tls": {
      "CertificatePath": "",
      "CertificateKeyPath": "",
      "WindowsCertStore": {
        "CertificateThumbprint": "",
        "SystemStoreName": ""
      }
    },
    "Authorization": {
      "Audience": "",
      "JwksEndpoint": "",
      "Issuer": "",
      "Scope": "",
      "GroupsFile": "",
    }
  },
  "Zmq": {
    "Threads": 8,
    "Kerberos": true,
    "Port": 40321
  },
  "SharedPointCache": {
    "LimitMb": 1000,
    "DefaultIntervalDays": 20,
    "PreloadAllTimeSeries": true,
    "PreloadPreviousState": true,
    "CacheStateFileDirectory": "<path>"
  },
  "configPath": ""
}
```

<div style="page-break-after: always;"></div>

## Contact information

To purchase Volue software and additional licenses, please contact our sales staff or departmental managers.

Software patches are normally placed on the support website, unless the patches are particularly large. To upgrade your Volue software with new releases or patches, please contact the support department by telephone or e-mail. Support will also answer your questions on software, patches or upgrades in general.

Telephone: +47 73 80 45 10

E-mail: support@volue.com

Web: www.volue.com
