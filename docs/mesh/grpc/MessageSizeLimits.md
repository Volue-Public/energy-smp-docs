# Message size limits

## Overview

gRPC communication between Mesh clients and servers has specific message size limitations that
must be considered when designing applications and performing operations, particularly when working
with large datasets or time series data.

## Client-side limits

### Inbound messages (server to client)

By default, gRPC limits the size of inbound messages to **4MB**. This limit applies to responses
received from the Mesh server by the client.

When creating a connection to the Mesh server, clients can configure this limit to accommodate
larger responses if needed. This is particularly useful when:
- Running long simulations with datasets enabled
- Retrieving large amounts of data in a single operation
- Working with operations that may exceed the 4MB default limit

If the inbound message size exceeds the configured limit, a `RESOURCE_EXHAUSTED` status code will
be returned.

### Outbound messages (client to server)

gRPC outbound message size is **not limited by default** on the client side. However, this does
not mean unlimited data can be sent in a single request due to server-side restrictions (see
below).

## Server-side limits

### Inbound messages (client to server)

The Mesh server has a **fixed 4MB limit** for inbound messages. This limit is **not
configurable**. If a client sends a message that exceeds this limit, the request will be
discarded.

Due to this restriction, clients **must** send data in chunks when performing write operations
that could potentially exceed this limit, like writing time series points.

## Time series data

When working with time series data, keep the following in mind:
- A single time series point occupies **20 bytes**.
- To avoid exceeding the 4MB limit, a single read or write operation should contain approximately
  **200,000 points maximum**.
- Calculate the expected data size based on the number of points and time interval before
  performing operations.

## Time series data format

In Mesh gRPC API, Apache Arrow is used to represent [time series data](../concepts/time-series.md)
with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| utc_time | timestamp(ms) | UTC Unix timestamp in milliseconds (stored as 64-bit integer) |
| flags | uint32 | Status flags for the data point |
| value | double | The actual time series value |

Each point consists of these three fields, totaling 20 bytes per point.

## Best practices

### Reading data

When reading large amounts of time series data:
- Increase the maximum gRPC inbound message size from the client side when establishing the
  connection.
- Send request data in chunks (split time intervals into smaller ranges). Note that for some
  calculations, the result of several reads with smaller ranges does not need to sum up to the same
  as one read over a longer interval.

### Writing data

When writing data to the Mesh server, chunking is mandatory due to the fixed 4MB server-side
inbound limit. Large write operations must be split into multiple smaller requests.
