# ScadaGateway - AutoPilot Functionality

- [ScadaGateway - AutoPilot Functionality](#scadagateway---autopilot-functionality)
  - [Configuration](#configuration)
  - [Generation plan](#generation-plan)
  - [Activation requests](#activation-requests)
  - [Acknowledge message](#acknowledge-message)
  - [Send new set-points to Scada](#send-new-set-points-to-scada)
  - [Additional dependencies / developments](#additional-dependencies--developments)

The AutoPilot functionality within the ScadaGateway module sends generation set-points to the generators of a Scada system. The set-points are sent due to requested changes of the generation based on:

- The received generation plan from the production planning organisation, and
- Activation requests received and accepted from the TSO.

All generation plans and activation requests are received from other applications on AMQP based message queues. AMQP queues are also used to transfer the reception acknowledgement of the received messages from the AutoPilot.

An overview of the solution is shown below:

![](Images/AutoPilot-overview.svg)

The role of the different components:

- `Mesh/SmG DB` - The time series store for production plans
- `Optimisation` - An optimisation solution (f.ex. Optimal Gateway with POMA) that creates optimal production plans and stores them. The optimal solution is including the activation plans received from ActivationRequest. 
- `Export` - An exporting solution (f.ex. GS2 export) that exports the production plans with 15 minute resolution to a receiver (in our case the `ProdPlan input` queue). Information of the export is stored in the MessageLog of the SmG system.
- `AckReceiver` - A receiver solution that receives the acknowledgement of the production plan export and update the state of the export in the SmG MessageLog.
- `ActivationRequest` - A solution that receives activation request messages from the TSO and creates an activation plan with minute resolution for the total set of received activations. The activation plan is sent to the `ActPlan input` queue. The same plan is also sent to the SmG database as a time series with 15 minute resolution. The solution receives also the acknowledgement from the AutoPilot and send a similar response back to the TSO.
- `ScadaGateway - AutoPilot` - A solution that handles received production plans per generation unit and activation plans and sends all changes as new set-points to the Scada system using the ICCP communication protocol. The set-points changes are sent when the change shall be implemented in the Scada system.
- `Scada system` - The control system for a number of generating units. Received set-points are directly updated on the physical unit when the command is received.

## Configuration

The configuration of the AutoPilot service is done in the IccpImportParametersFile.json file. 

The configuration file contains the following AutoPilot information:

- List of Clients (i.e. Scada systems) to communicate with. This allows that one AutoPilot can communicate with a high-availability Scada system (zoneA, zoneB, disaster recovery zoneA, disaster recovery zoneB).
  - Necessary ICCP definitions for communicating with each client, including certificate references for TLS.
- Definition of units to communicate with
  - Default ramping interval. This is initially set to 10 minutes.
  - Information per unit
    - Identity in Scada system
    - Override ramping interval. The possibility to have a different ramping interval than the default definition.
  - Information of activation request unit
    - Identity in Scada system
    - Reference in activation request messages

This is an example of the part related to the time series used in AutoPilot:

```json
  // Export related parameters:
  "EnableExport": false,
  "ExportMessageQueueDefinitions": [
    {
      "MessageType": "Volue.RabbitMq.Contracts.TimeSeriesContracts.ActivationRequestModels.V1.TimeSeriesMessage",
      "Alias": "TimeSeriesMessageV1",
      "QueueName": "ActivationRequest2ScadaV1"
    },
    {
      "MessageType": "Volue.RabbitMq.Contracts.TimeSeriesContracts.ActivationRequestModels.V2.TimeSeriesMessage",
      "Alias": "TimeSeriesMessageV2",
      "QueueName": "ActivationRequest2ScadaV2"
    }
  ],
  "ExportAcknowledgementProtocol": "RabbitMq",
  "ExportAcknowledgementExternalText": "Acknowledgement:QueueName",
  "ProdPlanRampingIntervalInMinutes": 10, 
  "ExportDefinitionMaps": [
    {
      "TimsKey": 1,
      "Variable": {
        "Domain": "domain1",
        "Dataset": "dataset1",
        "VariableCode": "variable1"
      }
    },
    {
      "TimsKey": 2,
      "Variable": {
        "Domain": "domain1",
        "Dataset": "",
        "VariableCode": "variable2",
        "RampingIntervalInMinutes": 15
      }
    }
  ]
```

NB! The ExportDefinitionMap is also possible to define as export definitions in the SmG Participant application.

## Generation plan

The AutoPilot receives the generation plan for one or more generators as a json formatted message. The generation plan will normally have an 1 hour or 15 minute time resolution, but can also be specified with other time resolution.

The production plan has time stamped values that will be valid until the next time stamped value. If no value is received for a time point, the last value before will be used.

The production plan message looks like this for a plan with 15 minutes resolution:

````json
{
  "TimeSeriesHeader": {
    "Version": "2",
    "DocumentIdentification": "6ac0c76e-8f06-41d2-a5d8-0b053933e80f",
    "Origin": "10X1001A1001A38Y",
    "TSType": "ProdPlan",
    "CreatedDateTime": "2024-10-12T01:04:10.5079796Z"
  },
  "TimeSeries": [
    {
      "TSReference": "domain1.dataset1.variable1",
      "MeasureUnit": "MAW",
      "Values": [
        {
          "Value": 14.1,
          "TimeStamp": "2024-10-12T01:00:00Z"
        },
        {
          "Value": 14.1,
          "TimeStamp": "2024-10-12T01:15:00Z"
        },
        {
          "Value": 14.7,
          "TimeStamp": "2024-10-12T01:30:00Z"
        },
        {
          "Value": 16,
          "TimeStamp": "2024-10-12T01:45:00Z"
        },
        {
          "Value":16,
          "TimeStamp": "2024-10-12T02:00:00Z"
        },
        ...
        {
          "Value": 10.34,
          "TimeStamp": "2024-10-12T05:00:00Z"
        }
      ]
    }
  ]
}
````

When receiving a new production plan for a unit, this new plan will replace the current production plan for the time period defined by the Start and End for each plan in the message. The production plan will be modified to include up- and down-ramping periods for every change. During ramping periods, the plan will have new values for every minute. The adjusted production plan will be stored into the database in order to return to the old state when restarting the service.

## Activation requests

The AutoPilot receives a change in activation requests for the whole system as a json formatted message. All activation requests for the system are in the message merged into a combined regulation plan with timestamped values for any change in the plan. Related to up and down ramping the values are timestamped for every minute.

The regulation plan has time stamped values that will be valid until the next time stamped value. If no value is received for a time point, the last value before will be used.

The regulation plan message looks like this for a plan with 15 minutes resolution:

````json
{
    "TimeSeriesHeader": {
        "Version": 2,
        "DocumentIdentification": "AF3AB144-8DD0-4DDA-A415-7B2B9A3DB507",
        "Origin": "Generis",
        "CreatedDateTime": "2021-12-06T14:25:46Z",
        "TSType": "mFRRAct"
    },
    "TimeSeries": [{
        "TSReference": "domain1.dataset2.variable1",
        "TimeInterval": {
            "Start": "2021-12-06T14:00:00+01:00",
            "End": "2021-12-07T12:00:00+01:00"
        },
        "Resolution": "PT15M",
        "MeasureUnit": "MWh",
        "Values": [{
            "TimeStamp": "2021-12-06T14:00:00Z",
            "Value": 0,
            "Quality": "OK"
        },{
            "TimeStamp": "2021-12-06T14:17:00Z",
            "Value": 2.4,
            "Quality": "OK"
        },{
            "TimeStamp": "2021-12-06T14:18:00Z",
            "Value": 4.8,
            "Quality": "OK"
        }
        ...
        {
            "TimeStamp": "2021-12-07T00:00:00Z",
            "Value": 0,
            "Quality": "OK"
        }]
    },{
        "TSReference": "PlanAGen2",
        ...
    },
    ...
    ]
}
````

When receiving a new regulation plan for a unit, this new plan will replace the entire current regulation plan. The new regulation plan will be stored into the database in order to return to the old state when restarting the service.

## Acknowledge message

The AutoPilot will always create an acknowledge message on a received activation or production plan message. If the message is of correct format and with a reference that exists in the AutoPilot configuration, a positive acknowledge message is create, otherwise a negative acknowledge message is created with a description of the problem.

The format of the acknowledge message is:

```json
{
  "RequestMessageID": "AF3AB144-8DD0-4DDA-A415-7B2B9A3DB507", // same id as DocumentIdentification in the received message
  "MessageVersion": "2",
  "MessageType": "mFRRAct", // same as TsType in received message
  "ImportSuccess": true,
  "ImportError": null // string describing the reason for failure if ImportSuccess=false
 }
```

## Send new set-points to Scada

In the start-up process of the AutoPilot, the connection with the Scada system is created based on the time series definitions in the configuration. This is done based on the DatasetTransferSet functionality where it is the Scada system that subscribe for changes to the information in the AutoPilot parameters. Whenever a parameter value is changed, this value is automatically transferred to the Scada system.

The AutoPilot will on start-up read all AutoPilot time series stored in the database into memory, and initialize all parameters with the current value for each time series read from the database.

The AutoPilot will enter a forever loop that for each run will check for a change in any time series related to the current time stamp. If a change is identified, the related memory parameter is updated with the new value, and the Scada system will receive this change.

## Additional dependencies / developments

The AutoPilot solution requires the following changes in other applications:

- `Export of production plans to AMQP` - The existing GS2 export of SmG must be updated to export the production plan as a TimeSeries version 2 json message.
- `Update state of export message` - A new service is needed to receive the acknowledgement message from AutoPilot, of the received production plan message, and update the state of the exported message in the MessageLog of SmG.
