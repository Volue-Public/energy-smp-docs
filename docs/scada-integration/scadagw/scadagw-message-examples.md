# mFRR related messages

- [mFRR related messages](#mfrr-related-messages)
  - [Activation message v1](#activation-message-v1)
  - [Activation plan message v2](#activation-plan-message-v2)
  - [Heartbeat message](#heartbeat-message)
  - [Acknowledge messages](#acknowledge-messages)

## Activation message v1

This message is used to transfer a total activation plan for one or more regulation units as simple start and stop periods, without ramping information:

- Version: always "1"
- DocumentIdentification - string identifying the production plan or activation message.
- TSType: string identifying the message type (mFRRAct, ProdMove or Heartbeat)

```json
{
    "TimeSeriesHeader":
    {
        "Version":"1",
        "DocumentIdentification":"0a983679-f1ed-48de-b995-a41da4a2d9b6",
        "Origin":"10X1001A1001A38Y",
        "TSType":"mFRRAct",
        "CreatedDateTime":"2023-10-06T01:41:50.6123401Z"
    },
    "TimeSeries":
    [
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-06T04:00:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"14"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-06T04:15:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"0"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-29T00:00:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"0"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-29T00:45:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"10"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-29T01:00:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"10"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-29T01:15:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"0"
                }
            ]
        },
        {
            "TSReference":"TestOpr",
            "TimeStamp":"2023-10-29T02:00:00Z",
            "MeasureUnit":"MAW ",
            "Values":
            [
                {
                    "Value":"0"
                }
            ]
        }
    ]
}
```

## Activation plan message v2

This message is used to transfer a total activation plan for one or more regulation units, inclusive up- and down ramping periods:

- Version: allways "2"
- DocumentIdentification - string identifying the production plan or activation message.
- TSType: string identifying the message type (mFRRAct, ProdMove or Heartbeat)

```json
{
    "TimeSeriesHeader":
    {
        "Version": "2",
        "DocumentIdentification": "123456",
        "Origin": "10Y1001A1001A91G",
        "TSType": "mFRRAct",
        "CreatedDateTime": "2022-02-10T02:08:04Z"
    }, 
    "TimeSeries": 
    [
        {
            "TSReference": "Gen1-ProdPlanAddition",
            "MeasureUnit": "MW",
            "Values":
            [
                {
                    "TimeStamp": "2022-02-10T02:00:00Z",
                    "Value": "0"
                },
                {
                    "TimeStamp": "2022-02-10T02:10:00Z",
                    "Value": "0"
                },
                {
                    "TimeStamp": "2022-02-10T02:11:00Z",
                    "Value": "5"
                },
                {
                    "TimeStamp": "2022-02-10T02:12:00Z",
                    "Value": "10"
                },
                {
                    "TimeStamp": "2022-02-10T02:13:00Z",
                    "Value": "15"
                },
                {
                    "TimeStamp": "2022-02-10T02:14:00Z",
                    "Value": "20"
                },
                {
                    "TimeStamp": "2022-02-10T02:15:00Z",
                    "Value": "25"
                },
                {
                    "TimeStamp": "2022-02-10T02:16:00Z",
                    "Value": "30"
                },
                {
                    "TimeStamp": "2022-02-10T02:17:00Z",
                    "Value": "35"
                },
                {
                    "TimeStamp": "2022-02-10T02:18:00Z",
                    "Value": "40"
                },
                {
                    "TimeStamp": "2022-02-10T02:19:00Z",
                    "Value": "45"
                },
                {
                    "TimeStamp": "2022-02-10T02:20:00Z",
                    "Value": "50"
                },
                {
                    "TimeStamp": "2022-02-10T02:25:00Z",
                    "Value": "50"
                },
                {
                    "TimeStamp": "2022-02-10T02:26:00Z",
                    "Value": "45"
                },
                {
                    "TimeStamp": "2022-02-10T02:27:00Z",
                    "Value": "40"
                },
                {
                    "TimeStamp": "2022-02-10T02:28:00Z",
                    "Value": "35"
                },
                {
                    "TimeStamp": "2022-02-10T02:29:00Z",
                    "Value": "30"
                },
                {
                    "TimeStamp": "2022-02-10T02:30:00Z",
                    "Value": "25"
                },
                {
                    "TimeStamp": "2022-02-10T02:31:00Z",
                    "Value": "20"
                },
                {
                    "TimeStamp": "2022-02-10T02:32:00Z",
                    "Value": "15"
                },
                {
                    "TimeStamp": "2022-02-10T02:33:00Z",
                    "Value": "10"
                },
                {
                    "TimeStamp": "2022-02-10T02:34:00Z",
                    "Value": "5"
                },
                {
                    "TimeStamp": "2022-02-10T02:35:00Z",
                    "Value": "5"
                },
                {
                    "TimeStamp": "2022-02-10T03:00:00Z",
                    "Value": "0"
                }
            ]
        }
    ] 
} 
```

## Heartbeat message

This message is used to transfer a heartbeat message from the TSO to the Scada system. The format is equal
with the Activation plan message, just data is different:

```json
{
    "TimeSeriesHeader":
    {
        "Version": "2",
        "DocumentIdentification": "0a983679-f1ed-48de-b995-a41da4a2d9b6",
        "Origin": "10Y1001A1001A91G",
        "TSType": "Heartbeat",
        "CreatedDateTime": "2022-02-10T22:37:38.6123401Z"
    },
    "TimeSeries":
    [
        {
            "TSReference": "DUMMY_RESOURCE",
            "MeasureUnit": "MW",
            "Values":
            [
                {
                    "TimeStamp": "2022-02-10T22:45:00Z",
                    "Value": "0"
                },
                {
                    "TimeStamp": "2022-02-10T23:00:00Z",
                    "Value": "0"
                }
            ]
        }
    ] 
} 
```

## Acknowledge messages

This message is used to transfer the confirmation response from the Scada system when handling production
plans and activation requests. The format must be defined together with the Scada vendors, but should
contain the following information:

- RequestMessageId - string with a reference from the original production plan or activation message.
- MessageVersion - string with version number (1 or 2)
- MessageType - string describing the original message (ProdMove, mFRRAct or Heartbeat)
- ImportSuccess - boolean describing if the import into the Scada system was successful or not (true/false)
- ImportError - optional string describing the reason for failure within the Scada system

Example of how a positive acknowledge message is looking like:

```json
{
    "Acknowledge":
    {
        "RequestMessageId": "E6D19A7E-9901-493D-B22F-A4587E56BDA3",
        "MessageVersion": "2",
        "MessageType": "mFRRAct",
        "ImportSuccess": true
    }
}
```

... and a negative acknowledge message will look like this:

```json
{
    "Acknowledge": 
    {
        "RequestMessageId": "E6D19A7E-9901-493D-B22F-A4587E56BDA3",
        "MessageVersion": "2",
        "MessageType": "mFRRAct",
        "ImportSuccess": false,
        "ImportError": "This is a description of what was the import problem"
    }
}
```
