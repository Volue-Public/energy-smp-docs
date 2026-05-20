# Queue usage in Smart Power

In Smart Power message queues are the standard technology to use in asynchronous integrations with both internal and external applications. These are integrations that in SmG would have been implemented using file based exchange of information.

## Current usage in existing SmP applications

* Imports to and exports from Mesh Data Transfer from and to external applications/systems.
* Activation plans and heartbeats from Activation Request to SCADA Gateway and Mesh Data Transfer.
* Acknowledgements from SCADA Gateway to Activation Request.
* Production plans from Mesh Data Transfer to SCADA Gateway.

## Queue definitions per Smart Power application

* **Mesh Data Transfer** to/from external applications/systems:
  * **ImportQueue** - contains messages to be imported. There may be several queues with different priorities.
  * **ImportReplyQueue** - contains reply message on each import message.
  * **ImportFailureQueue** - contains import messages that have failed.
  * **ExportQueue** - contains exported messages. There may be several queues related to different receivers.
  * **ExportReplyQueue** - contains reply messages on exported messages.
  * **ExportFailureQueue** - contains messages that failed during export.
  * **TriggerQueue** - contains messages that trigger exports.
* **Activation Request** to/from SCADA Gateway and Mesh Data Transfer:
  * **TimeSeries2ScadaQueue** - contains activation and heartbeat messages to SCADA Gateway/SCADA.
  * **AcknowledgeQueue** - contains acknowledgement messages from SCADA/SCADA Gateway.
  * **TimeSeries2MeshQueue** - contains activation messages to Mesh Data Transfer.
