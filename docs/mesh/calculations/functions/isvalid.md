## IsValid

### About the function

A time series reference specified by **@t(‘TheReference’)** may give no result.
The reason for this may be one of the following:

- **TheReference** does not exist.
- There is no connection to a physical time series from the current context and there is no calculation associated with this time series attribute.

In these cases the system displays a warning message in the Nimbus Object
Structure log. The warning message informs it could not resolve **TheReference**
for a given object.

You may use either IsValid or [Valid](../functions/valid.md) to handle these cases.

### Syntax

- IsValid(t)
- IsValid(s,s)

**Description**

| Type | Description |
|---|---|
| t | Source time series that is normally the result of a `@t('TheReference')`. |

The function returns 1 or 0 representing true or false.

**Description**

| Type | Description |
|---|---|
| s | Expected type of target, i.e. the entity found from the search/navigation defined <br>in the second argument. Valid target codes are 't', 'd', 's', 'T', 'D' or 'S'. <br>The codes represents time series, numeric, string, time series array, numeric array <br>and string array respectively. |
| s | TheReference - The search/navigation string which defines where to go to find the target entity. |

This variant checks if there is a target of specified type available from the
calculation context. If the target of the expected type is found, then the
function returns 1 (representing true), otherwise the function returns 0. The
function does not produce any log events when lookup fails.
