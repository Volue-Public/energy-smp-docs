# Monitor Smart Power solutions

- [Monitor Smart Power solutions](#operating-smart-power-solutions)
  - [About this document](#about-this-document)
  - [Systems monitoring](#systems-monitoring)
  - [Service list](#service-list)
    - [Powel Alarm service](#powel-alarm-service)
    - [Powel FileRequester service](#powel-filerequester-service)
    - [Powel FileResponder service](#powel-fileresponder-service)
    - [Powel Mesh service](#powel-mesh-service)
    - [Powel MeshDataTransfer service](#powel-meshdatatransfer-service)
    - [Powel MeshCollector service](#powel-meshcollector-service)
    - [Powel MeshFileImportConverter service](#powel-meshfileimportconverter-service)
    - [Powel MeshSoapImportServer service](#powel-meshsoapimportserver-service)
    - [Powel Nimbus service](#powel-nimbus-service)
    - [Powel OptimalGateway service](#powel-optimalgateway-service)
    - [Powel OptimalLog service](#powel-optimallog-service)
    - [Powel OptimalMultiAsset (POMA) service](#powel-optimalmultiasset-poma-service)
    - [Powel ScadaGateway service](#powel-scadagateway-service)
    - [Volue TransferAMQPFile service](#volue-transferamqpfile-service)


## About this document

This document serves as a guide to monitor Volue‘s Smart Power (SmP) software suite.

Background:

- The SmP software is provided as on-premises solutions (incl. private cloud environments).
- Therefore, operation of the software is usually in the hands of Volue’s customers.

To enable the organisation's IT personnel to operate the solution, this document summarises the required knowledge about monitoring and alerting.

For all software components, it contains information about:

- Which measurements can be taken to monitor the applications, and how.
- What events should be alerted as impairing proper operation.

The basics of operation (e.g. hardware-related monitoring) are described briefly, but this completely depends on the individual environment, and Volue is not able to give advise about how they should be operated.

## Systems monitoring

As mentioned above, Volue can hardly advise on how to specifically monitor hardware/systems.

We recommend that the IT operations should make sure that warnings are given for usual indicators of insufficient hardware sizing, such as:

- High average CPU utilisation over a certain time period (e.g. 85% for more than 20 minutes).
- High disk usage/little disk space left (e.g. less than 15% free disk space).

Obviously, the mere availability of resources should be ensured as well, with alarms for unavailable servers or broken network connections.

Other (non-Volue) software should also be monitored for availability, like the database and message queues.

## Service list

There are 14 services described in this document:

||Service|Health endpoint|Active zone Normal|Active zone Alert|Passive zone Normal|Passive zone Alert|
|-|------|---------------|-------------------|------------------|--------------------|-------------------|
|1|Powel Alarm service|n\a|Running|Stopped/Disabled|Running|Stopped/Disabled|
|2|Powel FileRequester service|http://server:7431/FileRequester/health|Running|Stopped/Disabled|Stopped/Disabled|n/a|
|3|Powel FileResponder service|http://server:5200/FileResponder/health|Running|Stopped/Disabled|Running|Stopped/Disabled|
|4|Powel Mesh service|http://server:20000/meshHealth/health|Running|Stopped/Disabled|Running|Stopped/Disabled|
|5|Powel Mesh Data Transfer service|http://server:7000/health|Running|Stopped/Disabled|Stopped/Disabled|n/a|
|6|Powel MeshCollector service|http://server:7341/MeshCollectorService/health|Running|Stopped/Disabled|Runnning|Stopped/Disabled|
|7|Powel MeshFileConverter service|http://server:7432/MeshFileConverterService/health|Running|Stopped/Disabled|Stopped/Disabled|n/a|
|8|Powel MeshSoapImportServer service|http://server:7000/MeshSoapImportServer/health|Running|Stopped/Disabled|Running/Stopped/Disabled|
|9|Powel Nimbus service|http://server:23142/hc/|Running|Stopped/Disabled|Running|Stopped/Disabled|
|10|Powel Optimal Gateway service|http://server:18261/Gateway/Health|Running|Stopped/Disabled|Running|Stopped/Disabled|
|11|Powel Optimal Log service|http://server:18260/OptimalLog/Health|Running|Stopped/Disabled|Running|Stopped/Disabled|
|12|Powel Optimal MultiAsset (POMA) service|http://server:18262/MultiAsset/Health|Running|Stopped/Disabled|Running|Stopped/Disabled|
|13|Powel ScadaGateway service|http://server:port/ScadaGateway/health|Running|Stopped/Disabled|Stopped/Disabled|n/a|
|14|Volue TransferAMQPFiles service|n/a|Running|Stopped/Disabled|Running|Stopped/Disabled|

The above table contains information about the health endpoint of each service, the normal operation mode when running in either active or passive zone, and alert situation when running in either active or passive zone.

### Powel Alarm service

Summary/description:

- Manages SmG alarm events and is the backend for the Powel Alarm system.

Output:

- Logs default at `<poweldrive>:\Powel\Icc\bin\log\NotificationService.log`
- Location and log level is configurable in AlarmService.exe.config

Endpoints/API:

- N/A

Things to alert:

- The service is not running.

### Powel FileRequester service

Summary/description:

- This service requests new files (i.e., messages) from one or more FileResponders running in DMZ. The received information is placed in an AMQP queue to be imported by the Mesh AMQP Relay. A confirmation signal is sent back upon completion.

Output:

- AMQP messages.
- Logs at `<poweldrive>:\PowelSmartLogs\FileRequester`
- Health message contains counters of different operations, when last call was executed, when last information received, ...

Endpoints/API:

- Health endpoint: `http://<server>:7431/FileRequester/health`

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Imports via Mesh AMQP Relay of messages from this service is not created within a certain time frame.
- Observations based on health data – too long time since last call was executed or too long time since last information was received or …

### Powel FileResponder service

Summary/description:

- This service is running in DMZ and returns information from non-transferred files on request from the FileRequester service. The transfer is «commited» when a positive ack is received from the FileRequester, otherwise the file will be resent on a later request.

Output:

- Messages transferred to the FileRequester.
- Logs at `<poweldrive>:\PowelSmartLogs\FileResponder`
- Health message contains counters of different operations, when last call was received, when last transfer was performed, ...

Endpoints/API:

- Endpoint used by FileRequester: `http://<server>:5200`
- Health endpoint: `http://<server>:5200/FileResponder/health`

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Observations based on health data – number of failures when receiving calls is increasing or too long time since last call was successfully received or …
- File in New-folder that is created more than 2 minutes ago.

### Powel Mesh service

Summary/description:

- Main service that keeps data model and timeseries data.
- Serves all processes, optimization, simulation, import, export etc.

Output:

- Logs at `<poweldrive>:\PowelSmartLogs\Mesh`

Endpoints/API:

- Health endpoint at: `http://<server>:2000/meshHealth/health`

Things to alert:

- The "Powel Mesh" service is not running.
- The health endpoint is not responding.
- If ORA-xxx error found in log, report to 1st line support / DB admins.

### Powel MeshDataTransfer service

Summary/description:

- Receives import messages from queues, and export requests from on an endpoint.
- Translates the imports and sends them to Mesh.
- Translates export requests and puts messages to queues and/or files.

Output:

- Logs at `<poweldrive>:\PowelSmartLogs\MeshDataTransfer`
- Might save import requests to the filesystem if enabled in the configuration.

Endpoints/API:

- Mesh Data Transfer uses queues to receive import requests.
- It also sends import responses to the queue.
- It communicates with Mesh using gRPC.
- It communicates with database.
- It receives export requests on an endpoint and puts the export message on a queue and/or a file.
- HTTP endpoints (core URL defined in the configuration file):
  - Order – time series export trigger.
  - AvailabilityExport – availability export trigger.
  - Reimport – retry of certain import request.
  - Health endpoint: `http://<server>:7000/health`

Things to alert:

- The service is not running.
- Health endpoint is not responding with Healthy status.
- MeshDataTransfer is responsible for fetching requests from the queues and processing them. If the number of messages on the queues is not decreasing (or number of messages in the Dead Letter Queue is increasing) the situation should be investigated.
- Messages is not removed from the order queue within a few seconds.
- MeshDataTransfer periodically checks if Mesh service is responsive. In case of problems error message should be logged.

### Powel MeshCollector service

Summary/description:

- This service collects data from external services (f.ex. meteorological data from Radarmeteo) and converts the information to xml messages that is stored on files when running in DMZ, otherwise sent as AMQP messages that is imported by Mesh AMQP Relay.

Output:

- AMQP messages.
- Logs at `<poweldrive>:\PowelSmartLogs\MeshCollectorService`
- Health message contains counters of different operations, when last call was executed, when last forecast was received, ...

Endpoints/API:

- Health endpoint: `http://<server>:7341/MeshCollectorService/health`

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Observations based on health data – too long time since last call was executed or when last forecast was received or …

### Powel MeshFileImportConverter service

Summary/description:

- This service converts information in files to AMQP messages that is imported by Mesh AMQP Relay.
- PVPLAN files are read from the D:\Powel\IccData\PVPLAN\New directory and successful transformation to the AMQP queue moves the files to the ..\Success directory. If something fails in the transformation, the files are moved to the ..\Error directory.

Output:

- AMQP messages.
- Logs at `<poweldrive>:\PowelSmartLogs\MeshFileImportConverterService`
- Health message contains counters of different operations, when last call was executed, number of converted files and number of conversion errors.

Endpoints/API:

- Health endpoint: `http://<server>:7433/MeshFileImportConverterService/health`

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Imports via Mesh AMQP Relay of  messages from this service is not created within a certain time frame.
- Observations based on health data – too long time since last call was executed or number of conversion failures.
- If files stay in the <>\PVPLAN\New directory for more than a minute.
- If files stay in the <>\PVPLAN\Error directory for more than a minute (the file is moved here in the start of the transformation process but is moved to the <>\PVPLAN\Success directory when the transformation is competed successfully).

### Powel MeshSoapImportServer service

Summary/description:

- This service receives SOAP calls from other systems with data that shall be transferred to Mesh (f.ex. Availability events from InGen). When the service runs in DMZ the result is xml messages that is stored on files, otherwise the result is sent as AMQP messages that is imported by Mesh AMQP Relay.

Output:

- AMQP messages.
- Logs at `<poweldrive>:\PowelSmartLogs\MeshSoapImportServer`
- Health message contains counters of different operations, when last call was received, ...

Endpoints/API:

- Health endpoint: `http://<server>:22/MeshSoapImportServer/health`

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Observations based on health data – number of failures when receiving calls is increasing or too long time since last call was successfully received or …

### Powel Nimbus service

Summary/description:

- This is the service providing the Nimbus GUI (application running on the user‘s client / rdp session). The service provides settings from the configuration service for user and roles, handles task and for none Mesh task gives report content.

Output:

- This service writes a log file to disk. Default to `<poweldrive>:\PowelSmartLogs\ServiceHosts.WindowsServiceHost\Powel.Icc.ServiceHosts.WindowsServiceHost.log`.
- Location and log level is configurable in Powel.Icc.ServiceHosts.WindowsServiceHost.exe.config.

Endpoints/API:

- Default endpoints (configurable in Powel.Icc.ServiceHosts.WindowsServiceHost.exe.config): `http://<server>:23124/hc`

Things to alert:

- The Health endpoint for the service could be used to give status for each endpoint in the service. While if health endpoint is not answering at all it could be used as an indication of the service being down and an alert.
- For each endpoint the status tag could bused to alert if it is not "Healthy"

````json
  {"status":"Healthy","address":"http://localhost:23124/hc/","dependencies":{"ServiceBroker":{"status":"Healthy","counters":{"numberOfUserProcesses":0},"dependencies":{}},"ConfigurationReaderService":{"status":"Healthy","address":"http://localhost:23124/hc/configurationreaderservice/"},"EventMonitorService":{"status":"Healthy","address":"http://localhost:23124/hc/eventmonitorservice/"},"OptimizationService":{"status":"Healthy","address":"http://localhost:23124/hc/optimizationservice/"}}}
````

- Alert if the service is not running in the active zone.
- Alert if there is a “Fatal” message in the log file Powel.Icc.ServiceHosts.WindowsServiceHost.log

### Powel OptimalGateway service

Summary/description:

- Optimal Gateway collects and preprocesses data from Mesh for Optimization services Poma, SHOP and Prodrisk. 

Output:

- If activated Gateway generates JSON files to analyze optimization issues.
- Logs at `<poweldrive>:\PowelSmartLogs\Powel Gateway Service`

Endpoints/API:

- Gateway has API for starting/stopping optimizations. Refer to swagger documentation at `http://<server>:18261/Gateway/#api`
- Health endpoint: `http://<server>:18261/Gateway/Health`

Things to alert:

- The "Powel Optimal Gateway Service" is not running.
- The health endpoint is not responding.

### Powel OptimalLog service

Summary/description:

- Optimal Log is the centralized log for optimization algorithms. Services that use it are Gateway, SHOP, POMA and Prodrisk. Its purpose is to supply log entries from these components to end users in Nimbus / OptimalLog UI.
- However, for monitoring & alerting purposes, you should use the actual service’s logging (following slides).

Output:

- Logs at `<poweldrive>:\PowelSmartLogs\Powel Optimal Log`

Endpoints/API:

- API available to read headers and lines for logs. Refer to swagger documentation at `http://<server>:18260/OptimalLog/#apip`
- Health endpoint: `http://<server>:18260/OptimalLog/Health`

Things to alert:

- The "Powel Optimal Log Service" is not running.
- The health endpoint is not responding.

### Powel OptimalMultiAsset (POMA) service

Summary/description:

- OptimalMultiAsset includes the code to execute optimizations based on the data collected by Gateway.

Output:

- Logs at `<poweldrive>:\PowelSmartLogs\Powel Optimal MultiAsset`

Endpoints/API:

- Health endpoint: `http://<server>:18262/MultiAsset/Health`

Things to alert:

- The "Powel Optimal MultiAsset Service" is not running.
- The health endpoint is not responding.

### Powel ScadaGateway service

Summary/description:

- This service is connecting to a Scada server using OPC UA, sets up a subscription of interest, receives updates from the Scada server for this subscription, and create messages with updates in an AMQP queue for Mesh AMQP Relay to import.

Output:

- AMQP messages.
- Logs at `<poweldrive>:\PowelSmartLogs\ScadaGateway`
- Health message contains counters of different operations, when last connected, when last data changed, when last export created, ...

Endpoints/API:

- Health endpoint: `http://<server>:\<port\>/ScadaGateway/health`
- Port used is defined in the appsettings.json as HttpPort.

Things to alert:

- The service is not running.
- The health endpoint is not responding.
- Imports via Mesh AMQP Relay of  messages from this service is not created within a certain time frame.
- Observations based on health data – too long time since last data change was received or too long time since an export was created or ...

### Volue TransferAMQPFile service

Summary/description:

- This service is running in the Scada environment and downloads messages from a defined queue and stores the content as files in a specified directory.

Output:

- Messages created in one or more directories.
- Logs at `<poweldrive>:\PowelSmartLogs\TransferAmqpFiles`

Endpoints/API:

- None.

Things to alert:

- Service is not running.
- The health endpoint is not responding.
- Messages is not removed from the AMQP queue – should be done immediately.
