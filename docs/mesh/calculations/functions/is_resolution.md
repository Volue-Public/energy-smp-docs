# Resolution

Test the resolution of a time series.

## Syntax

- IsResolution (t,s)

## Description

| Type | Description |
|---|---|
| t | The time series to check  |
| s | A resolution symbol like 'HOUR', 'DAY' etc  |

Returns 1 (true) if the time series match the specified resolution.

## Example

`HourSeries = @IsResolution(@t('.Ts1'), 'HOUR')`

Result value is 1 if Ts1 has hourly resolution.