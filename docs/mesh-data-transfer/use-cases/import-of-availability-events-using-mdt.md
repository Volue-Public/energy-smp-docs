# Import of availability events using Mesh Data Transfer

This document describes how availability events can be imported into Mesh using Mesh Data Transfer and AMQP messages in the
Mesh standard XML format.

- [Import of availability events using Mesh Data Transfer](#import-of-availability-events-using-mesh-data-transfer)
  - [Different event types handled](#different-event-types-handled)
  - [Different message types](#different-message-types)
  - [XML input message structure](#xml-input-message-structure)
    - [RevisionEvent \& RevisionEventUpdate](#revisionevent--revisioneventupdate)
    - [RestrictionEvent \& RestrictionEventUpdate](#restrictionevent--restrictioneventupdate)
    - [AvailabilityEventRemove](#availabilityeventremove)
  - [XML response message structure](#xml-response-message-structure)
  - [Examples](#examples)
    - [Create a revision event](#create-a-revision-event)
    - [Update a revision event](#update-a-revision-event)
    - [Delete a revision event](#delete-a-revision-event)
    - [Create a restriction event](#create-a-restriction-event)
    - [Update a restriction event](#update-a-restriction-event)
    - [Delete a restriction event](#delete-a-restriction-event)
    - [Acknowledgement successful import](#acknowledgement-successful-import)
    - [Acknowledgement non-successful import](#acknowledgement-non-successful-import)

## Different event types handled

The import of availability events using AMQP supports two different event types:

- `Revision` - an event that makes an object 100% unavailable for the given time period. Examples of
such events are operations due to maintenance of the physical object or a failure that suddenly
happens on the object.
- `Restriction` - an event that has the possibility to just reduce the available resource by a part (f.ex. 20
%). Examples of such events are reduced max level of a resevoir due to maintenance on the dam or
reduced max production due to reduced capacity in some parts of the system.

## Different message types

The message types that are available to use are:

- `RevisionEvent` - create a new revision event on an object in the Mesh model.
- `RevisionEventUpdate` - update an existing revision event.
- `RestrictionEvent` - create a new restriction event on an object in the Mesh model.
- `RestrictionEventUpdate` - update an existing restriction event.
- `AvailabilityEventRemove` - delete an existing revision or restriction event.

## XML input message structure

This is an example of the structure of the XML message:

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789012</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-01-01T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
... one or more events
    </AvailabilityEvents>
  </Inputs>
</Request>
````

Parameters:

- `MessageId` - id of the message, used in the response message to signal success or failure.
- `MessageVersion` - version of the message format, currently only 1.0.0.0 is supported.
- `ForceAvailabilityEventCreation` - flag to force events to be created for update messages when
they not already exists.
- `Sender` - name of the sender (used in lookup for SmG Participant to use when saving information in
SmG Message Log).
- `Receiver` - name of the receiver (always Mesh).
- `CreationDate` - time when the message was created.
- `Inputs/AvailabilityEvents` - contains list of events to be created, updated, and/or deleted. The
events will be handled in the same order as they are located in the list.

### RevisionEvent & RevisionEventUpdate

````xml
<RevisionEvent Path="Model/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="1234">
  <SubEvent Status="Planned" Description="" Value="1">
    <Frequency Start="2022-04-06T06:00:00Z" End="2022-04-06T10:00:00Z" />
  </SubEvent>
</RevisionEvent>
````

Parameters:

- `Path` - starting point (object) to use when searching for objects using the Search parameter.
- `Search` - a search from the starting point that must result in exactly one object in order to be
successful. The found object is the object where the events are created below.
- `EventId` - this is a text string that identifies the created event. This id is normally created within the
external system that "owns" the event. When updating and delete an event, object and event id must
match.
- `SubEvent/Status` - text string that identifies the status of the event. Legal values for revision events
are:
  - `Proposed` - suggestion from Maintenance Planner.
  - `Recommended` - suggestion from Production Planner.
  - `Planned` - final status, no application TSO/Market message needed.
  - `Unplanned` - direct status used whether it needs to be reported to TSO and Market or not.
  - `Suspended` - event cancelled.
  - `AppliedByTso` - used in process towards TSO.
  - `ApprovedByTso` - used in process towards TSO.
  - `RejectedByTso` - used in process towards TSO.
- `SubEvent/Description` - (optional) text string that describes the event.
- `SubEvent/Value` - size of the unavailability. Always "1" for revisions.
- `SubEvent/Frequency` - the period when this event is unavailable.
- `SubEvent/Frequency/Start` - start of the unavailability period.
- `SubEvent/Frequency/End` - end of the unavailability period.

### RestrictionEvent & RestrictionEventUpdate

````xml
<RestrictionEvent Path="Model/Company/Mesh" Search="*
[.Type=ForecastPoint&amp;&amp;.Name=ITH-1124-U1&amp;&amp;...Pump=0]"
EventId="254525" Category="ProductionMax[MW]">
  <SubEvent Status="SelfImposed" Description="" Value="0">
    <Frequency Start="2021-02-23T10:00:00Z" End="2021-02-23T10:10:00Z" />
  </SubEvent>
</RestrictionEvent>
````

Parameters:

- `Path` - starting point (object) to use when searching for objects using the Search parameter.
- `Search` - a search from the starting point that must result in exactly one object in order to be
successful. The found object is the object where the events are created below.
- `EventId` - this is a text string that identifies the created event. This id is normally created within the
external system that "owns" the event. When updating and delete an event, object and event id must
match.
- `Category` - text string describing the category of the restriction that the event is related to. Legal
values are:
  - `DischargeMax [m3/s]`
  - `DischargeMin [m3/s]`
  - `DischargeMaxAverage [m3/s]`
  - `DischargeMinAverage [m3/s]`
  - `DischargeMaxVariationDown [m3/s]`
  - `DischargeMaxVariationUp [m3/s]`
  - `DischargeBlocFlow [m3/s]`
  - `ProductionMax [MW]`
  - `ProductionMin [MW]`
  - `ProductionMaxRegulations`
  - `ProductionRampingUp [MW]`
  - `ProductionRampingDown [MW]`
  - `ProductionBlockGeneration [MW]`
  - `RampingFlag`
  - `ReservoirLevelMax [m]`
  - `ReservoirLevelMin [m]`
  - `ReservoirLevelRampingDown [m]`
  - `ReservoirLevelRampingUp [m]`
  - `PumpHeightDownstreamReservoir [m]`
  - `PumpHeightUpstreamReservoir [m]`
  - `Priority`
  - `ReservoirTacticalLevelMax [m]`
  - `ReservoirTacticalLevelMin [m]`
- `SubEvent/Status` - text string that identifies the status of the event. Legal values for restriction events
are:
  - `SelfImposed` - restriction is due to internal needs.
  - `Licensed` - restriction is due to external regulation/law/agreements.
  - `SubEvent/Description` - (optional) text string that describes the event.
  - `SubEvent/Value` - size of the availability. For restrictions "0" means that nothing is available.
  - `SubEvent/Frequency` - the period when this event is unavailable.
  - `SubEvent/Frequency/Start` - start of the unavailability period.
  - `SubEvent/Frequency/End` - end of the unavailability period.

### AvailabilityEventRemove

````xml
<AvailabilityEventRemove Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="1234" />
````

Parameters:

- `Path` - starting point (object) to use when searching for objects using the Search parameter.
- `Search` - a search from the starting point that must result in exactly one object in order to be
successful. The found object is the object where the events are created below.
- `EventId` - this is a text string that identifies the created event. This id is normally created within the
external system that "owns" the event. When updating and delete an event, object and event id must
match.

## XML response message structure

````xml
<?xml version="1.0" encoding="utf-8"?>
<Reply xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <RequestMessageId>12345678-1234-1234-1234-123456789012</RequestMessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ImportSuccess>false</ImportSuccess>
  <ImportError>This is the error text from MESH</ImportError>
</Reply>
````

Parameters:

- `RequestMessageId` - the same id as used as MessageId in the input message that this is a response of.
- `MessageVersion` - version of the message format, currently only 1.0.0.0 is supported.
- `ImportSuccess` - flag to signal if import was successful (true) or not (false).
- `ImportError` - (optional) error text if import failed.

## Examples

### Create a revision event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789012</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-01-01T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <RevisionEvent Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="1234">
        <SubEvent Status="Planned" Description="" Value="1">
          <Frequency Start="2022-04-06T06:00:00Z" End="2022-04-06T10:00:00Z" />
        </SubEvent>
      </RevisionEvent>
    </AvailabilityEvents>
  </Inputs>
</Request>
````

### Update a revision event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789013</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-01-02T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <RevisionEvent Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="1234">
        <SubEvent Status="Planned" Description="Updated with real dates"
Value="1">
          <Frequency Start="2022-04-06T07:10:00Z" End="2022-04-06T09:45:00Z" />
        </SubEvent>
      </RevisionEvent>
    </AvailabilityEvents>
  </Inputs>
</Request>
````

### Delete a revision event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789014</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-01-03T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <AvailabilityEventRemove Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="1234" />
    </AvailabilityEvents>
  </Inputs>
</Request>
````

### Create a restriction event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789015</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-02-01T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <RestrictionEvent Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="2345"
Category="PowerUnavailable[MW]">
        <SubEvent Status="SelfImposed" Description="" Value="-1">
          <Frequency Start="2022-04-06T06:00:00Z" End="2022-04-06T10:00:00Z" />
        </SubEvent>
      </RestrictionEvent>
    </AvailabilityEvents>
  </Inputs>
</Request>
````

### Update a restriction event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789016</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-02-02T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <RestrictionEvent Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="2345"
Category="PowerUnavailable[MW]">
        <SubEvent Status="SelfImposed" Description="" Value="-1">
          <Frequency Start="2022-04-06T06:00:00Z" End="2022-04-06T10:00:00Z" />
        </SubEvent>
      </RestrictionEvent>
    </AvailabilityEvents>
  </Inputs>
</Request>
````

### Delete a restriction event

````xml
<?xml version="1.0" encoding="utf-8"?>
<Request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <MessageId>12345678-1234-1234-1234-123456789017</MessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ForceAvailabilityEventCreation>true</ForceAvailabilityEventCreation>
  <Sender>SenderName</Sender>
  <Receiver>Mesh</Receiver>
  <CreationDate>2021-02-03T01:00:00+01:00</CreationDate>
  <Inputs>
    <AvailabilityEvents>
      <AvailabilityEventRemove Path="Mode/Company/Mesh" Search="*
[.Type=Generator&amp;&amp;.Name=ADKOL.856]" EventId="2345" />
    </AvailabilityEvents>
  </Inputs>
</Request
````

### Acknowledgement successful import

````xml
<?xml version="1.0" encoding="utf-8"?>
<Reply xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <RequestMessageId>12345678-1234-1234-1234-123456789012</RequestMessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ImportSuccess>true</ImportSuccess>
</Reply>
````

### Acknowledgement non-successful import

````xml
<?xml version="1.0" encoding="utf-8"?>
<Reply xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://www.powel.com/SmE/AMQPmessageTypes">
  <RequestMessageId>12345678-1234-1234-1234-123456789012</RequestMessageId>
  <MessageVersion>1.0.0.0</MessageVersion>
  <ImportSuccess>false</ImportSuccess>
  <ImportError>This is the error text from MESH</ImportError>
</Reply>
````
