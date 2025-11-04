# How to use the Mesh Rest API

- [How to use the Mesh Rest API](#how-to-use-the-mesh-rest-api)
  - [Mesh session usage](#mesh-session-usage)
  - [Commit and rollback functionality](#commit-and-rollback-functionality)
  - [Short or long running sessions](#short-or-long-running-sessions)
  - [Sequence diagrams](#sequence-diagrams)
    - [Simple read operation](#simple-read-operation)
    - [Simple write operation with commit](#simple-write-operation-with-commit)
    - [Simple write operation with rollback](#simple-write-operation-with-rollback)
    - [Long running read operations](#long-running-read-operations)
    - [Long running write operations](#long-running-write-operations)
  - [Security](#security)
    - [Using OAuth2 security token](#using-oauth2-security-token)
    - [Using Kerberos user information](#using-kerberos-user-information)

## Mesh session usage

When using the API it is necessary to create a session in Mesh to "work" within. If you don't have a session you will not be able to do execute any operation. Each session has an automatic time-out of 5 minutes, and if there is no activity against the session within such a timeframe, the session is automatically terminated without storing any changes in that session.

A way to prevent the automatic timeout to take place, it is possible to call the ExtendSession method which will make the session active 5 more minutes.

## Commit and rollback functionality

The data within a session are automatically updated with changes commited from other sessions in Mesh and changes commited directly to the database from outside of Mesh.

User changes that are added to a session is not not shared outside of the session before it is commited to the database using the Commit method. This method will save all changes added since the last Commit or Rollback operation.

If the changes added to the session is not wanted to be performed, the Rollback method will remove all changes added since the last Commit or Rollback operation.

## Short or long running sessions

Each session will typically have overheads related to functionality like:

- Create the session,
- Load data into the session,
- Perform calculations, and
- Closing the session and cleaning up memory.

Within a session data is automatically updated from stored changes and recalulation is only done for the parts that has changed since last read operation of the same data information.

**Notice!** It is advised to use long-running sessions instead of frequently creating new sessions for operations yielding the same data information.

## Sequence diagrams

### Simple read operation

This is describing a way to execute one or more read operations in an operation that completes fairly quickly. The example is using the ReadTimeSeriesValues method, but is valid for any API method that is not changing data.

![SimpleReadSession](pictures/simple-read-session.png)

### Simple write operation with commit

This is describing a way to execute one or more write operations in an operation that completes fairly quickly. The example is using the WriteTimeSeriesValues method, but is valid for any API method. The Commit method will store all changes added in the session to the database.

![SimpleWriteSessionWithCommit](pictures/simple-write-session-commit.png)

### Simple write operation with rollback

This is describing a way to execute one or more write operations in an operation that completes fairly quickly. The example is using the WriteTimeSeriesValues method, but is valid for any API method. The Rollback method will revert all changes added in the session.

![SimpleWriteSessionWithRollback](pictures/simple-write-session-rollback.png)

### Long running read operations

This is describing how a long-time running session that reads information from Mesh can be implemented. The example is using the ReadTimeSeriesValues method, but is valid for any API method that is not changing data.

![LongRunningReadSessions](pictures/long-running-read-session.png)

### Long running write operations

This is describing how a long-time running session that both reads and writes information from and to Mesh can be implemented. The example is using the WriteTimeSeriesValues method, but is valid for any API method.

![LongRunningWriteSessions](pictures/long-running-write-session.png)

## Security

This section describes how to modify requests in order to handle requests when the Mesh gRPC interface is configured to authorize request based on the user making these requests.

The Swagger interface will support these security options when the REST API is configured to use either Kerberos or OAuth2 in the `MeshRestAPI:SecurityModel` parameter. The security information is added to the `Authorization` part of the request header.

### Using OAuth2 security token

The OAuth2 security token is added as a JSON Web Token (JWT) using the `Bearer` scheme and the payload is `Base64Url` encoded (<https://en.wikipedia.org/wiki/JSON_Web_Token>).

The JWT token looks typically something like this:

```json
{
  "aud": "api://43fe1611-de83-416a-948a-2eda7d6110dd",
  "iss": "https://sts.windows.net/32b9c2c8-8b09-43be-a7fb-9a87875714a9/",
  "iat": 1713880364,
  "nbf": 1713880364,
  "exp": 1713884264,
  "aio": "E2NgYDBaMXYzoo/93qbqxaValssyAA==",
  "appid": "3ca2c555-7792-4995-82ca-9fff053b0233",
  "appidacr": "1",
  "idp": "https://sts.windows.net/32b9c2c8-8b09-43be-a7fb-9a87875714a9/",
  "oid": "61e70812-6e5e-44b0-977b-f9e5e8f89b70",
  "rh": "0.AUgAyMKpYgmLvkOn-5qHh1cUqREWrkmD3mpBlIou2n1hEN0LAQA.",
  "roles": [
    "python"
  ],
  "sub": "61e70812-6e5e-44b0-977b-f9e5e8f89b70",
  "tid": "42b0c2c8-8b09-43be-a7fb-9a87875714a9",
  "uti": "_m01w9N1GUCRZxihvXIaAA",
  "ver": "1.0"
}
```

The content of the header shall look like the following:

```cmd
Authorization: Bearer eyJhbGci...<snip>...yu5CSpyHI
```

### Using Kerberos user information

The Kerberos user information is using the Basic access authentication method (<https://en.wikipedia.org/wiki/Basic_access_authentication>):

- The username and password are combined with a single colon (:). This means that the username itself cannot contain a colon.
- The resulting string is encoded into an octet sequence.
- The resulting string is encoded using a variant of Base64 (+/ and with padding).
- The authorization method and a space character (e.g. "Basic ") is then prepended to the encoded string.

For example, if the browser uses Aladdin as the username and open sesame as the password, then the field's value is the Base64 encoding of `Aladdin:open sesame`, or `QWxhZGRpbjpvcGVuIHNlc2FtZQ==`. Then the Authorization header field will appear as:

```cmd
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ== 
```
