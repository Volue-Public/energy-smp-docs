# Public Mesh REST API v.1.9.1 for Volue Mesh

A public Mesh REST API to access Volue Mesh information.

*All operations requiring a sessionId should be used within a session that is always using CreateSession and CloseSession, and DoCommit or DoRollback for write operations. Changing the configuration should change this requirement for testing purposes only.*

A Swagger interface is provided by the REST API and is available to local users of the API for documentation and manual testing. _**Note! It is possible to remove the Swagger interface from the configuration of the service.**_

## Version **v1** Endpoints

### `GET /api/v1/GetVersion`

*Returns the version of the Mesh service and the REST API.*

GET /api/v1/GetVersion

**Response Body**

Schema: [MeshVersionInfo](#meshversioninfo)

```json
{
  "meshVersion": "string",
  "apiVersion": "string"
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetUserIdentity`

*Returns the identity of the user that is authorised by the Mesh server.*

GET /api/v1/GetUserIdentity

**Response Body**

Schema: [MeshUserIdentityInfo](#meshuseridentityinfo)

```json
{
  "displayName": "string",
  "source": "string",
  "identifier": "string"
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/CreateSession`

*Create a new Mesh session.*

GET /api/v1/CreateSession

**Response Body**

Schema: string($uuid)

```json
"3fa85f64-5717-4562-b3fc-2c963f66afa6"
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/Commit`

*Commit changes within a Mesh session to the data store.*

POST /api/v1/Commit
{
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the session to commit. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/Rollback`

*Removes all changes introduced in a Mesh session.*

POST /api/v1/Rollback
{
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the session to rollback changes from. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/CloseSession`

*Closes an existing Mesh session.*

GET /api/v1/CloseSession
{
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the Mesh session to close. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/ExtendSession`

*Extends life of an existing Mesh session.*

GET /api/v1/ExtendSession
{
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the Mesh session to extend. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/ReadTimeSeriesValuesRaw`

*Read raw time series values from Mesh for a specific time series.*

GET /api/v1/ReadTimeSeriesValuesRaw
{
  "timeSeriesPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1.Temperature",
  "timeSeriesId": null,
  "timeSeriesKey": null,
  "valuesFrom": "2023-01-01T00:00:00Z",
  "valuesTo": "2023-01-02T00:00:00Z",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `timeSeriesPath` | query | No | Full Mesh path to the wanted time series. | string |
| `timeSeriesId` | query | No | Id to the wanted time series. | string |
| `timeSeriesKey` | query | No | Key to the wanted time series. | integer |
| `valuesFrom` | query | No | Start of the time interval to fetch values from. | string |
| `valuesTo` | query | No | End of the time interval to fetch values from. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: [MeshTimeseriesValues](#meshtimeseriesvalues)

```json
{
  "id": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  },
  "resolution": "Unspecified",
  "interval": {
    "startTime": "2025-10-29T07:26:12.788Z",
    "endTime": "2025-10-29T07:26:12.788Z"
  },
  "values": [
    {
      "date": "2025-10-29T07:26:12.788Z",
      "value": 0,
      "status": 0
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/ReadTimeSeriesValues`

*Read time series values from Mesh for a specific time series. The values can be transformed to a different resolution and time zone than the values stored in Mesh.*

GET /api/v1/ReadTimeSeriesValues
{
  "timeSeriesPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1.Temperature",
  "timeSeriesId": null,
  "timeSeriesKey": null,
  "valuesFrom": "2023-01-01T00:00:00Z",
  "valuesTo": "2023-01-02T00:00:00Z",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5",
  "resolution": "Hour",
  "accFunc": "AccDefault",
  "timeZone": "Standard"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `timeSeriesPath` | query | No | Full Mesh path to the wanted time series. | string |
| `timeSeriesId` | query | No | Id to the wanted time series. | string |
| `timeSeriesKey` | query | No | Key to the wanted time series. | integer |
| `valuesFrom` | query | No | Start of the time interval to fetch values from. | string |
| `valuesTo` | query | No | End of the time interval to fetch values from. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |
| `resolution` | query | No | The resolution that the data is wanted for. | - |
| `accFunc` | query | No | Specifies how data are aggregated to longer time intervals. | - |
| `timeZone` | query | No | Specifies the time zone of the returned time points. | - |

**Response Body**

Schema: [MeshTimeseriesValues](#meshtimeseriesvalues)

```json
{
  "id": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  },
  "resolution": "Unspecified",
  "interval": {
    "startTime": "2025-10-29T07:26:36.871Z",
    "endTime": "2025-10-29T07:26:36.871Z"
  },
  "values": [
    {
      "date": "2025-10-29T07:26:36.871Z",
      "value": 0,
      "status": 0
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/ReadTimeSeriesValuesMultiRaw`

*Read raw time series values from Mesh for several specific time series.*

POST /api/v1/ReadTimeSeriesValuesMultiRaw
{
  "timeSeries": [
    {
      "Path": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1.Temperature",
      "Id": null,
      "TimeseriesKey": null
    },
    {
      "Path": "Model/Company/Mesh.To_Areas/AREA2.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION2.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT2.Temperature",
      "Id": null,
      "TimeseriesKey": null
    }
  ],
  "valuesFrom": "2023-01-01T00:00:00Z",
  "valuesTo": "2023-01-02T00:00:00Z",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `valuesFrom` | query | No | Start of the time interval to fetch values from. | string |
| `valuesTo` | query | No | End of the time interval to fetch values from. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

List of MeshTsId references to the wanted number of time series.

Schema: [[MeshTsId]](#meshtsid)

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  }
]
```

**Response Body**

Schema: [[MeshTimeseriesValues]](#meshtimeseriesvalues)

```json
[
  {
    "id": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "path": "string",
      "timeseriesKey": 0
    },
    "resolution": "Unspecified",
    "interval": {
      "startTime": "2025-10-29T07:26:56.514Z",
      "endTime": "2025-10-29T07:26:56.514Z"
    },
    "values": [
      {
        "date": "2025-10-29T07:26:56.514Z",
        "value": 0,
        "status": 0
      }
    ]
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/ReadTimeSeriesValuesMulti`

*Read time series values from Mesh for a list of specific time series. The values can be transformed to a different resolution and time zone than the values stored in Mesh.*

POST /api/v1/ReadTimeSeriesValuesMulti
{
  "timeSeries": [
    {
      "Path": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1.Temperature",
      "Id": null,
      "TimeseriesKey": null
    },
    {
      "Path": "Model/Company/Mesh.To_Areas/AREA2.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION2.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT2.Temperature",
      "Id": null,
      "TimeseriesKey": null
    }
  ],
  "valuesFrom": "2023-01-01T00:00:00Z",
  "valuesTo": "2023-01-02T00:00:00Z",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5",
  "resolution": "Hour",
  "accFunc": "AccDefault",
  "timeZone": "Standard"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `valuesFrom` | query | No | Start of the time interval to fetch values from. | string |
| `valuesTo` | query | No | End of the time interval to fetch values from. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |
| `resolution` | query | No | The resolution that the data is wanted for. | - |
| `accFunc` | query | No | Specifies how data are aggregated to longer time intervals. | - |
| `timeZone` | query | No | Specifies the time zone of the returned time points. | - |

**Request Body**

List of MeshTsId references to the wanted number of time series.

Schema: [[MeshTsId]](#meshtsid)

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  }
]
```

**Response Body**

Schema: [[MeshTimeseriesValues]](#meshtimeseriesvalues)

```json
[
  {
    "id": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "path": "string",
      "timeseriesKey": 0
    },
    "resolution": "Unspecified",
    "interval": {
      "startTime": "2025-10-29T08:00:11.393Z",
      "endTime": "2025-10-29T08:00:11.393Z"
    },
    "values": [
      {
        "date": "2025-10-29T08:00:11.393Z",
        "value": 0,
        "status": 0
      }
    ]
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/WriteTimeSeriesValuesMultiRaw`

*Write raw time series values to Mesh for one or more specific time series*

***Note!*** *The `interval` for a time series must contain the value period for all value dates in `values`, and all values within the `interval` period are deleted before storing the values.*

POST /api/v1/WriteTimeSeriesValuesMultiRaw
[
  {
    "id": {
      "id": null,
      "path": "Model/Company/Mesh.To_Areas/AREA.To_HydMetStations/HydMetStations.To_HydMetWatercourse/WATERROUTE1.To_ForecastType/RadarMeteo.To_ForecastPoint/AREA1.Temperature",
      "timeseriesKey": null
    },
    "resolution": "Hour",
    "interval": {
      "startTime": "2023-01-01T00:00:00+01:00",
      "endTime": "2023-01-01T01:00:00+01:00"
    },
    "values": [
      {
        "date": "2023-01-01T00:00:00+01:00",
        "value": 123.1,
        "status": 0
      }
    ]
  }
]'

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

Values to be stored on the specified time series.

Schema: [[MeshTimeseriesValues]](#meshtimeseriesvalues)

```json
[
  {
    "id": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "path": "string",
      "timeseriesKey": 0
    },
    "resolution": "Unspecified",
    "interval": {
      "startTime": "2025-10-29T08:02:45.857Z",
      "endTime": "2025-10-29T08:02:45.857Z"
    },
    "values": [
      {
        "date": "2025-10-29T08:02:45.857Z",
        "value": 0,
        "status": 0
      }
    ]
  }
]
```

**Response Body**

Schema: [boolean]

```json
[
  true
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

#### Delete values from a time series

Deleting values are done automatically as part of the write process using the `WriteTimeSeriesValuesMultiRaw` function specifying the `interval` part for a time series to identify the period that should be replaced with the information in the `values` part.

_**Note!**_ For versions before 2026.1, there must be at least one value in the values part, but this can either be the last value before or after the period to delete, or a `0` value with `MISSING` status (=67108864).

**Example**

Values before (from `ReadTimeSeriesValuesRaw`):

```json
{
  "id": {
    "id": "e91f1ffd-e5ea-4916-a3ef-b35ee5ca3b95",
    "path": "[Full path to the time series]",
    "timeseriesKey": 131854
  },
  "resolution": "Min15",
  "interval": {
    "startTime": "2025-05-01T00:45:00Z",
    "endTime": "2025-05-01T01:45:00Z"
  },
  "values": [
    {
      "date": "2025-05-01T00:45:00Z",
      "value": 15,
      "status": 167772160
    },
    {
      "date": "2025-05-01T01:00:00Z",
      "value": 0,
      "status": 167772160
    },
    {
      "date": "2025-05-01T01:15:00Z",
      "value": 0,
      "status": 167772160
    },
    {
      "date": "2025-05-01T01:30:00Z",
      "value": 4,
      "status": 167772160
    }
  ]
}
```

Delete operation of the period between `01:00` (inclusive) and `01:30` (exclusive) using `WriteTimeSeriesValuesMultiRaw`:

```json
[
  {
    "id": {
      "id": null,
      "path": "[Full path to the time series]",
      "timeseriesKey": null
    },
    "interval": {
      "startTime": "2025-05-01T01:00:00Z",
      "endTime": "2025-05-01T01:30:00Z"
    }
  }
]
```

And the result is (from `ReadTimeSeriesValuesRaw`):

```json
{
  "id": {
    "id": "e91f1ffd-e5ea-4916-a3ef-b35ee5ca3b95",
    "path": "[Full path to the time series]",
    "timeseriesKey": 131854
  },
  "resolution": "Min15",
  "interval": {
    "startTime": "2025-05-01T00:45:00Z",
    "endTime": "2025-05-01T01:45:00Z"
  },
  "values": [
    {
      "date": "2025-05-01T00:45:00Z",
      "value": 15,
      "status": 167772160
    },
    {
      "date": "2025-05-01T01:00:00Z",
      "value": null,
      "status": 67108864 // status is missing
    },
    {
      "date": "2025-05-01T01:15:00Z",
      "value": null, 
      "status": 67108864 // status is missing
    },
    {
      "date": "2025-05-01T01:30:00Z",
      "value": 4,
      "status": 167772160
    }
  ]
}
```

### `POST /api/v1/CreatePhysicalTimeSeries`

*Creates a physical time series in the database.*

POST /api/v1/CreatePhysicalTimeSeries
{
  "path": "/Path/to/the/timeseries/",
  "name": "NameOfTheTimeSeries",
  "curveType": "Linear",
  "resolution": "Hour",
  "unitOfMeasurement": "kWh",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `path` | query | No | Path of the time series. _**Note!**_ The path will automatically be prepended with "Resource". | string |
| `name` | query | No | Name of the time series. _**Note!**_ The concatenated string of path and name must be unique in the database. | string |
| `curveType` | query | No | Curve type of the time series. | - |
| `resolution` | query | No | Resolution of the time series. | - |
| `unitOfMeasurement` | query | No | Name of the unit of measurement to use for the time series. _**Note!**_ This string must match an existing unit in Mesh. | string |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |

**Response Body**

Schema: [MeshTimeseriesResource](#meshtimeseriesresource)

```json
{
  "timeseriesKey": 0,
  "path": "string",
  "name": "string",
  "temporary": true,
  "curveType": "Unknown",
  "resolution": "Unspecified",
  "unitOfMeasurement": "string",
  "virtualTimeseriesExpression": "string"
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/ListModels`

*List path of existing models in Mesh.*

GET /api/v1/ListModels
{
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `sessionId` | query | No | Guid of the Mesh session to use. | string |

**Response Body**

Schema: [string]

```json
[
  "string"
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/SearchForObjects`

*Search for objects in the Mesh model.*

GET /api/v1/SearchForObjects
{
  "startObjectPath": "Model/Company/Mesh",
  "query": "*[.Type=HydroPlant]",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5",
  "maxNum": 10
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `startObjectPath` | query | No | Path to the object where the search is started from. | string |
| `query` | query | No | The search query. | string |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |
| `maxNum` | query | No | Maximum number of objects to return in the query, 0 means all. | integer |

**Response Body**

Schema: [[MeshObjectSimple]](#meshobjectsimple)

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "typeName": "string",
    "path": "string",
    "ownerId": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "path": "string",
      "timeseriesKey": 0
    }
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetObject`

*Get complete information of a given object in Mesh.*

GET /api/v1/GetObject
{
  "objectPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydroProduction/HydroAssets.To_WaterCourses/Asset1.To_HydroPlants/Unit1",
  "objectId": null,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `objectPath` | query | No | Full path to the object in Mesh. | string |
| `objectId` | query | No | Id to the object in Mesh. | string |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. If this parameter is not specified or is Guid.Empty a new session will be created and closed for this request. | string |

**Response Body**

Schema: [MeshObject](#meshobject)

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "typeName": "string",
  "path": "string",
  "ownerId": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  },
  "attributes": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "path": "string",
      "valueType": "Unspecified",
      "valueTypeCollection": true,
      "value": [
        {
          "intValue": 0,
          "doubleValue": 0,
          "boolValue": true,
          "stringValue": "string",
          "dateTimeValue": "2025-10-29T08:07:25.152Z",
          "timeSeriesValue": {
            "timeseriesResource": {
              "timeseriesKey": 0,
              "path": "string",
              "name": "string",
              "temporary": true,
              "curveType": "Unknown",
              "resolution": "Unspecified",
              "unitOfMeasurement": "string",
              "virtualTimeseriesExpression": "string"
            },
            "expression": "string",
            "isLocalExpression": true
          },
          "ownershipRelationValue": {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          "linkRelationValue": {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          "versionedLinkRelationValue": {
            "versions": [
              {
                "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "validFromTime": "2025-10-29T08:07:25.152Z"
              }
            ]
          },
          "valueOneofCase": "Unspecified"
        }
      ]
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/CreateObject`

*Create an object in the Mesh model below a given owner object.*

POST /api/v1/CreateObject
{
  "Name": "STATION2",
  "OwnerPath": "Model/Company/Mesh.To_Areas/AREA2.To_HydMetStations/HydMetStations.To_HydMetWatercourse",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `name` | query | No | Name of the object to create | string |
| `ownerPath` | query | No | Full path to the object that will be the owner of the new object. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: [MeshObject](#meshobject)

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "typeName": "string",
  "path": "string",
  "ownerId": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  },
  "attributes": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "path": "string",
      "valueType": "Unspecified",
      "valueTypeCollection": true,
      "value": [
        {
          "intValue": 0,
          "doubleValue": 0,
          "boolValue": true,
          "stringValue": "string",
          "dateTimeValue": "2025-10-29T08:08:28.339Z",
          "timeSeriesValue": {
            "timeseriesResource": {
              "timeseriesKey": 0,
              "path": "string",
              "name": "string",
              "temporary": true,
              "curveType": "Unknown",
              "resolution": "Unspecified",
              "unitOfMeasurement": "string",
              "virtualTimeseriesExpression": "string"
            },
            "expression": "string",
            "isLocalExpression": true
          },
          "ownershipRelationValue": {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          "linkRelationValue": {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          "versionedLinkRelationValue": {
            "versions": [
              {
                "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "validFromTime": "2025-10-29T08:08:28.339Z"
              }
            ]
          },
          "valueOneofCase": "Unspecified"
        }
      ]
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateObject`

*Update name and/or owner of an existing object in Mesh.*

POST /api/v1/UpdateObject
{
  "objectPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1",
  "objectId": null,
  "newName": "STATION2",
  "newOwnerPath": "Model/Company/Mesh.To_Areas/AREA2.To_HydMetStations/HydMetStations.To_HydMetWatercourse",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `objectPath` | query | No | Full path to the object to update. | string |
| `objectId` | query | No | Id to the object to update. | string |
| `newName` | query | No | New name of this object. null means keep the existing name. | string |
| `newOwnerPath` | query | No | Full path to the new owner of this object. null means keep the existing owner. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/DeleteObject`

*Delete an object in the Mesh model by specifying either full path or id to the object.*

POST /api/v1/DeleteObject
{
  "objectPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1",
  "objectId": null,
  "recursiveDelete": true,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `objectPath` | query | No | Full path to the object to delete. | string |
| `objectId` | query | No | Id to the object to delete. | string |
| `recursiveDelete` | query | No | Flag to signal if the deletion should be recursive or not. | boolean |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/SearchForAttributes`

*Search for attributes of a given type within the Mesh model.*

GET /api/v1/SearchForAttributes
{
  "startObjectPath": "Model/Company/Mesh",
  "query": "*[.Type=HydroPlant].ActivePower",
  "valueType": "Timeseries",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5",
  "maxNum": 10
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `startObjectPath` | query | No | Path to the object where the search is started from. | string |
| `query` | query | No | The search query. | string |
| `valueType` | query | No | The type of attribute that the search is for. | - |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |
| `maxNum` | query | No | Maximum number of time series attributes to return in the query, 0 means all. | integer |

**Response Body**

Schema: [[MeshAttributeSimple]](#meshattributesimple)

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "path": "string",
    "valueType": "Unspecified"
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetAttribute`

*Get the main references to the specified attribute. Either attributePath or attributeId must be specified.*

GET /api/v1/GetAttribute
{
  "attributePath": null,
  "attributeId": "4DAE6C79-62AB-4D0D-931E-CC59A18CA7DE",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | The full path to the wanted attribute. | string |
| `attributeId` | query | No | The id of the wanted attribute. | string |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |

**Response Body**

Schema: [MeshAttribute](#meshattribute)

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "path": "string",
  "valueType": "Unspecified",
  "valueTypeCollection": true,
  "value": [
    {
      "intValue": 0,
      "doubleValue": 0,
      "boolValue": true,
      "stringValue": "string",
      "dateTimeValue": "2025-10-29T08:10:50.725Z",
      "timeSeriesValue": {
        "timeseriesResource": {
          "timeseriesKey": 0,
          "path": "string",
          "name": "string",
          "temporary": true,
          "curveType": "Unknown",
          "resolution": "Unspecified",
          "unitOfMeasurement": "string",
          "virtualTimeseriesExpression": "string"
        },
        "expression": "string",
        "isLocalExpression": true
      },
      "ownershipRelationValue": {
        "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      },
      "linkRelationValue": {
        "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      },
      "versionedLinkRelationValue": {
        "versions": [
          {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "validFromTime": "2025-10-29T08:10:50.726Z"
          }
        ]
      },
      "valueOneofCase": "Unspecified"
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetTimeseriesResource`

*Get the time series resource for a given timeseriesKey.*

GET /api/v1/GetTimeseriesResource
{
  "timeseriesKey": 12345,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `timeseriesKey` | query | No | The key to the wanted time series resource. | integer |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |

**Response Body**

Schema: [MeshAttribute](#meshattribute)

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "path": "string",
  "valueType": "Unspecified",
  "valueTypeCollection": true,
  "value": [
    {
      "intValue": 0,
      "doubleValue": 0,
      "boolValue": true,
      "stringValue": "string",
      "dateTimeValue": "2025-10-29T08:11:41.574Z",
      "timeSeriesValue": {
        "timeseriesResource": {
          "timeseriesKey": 0,
          "path": "string",
          "name": "string",
          "temporary": true,
          "curveType": "Unknown",
          "resolution": "Unspecified",
          "unitOfMeasurement": "string",
          "virtualTimeseriesExpression": "string"
        },
        "expression": "string",
        "isLocalExpression": true
      },
      "ownershipRelationValue": {
        "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      },
      "linkRelationValue": {
        "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      },
      "versionedLinkRelationValue": {
        "versions": [
          {
            "targetObjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "validFromTime": "2025-10-29T08:11:41.574Z"
          }
        ]
      },
      "valueOneofCase": "Unspecified"
    }
  ]
}
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetRatingCurveVersions`

*Get rating curve version(s) from a rating curve attribute (`RatingCurveAttribute`).*

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | The full path to the wanted attribute. | string |
| `attributeId` | query | No | The id of the wanted attribute. | string |
| `fromDate` | query | No | Retrieve all versions that apply in the interval starting with fromDate. This may include one version with a `from` before the interval. | string |
| `toDate` | query | No | Retrieve all versions that apply in the interval ending with toDate. | string |
| `versionsOnly` | query | No | If set to true, just return the from value, and not the x_range_from and x_value_segments. | boolean |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |

**Response Body**

Schema: [[MeshRatingCurveVersion]](#meshratingcurveversion)

```json
[
  {
    "from": "2025-10-29T08:13:10.686Z",
    "xRangeFrom": 0,
    "segments": [
      {
        "xRangeUntil": 0,
        "factorA": 0,
        "factorB": 0,
        "factorC": 0
      }
    ]
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `GET /api/v1/GetXySets`

*Get zero or more `XySet`s from an XY-set attribute (`XYSetAttribute`) or
a versioned XY-set attribute (`XYZSeriesAttribute`).*

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | The full path to the wanted attribute. | string |
| `attributeId` | query | No | The id of the wanted attribute. | string |
| `fromDate` | query | No | For versioned XY sets (`XYZSeriesAttribute`) retrieve all versions that apply in the interval beginning with fromDate. This may include one version with a `valid_from_time` before fromDate. For non-versioned XY-set attributes (`XYSetAttribute`) fromDate must be null. | string |
| `toDate` | query | No | For versioned XY sets (`XYZSeriesAttribute`) retrieve all versions that apply in the interval ending with toDate. For non-versioned XY-set attributes (`XYSetAttribute`) toDate must be null. | string |
| `versionsOnly` | query | No | When set to true, the response only returns the periods of the found versions and not curves in the XyCurves. | boolean |
| `sessionId` | query | No | Guid of the Mesh session to use in the search. | string |

**Response Body**

Schema: [[MeshXySets]](#meshxyset)

```json
[
  {
    "validFromTime": "2025-10-29T08:14:18.244Z",
    "xyCurves": [
      {
        "referenceValue": 0,
        "xValues": [
          0
        ],
        "yValues": [
          0
        ]
      }
    ]
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateIntAttribute`

*Change value for an integer attribute on an object. The value to update may be null or a single value.*

POST /api/v1/UpdateIntParameter
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1/Attribute1",
  "value": 123,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `value` | query | No | The value to use to change the attribute. This may null to nullify the value or a value to update the attribute with. | integer |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateDoubleAttribute`

*Change value for a double attribute on an object. The value to update may be null or a single value.*

POST /api/v1/UpdateDoubleParameter
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1/Attribute1",
  "attributeId": null,
  "value": 123.1,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `value` | query | No | The value to use to change the attribute. This may null to nullify the value or a value to update the attribute with. | number |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateBoolAttribute`

*Change value for a bool attribute on an object. The value to update may be null or a single value.*

POST /api/v1/UpdateBoolParameter
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1/Attribute1",
  "attributeId": null,
  "value": true,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `value` | query | No | The value to use to change the attribute. This may null to nullify the value or a value to update the attribute with. | boolean |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateStringAttribute`

*Change value for a string attribute on an object. The value to update may be null or a single value.*

POST /api/v1/UpdateStringParameter
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1/Attribute1",
  "attributeId": null,
  "value": "This is a test",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `value` | query | No | The value to use to change the attribute. This may null to nullify the value or a value to update the attribute with. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateDateTimeAttribute`

*Change value for a date time attribute on an object. The value to update may be null or a single value.*

POST /api/v1/UpdateDateTimeParameter
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1/Attribute1",
  "attributeId": null,
  "value": "2023-12-10T12:23:14+02:00",
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `value` | query | No | The value to use to change the attribute. This may null to nullify the value or a value to update the attribute with. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateTimeSeriesAttribute`

*Change the time series definition for an attribute on an object. The values to update are either a time series resource or a local expression.*

POST /api/v1/UpdateTimeSeriesAttribute
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1",
  "attributeId": null,
  "newLocalExpression": null,
  "newTimeSeriesKey": 12345,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `newLocalExpression` | query | No | The new local expression to set on the time series attribute. Specified as null means to keep the existing expression, specified as a string with just spaces means to delete the existing expression. | string |
| `newTimeSeriesKey` | query | No | Reference (as TIMESER.TIMS_KEY) to the new time series resource to set on the time series attribute. Specified as null means to keep the existing value, specified as 0 means to delete the existing value. | integer |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateLinkRelationAttribute`

*Update the link relation for an attribute on an object. The values to update are either a time series resource or a local expression.*

POST /api/v1/UpdateTimeSeriesAttribute
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/UNIT1",
  "attributeId": null,
  "newTargets": [{
    "Path": null,
    "Id": "1236532d-472d-46b3-8996-1c414398c103",
    "TimeseriesKey": null
  }]
  "newLocalExpression": null,
  "newTimeSeriesResourceKey": 12345,
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `append` | query | No | Flag to signal if the new object links (true) shall be added to the existing links or (false) replace the existing links. | boolean |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

List of objects references to the objects to add links to.

Schema: [[MeshTsId]]

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "path": "string",
    "timeseriesKey": 0
  }
]
```

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateRatingCurveVersions`

*Create, update, and/or delete rating curve versions in a rating curve attribute (`RatingCurveAttribute`).*

POST /api/v1/UpdateRatingCurveVersions
{
  "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/RatingCurve",
  "attributeId": null,
  "fromDate": "2023-01-01T00:00:00+01:00",
  "toDate": "2024-01-01T00:00:00+01:00",
  "versions": [{
  }],
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `fromDate` | query | No | All existing rating curve versions inside the interval will be deleted. fromDate specifies the start of the interval. | string |
| `toDate` | query | No | All existing rating curve versions inside the interval will be deleted. toDate specifies the end of the interval. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

Update rating curve versions for rating curve attribute. The `from` of all versions must be inside the interval. All versions must be sorted by `from`.

```json
[
  {
    "from": "2025-10-29T08:18:56.941Z",
    "xRangeFrom": 0,
    "segments": [
      {
        "xRangeUntil": 0,
        "factorA": 0,
        "factorB": 0,
        "factorC": 0
      }
    ]
  }
]
```

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/UpdateXySets`

*Create, update, and/or delete `XySet`s in an XY-set attribute (`XYZAttribute`) or a versioned XY-set attribute (`XYZSeriesAttribute`).*

 POST /api/v1/UpdateXySets
 {
   "attributePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydMetStations/HydMetStations.To_HydMetWatercourse/STATION1.To_ForecastType/RadarMeteo.To_ForecastPoint/XYset",
   "attributeId": null,
   "fromDate": "2023-01-01T00:00:00+01:00",
   "toDate": "2024-01-01T00:00:00+01:00",
   "xySets": [{
   }],
   "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
 }

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `attributePath` | query | No | Full path to the attribute to change. | string |
| `attributeId` | query | No | The id of the attribute to change. | string |
| `fromDate` | query | No | For versioned XY-sets all existing XY-sets inside the interval will be deleted, fromDate specifies the start of the interval. For non-versioned XY-sets (`XYSetAttribute`) this must be null. | string |
| `toDate` | query | No | For versioned XY-sets all existing XY-sets inside the interval will be deleted, fromDate specifies the start of the interval. For non-versioned XY-sets (`XYSetAttribute`) this must be null. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

If updating a versioned XY-set attribute (`XYZSeriesAttribute`) the `XySet`s in xySets will be inserted in the XY-set series. The validFromTime of all XY-sets must be inside the interval.

_**Note!**_ If updating a non-versioned XY-set attribute (`XYSetAttribute`) this must contain zero or one `XySet`.

Schema: [[MeshXySet]](#meshxyset)

```json
[
  {
    "validFromTime": "2025-10-29T08:20:42.431Z",
    "xyCurves": [
      {
        "referenceValue": 0,
        "xValues": [
          0
        ],
        "yValues": [
          0
        ]
      }
    ]
  }
]
```

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/ImportMultistepWaterValueFunctions`

*Import a multistep water value function into the Mesh model.

_**Note!**_ In order to ensure efficient data management, this method will also automatically delete old water value functions which have the same structure as the one you import, and which are older than a specific retention period specified as `DeleteWaterValuesOlderThanDays` in the API configuration.

POST /api/v1/ImportMultistepWaterValueFunctions
{
  "waterCoursePath": "Model/Company/Mesh.To_Areas/AREA1.To_HydroProduction/HydroAssets.To_WaterCourses/WATERCOURSE1",
  "waterCourseId": null,
  "wvfMainPath": "Model/Company/Mesh.To_Areas/AREA1.To_HydroProduction/HydroAssets.has_WaterValueFunctionsMain/WaterValueFunctionMain",
  "wvfMainId": null,
  "waterValueDate": "2024-08-15T12:45:00Z",
  "wvfName": "WATERCOURSE1-2024-08-15T12:45",
  "cutGroupName": "WATERCOURSE1",
  "multiStepWaterValuesList": [{
      "reservoirName": "RESERVOIR1",
      "volumesInMm3": [ 0.000, 105.600, 119.690, ..., 146.230, 172.020 ],
      "valuesInEuroPerMm3": [ 8176.960, 8152.450, 8127.940, ..., 7466.140, 0.000 ]
    },{
      "reservoirName": "RESERVOIR2",
      "volumesInMm3": [ 0.000, 0.001, 0.796, ..., 0.805, 1.380 ],
      "valuesInEuroPerMm3: [ 84600.000, 84599.999, 76148.460, 84.601, 0.000 ]
    }],
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `waterCoursePath` | query | No | Full path to the water course object where the reservoirs exist below. | string |
| `waterCourseId` | query | No | Id of the water course object where the reservoirs exist below. | string |
| `wvfMainPath` | query | No | Full path to the main water value function object. | string |
| `wvfMainId` | query | No | Id of the main water value function object. | string |
| `wvfName` | query | No | Name of the water value function to create. | string |
| `waterValueDate` | query | No | Date and time that the water values were created for. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

Schema: [[MultiStepWaterValues]](#multistepwatervalues)

The list of multi step water values to use.

```json
[
  {
    "reservoirName": "string",
    "volumesInMm3": [
      0
    ],
    "valuesInEuroPerMm3": [
      0
    ]
  }
]
```

**Response Body**

Schema: boolean

```json
true
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

### `POST /api/v1/IdentifyVirtualTSusage`

*List all usage of SmG virtual time series in the given object types below the given start object.*

POST /api/v1/IdentifyVirtualTSusage
{
  "modePath": "Model/Company",
  "objectTypes": [ "HydroPlant" ]
  "sessionId": "AC51A5CF-786B-4C19-ADF9-BC1073718DE5"
}

**Parameters**

| Name | In | Required | Description | Type |
|------|----|----------|-------------|------|
| `modelPath` | query | No | Path to the start object for the search. | string |
| `sessionId` | query | No | Guid of the Mesh session to use when reading values. | string |

**Request Body**

List of object types to search for vts usage in.

Schema: [string]

```json
[
  "string"
]
```

**Response Body**

Schema: [[VirtualTSinfo]](#virtualtsinfo)

```json
[
  {
    "attributePath": "string",
    "timeseriesKey": 0,
    "virtualExpression": "string"
  }
]
```

**Returned Status Codes**

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 499 | Client Error |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

## Version **v1** Schemas

### MeshAccumulationEnum

*Describes how accumulation to a longer resolution shall be performed.*

- `AccDefault` - Use the default accumulation method as defined by Mesh and depends on measuring unit, time series type and resolution.
- `AccSum` - Accumulate using sum of the values.
- `AccAverage` - Accumulate using the average value.
- `AccFirst` - Accumulate using the first value.
- `AccLast` - Accumulate using the last value.

Type: string
Enum: [AccSum, AccAverage, AccFirst, AccLast]

### MeshAttribute

*The complete description of a specific attribute in Mesh.*

Type: object

Properties:

- `id`: The Id as GUID of this attribute.
  - type: string
  - format: uuid
  - nullable: true
- `name`: The name of this attribute.
  - type: string
  - nullable: true
- `path`: The complete path within Mesh to this attribute.
  - type: string
  - nullable: true
- `valueType`: The value type of this attribute.
  - type: string
  - nullable: true
  - Enum: [MeshAttributeValueEnum](#meshattributevalueenum)
- `valueTypeCollection`: Flag to signal that the value is a collection list.
  - type: boolean
  - nullable: true
- `value`: The list of values.
  - type: array of [MeshAttributeValue](#meshattributevalue)
  - nullable: true

### MeshAttributeSimple

*The minimal description of a specific attribute in Mesh.*

Type: object

Properties:

- `id`: The Id as GUID of this attribute.
  - type: string
  - format: uuid
  - nullable: true
- `name`: The name of this attribute.
  - type: string
  - nullable: true
- `path`: The complete path within Mesh to this attribute.
  - type: string
  - nullable: true
- `valueType`: Type of the attribute.
  - type: [MeshAttributeValueEnum](#meshattributevalueenum)
  - nullable: true

### MeshAttributeValue

*The object containing an attribute value.*

Type: object

Properties:

- `intValue`: The integer value.
  - type: integer
  - format: int64
  - nullable: true
- `doubleValue`: The floating point value.
  - type: number
  - format: double
  - nullable: true
- `boolValue`: The boolean value.
  - type: boolean
  - nullable: true
- `stringValue`: The string value.
  - type: string
  - nullable: true
- `dateTimeValue`: The date time value.
  - type: string
  - format: date-time
  - nullable: true
- `timeSeriesValue`: The time series reference value.
  - type: [MeshTimeseries](#meshtimeseries)
  - nullable: true
- `ownershipRelationValue`: The ownership relation value.
  - type: [MeshOwnershipRelation](#meshownershiprelation)
  - nullable: true
- `linkRelationValue`: The link relation value.
  - type: [MeshLinkRelation](#meshlinkrelation)
  - nullable: true
- `versionedLinkRelationValue`: The time dependent link relation value.
  - type: [MeshVersionedLinkRelation](#meshversionedlinkrelation)
  - nullable: true
- `valueOneofCase`: Describing which of the value types that this attribute is containing.
  - type: [MeshAttributeValueEnum](#meshattributevalueenum)
  - nullable: true

### MeshAttributeValueEnum

*Type of attribute values.*

- `Unspecified` - value type is not specified.
- `Int` - value is an integer.
- `Double` - value is floating number.
- `Bool` - value is a boolean flag.
- `String` - value is a string.
- `UtcTime` - value is a date time.
- `Timeseries` - value is a time series.
- `OwnershipRelation` - value is an ownership relation.
- `LinkRelation` - value is a link relation.
- `VersionedLinkRelation` - value is a time dependent link relation.

Type: string

Enum: [Unspecified,Int,Double,Bool,String,UtcTime,Timeseries,OwnershipRelation,LinkRelation,VersionedLinkRelation,RatingCurve,XySet]

### MeshCurveTypeEnum

*The valid curve types used by Mesh:*

- `Unknown` - Curve type is not defined.
- `Staircasestartofstep` - Curve type is a staircase which start at the start of the period between two values.
- `Piecewiselinear` - Curve type is linear between two values.
- `Staircase` - Curve type is a staircase which start at the end of the period between two values.

Type: string

Enum: [Unknown,Staircasestartofstep,Piecewiselinear,Staircase]

### MeshInterval

*Definition of a time interval.*

Type: object

Properties:

- `startTime`: Date time of the start of the interval.
  - type: string
  - format: date-time
  - nullable: true
- `endTime`: Date time of the end of the interval.
  - type: string
  - format: date-time
  - nullable: true

### MeshLinkRelation

*Definition of a link relation in Mesh.*

Type: object

Properties:

- `targetObjectId`: The identity of the object that is linked to by the current object.
  - type: string
  - format: uuid

### MeshLinkRelationVersion

*Definition of a versioned link relation in Mesh.*

Type: object

Properties:

- `targetObjectId`: The identity of the object that is linked to by the current object in this version.
  - type: string
  - format: uuid
  - nullable: true
- `validFromTime`: The date time when this version is valid from.
  - type: string
  - format: date-time

### MeshObject

*The complete description of a specific Mesh object.*

Type: object

Properties:

- `id`: The Id as GUID of this object.
  - type: string
  - format: uuid
  - nullable: true
- `name`: The name of this object.
  - type: string
  - nullable: true
- `typeName`: The type name of this object.
  - type: string
  - nullable: true
- `path`: The complete path within Mesh to this object.
  - type: string
  - nullable: true
- `ownerId`: The reference to the object that is owning this object.
  - type: [MeshReferencedObject](#meshreferencedobject)
  - nullable: true
- `attributes`: The list of attributes describing this object.
  - type: array of [MeshAttribute](#meshattribute)
  - nullable: true

### MeshObjectSimple

*The minimal information of a specific Mesh object.*

Type: object

Properties:

- `id`: The Id as GUID of this object.
  - type: string
  - format: uuid
  - nullable: true
- `name`: The name of this object.
  - type: string
  - nullable: true
- `typeName`: The type name of this object.
  - type: string
  - nullable: true
- `path`: The complete path within Mesh to this object.
  - type: string
  - nullable: true
- `ownerId`: The reference to the object that is owning this object.
  - type: [MeshReferencedObject](#meshreferencedobject)
  - nullable: true

### MeshOwnershipRelation

*Definition of a ownership relation in Mesh.*

Type: object

Properties:

- `targetObjectId`: The identity of the object that is owned by the current object.
  - type: string
  - format: uuid

### MeshRatingCurveSegment

*Definition of a rating curve segment.*

Type: object

Properties:

- `xRangeUntil`: X value which the curve segment is valid until.
  - type: number
  - format: double
- `factorA`: Factor A of the curve segment.
  - type: number
  - format: double
- `factorB`: Factor B of the curve segment.
  - type: number
  - format: double
- `factorC`: Factor C of the curve segment.
  - type: number
  - format: double

### MeshRatingCurveVersion

*Definition of a rating curve version.*

Type: object

Properties:

- `from`: Date time when the rating curve is valid from.
  - type: string
  - format: date-time
- `xRangeFrom`: X value which the curve is valid from.
  - type: number
  - format: double
- `segments`: List of rating curve segments.
  - type: array of [MeshRatingCurveSegment](#meshratingcurvesegment)

### MeshReferencedObject

*The reference to a specific object in Mesh.*

Type: object

Properties:

- `id`: The Id as GUID of this object.
  - type: string
  - format: uuid
  - nullable: true
- `path`: The complete path within Mesh to this object.
  - type: string
  - nullable: true
- `timeseriesKey`: The key to the time series in the Oracle database. _**Note!**_ Only if it is a time series stored in the database.
  - type: integer
  - format: int64
  - nullable: true

### MeshResolutionEnum

*Definition of the time series resolution (that is the time distance between each value).*

- `Unspecified` - resolution is not set. This enum value is used only in cases where no resolution is set. Very limited usage.
- `Undefined` - resolution is undefined. This resolution is returned from Mesh only in edge cases, like no values or single NaN value.
- `Breakpoint` - resolution may vary between each value.
- `Min15` - resolution is 15 minutes between each value.
- `Min30` - resolution is 30 minutes between each value.
- `Hour` - resolution is 1 hour (60 minutes) between each value.
- `Day` - resolution is 1 day between each value.
- `Week` - resolution is 1 week (7 days) between each value.
- `Month` - resolution is 1 month between each value.
- `Year` - resolution is 1 year between each value.

_**Note!**_ For intervals larger than 1 hour, the number of hours may depend on the time zone used.

Type: string

Enum: [Unspecified,Breakpoint,Min15,Hour,Day,Week,Month,Year,Min30,Undefined]

### MeshTimeZoneAlignmentEnum

*Definition of how to align time stamps and resolution to different time zones.*

- `UTC` - time stamps and intervals are UTC aligned.
- `Standard` - time stamps and intervals are aligned to the local time zone.
- `StandardWoDST` - time stamps and intervals are aligned to the local time zone without DST adjustment.

Type: string

Enum: [UTC,Standard,StandardWoDST]

### MeshTimeseries

*Definition of a time series in Mesh.*

Type: object

Properties:

- `timeseriesResource`: Path to the time series in the Resources definition.
  - type: [MeshTimeseriesResource](#meshtimeseriesresource)
  - nullable: true
- `expression`: Expression that describes the calculation for this time series.
  - type: string
  - nullable: true
- `isLocalExpression`: Flag to signal if this expression is local (true) or coming from the template (false).
  - type: boolean
  - nullable: true

### MeshTimeseriesResource

*Definition of a time series in the Resource catalogue.*

Type: object

Properties:

- `timeseriesKey`: The key to the time series in the Oracle database.
  - type: integer
  - format: int64
- `path`: The path to the time series in the Resource catalogue.
  - type: string
  - nullable: true
- `name`: The name of the time series in the catalogue.
  - type: string
  - nullable: true
- `temporary`: Flag to signal that this time series is not stored in the database.
  - type: boolean
- `curveType`: The curve type to use when presenting/use this time series.
  - type: [MeshCurveTypeEnum](#meshcurvetypeenum)
  - nullable: true
- `resolution`: The resolution (time period between each value) of this time series
  - type: [MeshResolutionEnum](#meshresolutionenum)
  - nullable: true
- `unitOfMeasurement`: The unit of measurement for the values of this time series.
  - type: string
  - nullable: true
- `virtualTimeseriesExpression`: The calculation expression if this time series is a virtual time series (that is: the values are calculated based on other time series).
  - type: string
  - nullable: true

### MeshTimeseriesValues

*Definition of the values of a specific time series in Mesh.*

Type: object

Properties:

- `id`: Identity of this time series in Mesh.
  - type: [MeshTsId](#meshtsid)
  - nullable: true
- `resolution`: Resolution of the time series values.
  - type: [MeshResolutionEnum](#meshresolutionenum)
  - nullable: true
- `interval`: The time interval that the values are defined within. Values are time stamped at the beginning of the time interval it is describing, which means that the Interval is one time resolution interval longer than the date time of the last value in the interval.
  - type: [MeshInterval](#meshinterval)
  - nullable: true
- `values`: List of values for this time series.
  - type: array of [MeshValue](#meshvalue)
  - nullable: true

### MeshTsId

*The identity of a specific time series in Mesh.*

Type: object

Properties:

- `id`: The Id (as a GUID) of this time series.
  - type: string
  - format: uuid
  - nullable: true
- `path`: The complete path to this time series within the Mesh model.
  - type: string
  - nullable: true
- `timeseriesKey`: The key to this time series if it is stored in the Oracle database.
  - type: integer
  - format: int64
  - nullable: true

### MeshUserIdentityInfo

*Information related to the running Mesh service and the used REST API.*

Type: object

Properties:

- `displayName`: A human readable name identifying this user. This name should not be used as an unique identifier for the user as it may be identical between users and change over time.
  - type: string
  - nullable: true
- `source`: Security package name where the user identity came from. It is not an unique identifier of the security package instance.
  - type: string
  - nullable: true
- `identifier`: An identifier that uniquely identifies the user within given `source` instance, but not necessarily globally. Combining `source` and `identifier` does not guarantee to get globally unique identifier for the user as there may be different Active Directories using the same security packages (`source`) with  duplicated user identifiers. However such situation is rather unlikely.
  - type: string
  - nullable: true

### MeshValue

*Definition of a value point in Mesh.*

Type: object

Properties:

- `date`: Date time of the value point.
  - type: string
  - format: date-time
  - nullable: true
- `value`: The value of the value point.
  - type: number
  - format: double
  - nullable: true
- `status`: Quality status of the value point.
  - type: integer
  - format: int32
  - nullable: true

### MeshVersionInfo

*Information related to the running Mesh service and the used REST API.*

Type: object

Properties:

- `meshVersion`: The Mesh version string.
  - type: string
  - nullable: true
- `apiVersion`: The version of the Mesh REST API that is used.
  - type: string
  - nullable: true

### MeshVersionedLinkRelation

*Definition of a time dependent link relation in Mesh.*

Type: object

Properties:

- `versions`: List of versions of links to another object from the current object.
  - type: array of [MeshLinkRelationVersion](#meshlinkrelationversion)
  - nullable: true

### MeshXyCurve

*A `MeshXyCurve` is defined by a reference value (z value) and a set of (x,y) points.*

Type: object

Properties:

- `referenceValue`: The reference value (z value) for this `MeshXyCurve`.
  - type: number
  - format: double
- `xValues`: The x values for this `MeshXyCurve`. Must have the same length as `y_values`.
  - type: array of (type: number, format: double)
  - nullable: true
- `yValues`: The y values for this `MeshXyCurve`. Must have the same length as `x_values`.
  - type: array of (type: number, format: double)
  - nullable: true

### MeshXySet

*A `MeshXySet` is a set of `MeshXyCurve`s indexed by reference values, also known as z values.*

Type: object

Properties:

- validFromTime": If this `MeshXySet` is a part of a versioned XY set attribute in Mesh `valid_from_time` will contain the start of the active period for this `MeshXySet`. Otherwise `valid_from_time` will be null.
  - type: string
  - format: date-time
- `xyCurves`: A list of `MeshXyCurve`s in this `MeshXySet`. Always sorted by `reference_value`.
  - type: array of [MeshXyCurve](#meshxycurve)
  - nullable: true

### MultiStepWaterValues

*Water values information, combinations of water volume and price, related to a specific reservoir in the Mesh model.*

Type: object

Properties:

- `reservoirName`: The name of a reservoir in the Mesh model.
  - type: string
  - nullable: true
- `volumesInMm3`: List of reservoir volumes in Mm3 (million cubic meter). Must have the same length as `valuesInEuroPerMm3`.
  - type: array of (type: number, format: double)
  - nullable: true
- `valuesInEuroPerMm3`: List of values in Euro/Mm3. Must have the same length as `volumesInMm3`.
  - type: array of (type: number, format: double)
  - nullable: true

### VirtualTSinfo

*Attribute that references a virtual time series in the database.*

Type: object

Properties:

- `attributePath`: Full path to the attribute that references the virtual time series.
  - type: string
  - nullable: true
- `timeseriesKey`: Database key tom the virtual time series.
  - type: integer
  - format: int64
- `virtualExpression`: The calculation expression of the virtual time series.
  - type: string
  - nullable: true
