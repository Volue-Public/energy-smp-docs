# Trace

This function enables log messages from calculation expressions. It is primarily
intended for test purposes.

You must turn on tracing to display these messages in the Object Structure log
window in Nimbus.

## Syntax
- Trace(s)
Turns trace mechanisms on or off. Argument is either 'ON' or 'OFF' (case
insensitive).
- Trace(d,s)
 Creates a log message.
- Trace(d,s,t)
Creates a log message with some basic time series information (resolution, curve
type, unit of measurement).
- Trace(d,s,t,d)
Creates a log message with some basic time series information (resolution, curve
type, unit of measurement) and includes N values of the time series. The last
argument is the number N and have maximum value 10.


## Description


| # | Type | Description |
|---|---|---|
| 1 | d | Defines the information type. Legal value is 0, 1 or 2 – representing Information, Warning and Error respectively. |
| 2 | s | Log message. |
| 3 | t | A time series reference. |
| 4 | d | Number of values from the time series to include in the log output. Maximum number is 10. |



## Example
```
  @Trace('ON')

  @Trace(0, 'Information : Calculates Tmp1')

  Tmp1 = @t('TsRaw5') * 1.0

  …...

  @Trace(1,'A text presented as warning comes here')

  …..

  @Trace(2,'An error message comes here')

  @Trace('OFF')
```