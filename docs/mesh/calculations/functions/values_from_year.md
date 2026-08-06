# ValuesFromYear

Gets values from a specified year on input series and places them into the
requested period.

## Syntax
- ValuesFromYear(t,d)

## Description

| # | Type | Description | Example |
|---|---|---|---|
| 1 | t | Source time series. |   |
| 2 | d | Year as a four digit number. Standard DB calendar is used to map year number into time period. | 2000 |

## Example

`CompareTemp = @ValuesFromYear(@t('AreaTemperature'),2000)`
