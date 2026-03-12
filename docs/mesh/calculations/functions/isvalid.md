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
- IsValid(T)

**Description**

| Type | Description |
|---|---|
| t | Source time series that is normally the result of a `@t('TheReference')`. |

The function returns 1 or 0 representing true or false.

**Description**

| Type | Description |
|---|---|
| s | Expected type of target, i.e. the entity found from the search/navigation defined in the second argument. Valid target codes are 't', 'd', 's', 'T', 'D' or 'S'. The codes represents time series, numeric, string, time series array, numeric array and string array respectively. |
| s | TheReference - The search/navigation string which defines where to go to find the target entity. |

This variant checks if there is a target of specified type available from the
calculation context. If the target of the expected type is found, then the
function returns 1 (representing true), otherwise the function returns 0. The
function does not produce any log events when lookup fails.

**Description**

| Type | Description |
|---|---|
| T | An array of time series that is normally the result of a `@T('TheReference')`. |

The function returns 1 or 0 representing true or false. It returns true if there are time series in the array and some of these are connected
to physical time series or have associated calculation expression.

### Examples

In this example the `Watercourse` objects named Lyse and Sauda have an ownership relation `has_HydroPlant` where the `HydroPlant` object
type have a time series attributes `Income` and `Production`. The `Income` attribute have an associated expression.

The `HydroPlant` objects below Lyse does not have any physical time series attached to `Production` attribute, but those below Sauda have.

**Case 1**
- The expression on a `Watercourse` attribute is like this
- `## = @IsValid(@T('has_HydroPlant.Income'))`

| Time | Sauda | Lyse |
|---|---|---|
| 2020-12-31T23:00:00Z |       1.00 |       1.00 |

The result shows that the calculation returns 1 (true) for both Lyse and Sauda.

**Case 2**
- The expression on a `Watercourse` attribute is like this
- `## = @IsValid(@T('has_HydroPlant.Production'))`

| Time | Sauda | Lyse |
|---|---|---|
| 2020-12-31T23:00:00Z |       1.00 |       0.00 |

The result shows that the calculation returns 1 (true) for Sauda and 0 for Lyse because there is no series connected to `Production`.
