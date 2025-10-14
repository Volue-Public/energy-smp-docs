## CopyTs

This function copies values from a source location to a destination location
within the Mesh model. This is a function where the "side effects" of the
operation is the important part rather than the returned values.

### Syntax

- CopyTs(s,s,s)

**Description**

| Type | Description |
|---|---|
| s | Attribute name that determines the match between source and target series. <br>It is assumed to be available at the object where the source series <br>is found and where the target series is found. <br>The built-in attribute called Name can also be used to decide match. |
| s | Search expression for getting source time series. |
| s | Search expression for getting target time series. |

The function returns 0 if success, else a negative error code.

The search expression in the two last arguments are by default relative to the
object where the @CopyTs() calculation is found. It is possible to make the
search expression relative to model root by adding a prefix "Model:" to the
search expression. This part is removed before applying the search.

### Example

`## = @CopyTs('Ident', '*[.Type=TypeB].Ts1','Model:*[.Name=A1_3_New]/[.Type=TypeB].Ts1')`

The function uses the value on the attribute `Ident` as criterion for making
source - target pairs. The second argument is defining a relative search
operation that collects the Ts1 time series attribute for all children that is
of type name `TypeB`. The third argument, the target search definition, is used
to collect target time series. In this case the search is starting at the top of
the model (prefix `Model:`) and search for TypeB objects below an object with
name A1_3.

`## = @CopyTs('Name', '*[.Type=TypeB].Ts1','Model:*[.Name=A1_3_New]/[.Type=TypeB].Ts1')`

The function uses the name of the object as criterion for making source - target
pairs.

In both examples the target search is done with model as start point (prefix
`Model:`). The source series search is relative to the point in model where this
calculation expression is found.

The function will not do the copy operation if not all series identified by
source search definition (argument 2) have a matching partner from the targets
list.
