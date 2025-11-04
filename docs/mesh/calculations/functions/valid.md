## Valid

### About the function

A time series reference specified by **@t(‘TheReference’)** may give no result.
The reason for this may be one of the following:

- **TheReference** does not exist.
- There is no connection to a physical time series from the current context.

In these cases the system will display a warning message. The warning message
tells the user it did not manage to resolve **TheReference** for a given object.

See also function [IsValid](../functions/isvalid.md).

### Syntax

- Valid(T)

### Description

| Type | Description |
|---|---|
| T | Array of source time series, where each of them normally is the result of a @t(‘TheReference’) lookup. |

The function returns an array of valid time series.

## Examples

Precondition:

- The expression is located at an attribute that has the following time series
  attributes: H_Ts1, H_Ts2 and H_Ts3
- On object A in test model, all these attributes have physical time series connected
- On object B in test model, only H_Ts1 and H_Ts3 have physical time series connected

Expression:

`## = @Size(@Valid({@t('.H_Ts1'),@t('.H_Ts2'),@t('.H_Ts3'),@t('.H_DoesNotExist')}))`

On object A, there are three valid time series so the returned array
will have three series, so the result of `Size` will be 3.

On object B, there are two valid time series so the returned array
will have two series, so the result of `Size` will be 2.
