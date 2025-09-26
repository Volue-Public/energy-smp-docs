# Mesh session

A session can be viewed as temporary workspace where changes will not be
affected by, or affect other users, that work with the system until changes are
committed and pushed out of the session and into where shared resources are
stored.

A Mesh server will normally have many separate sessions open at any given time.
A session should be created and closed after finishing work.

When a session has been created the user can interact with the Mesh model,
search for and retrieve data (like time series or information about object)
and perform calculations among other things.

If the connection is lost it is possible to reconnect to the server and attach
to a open session using a session identifier. If a user does not close
a session manually it will time out and will be closed after a specific time,
but this might steal resources and should be avoided.

Trying to connect to a session with a session id that is no longer valid will
result in an error.

## Timeout

Each session that has been **inactive** for some period of time will be
automatically closed on the server side. This period is called session timeout.
Currently the session timeout for gRPC sessions is set to 5 minutes.

The session timeout is counted from the moment where handling of the last
request made using that session was completed. So, if you are using a session
for longer period than the session timeout, but you are actively making calls
to, for example read time series points, then the session will not timeout.

In cases where a session needs to be preserved, but the inactivity periods are
longer, then the user needs to make explicit calls using that session.
