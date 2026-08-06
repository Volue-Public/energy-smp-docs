# CopyTs

This function copies values from a source location to a destination location
within the Mesh model. This is a function where the "side effects" of the
operation is the important part rather than the returned values.

## Syntax

- CopyTs(s,s,s)
- CopyTs(s,s,s,s)

## Description

| Type | Description |
|---|---|
| s | Attribute name that determines the match between source and target series. It is assumed to be available at the object where the source series is found and where the target series is found. The built-in attribute called Name can also be used to decide match. For double attributes, a fuzzy comparison (tolerance 0.0001) is used. For integer and string attributes, an exact comparison is used. For other attribute kinds, the match always succeeds. |
| s | Search expression for getting source time series. By default relative to the object where the @CopyTs() calculation is found. Prefix with "Model:" to make the search relative to model root. This part is removed before applying the search. |
| s | Search expression for getting target time series. By default relative to the object where the @CopyTs() calculation is found. Prefix with "Model:" to make the search relative to model root. This part is removed before applying the search. |
| s | (optional) Execution mode: `Strict`, `Pragmatic`, `AllSources`, or `AllTargets`. Defaults to `Pragmatic` when omitted (3-argument form). |

### Execution modes

| Mode | Description |
|---|---|
| Strict | All source series must be copied to a matching target series and all target series must receive values (1:1 matching required). |
| Pragmatic | Copy those source series that have a matching target. No strict requirements on unmatched sources or targets. This is the default. |
| AllSources | All source series must find at least one matching target. |
| AllTargets | All target series must receive values from a source. |

### Return value

The function returns a non-negative value representing the number of target time
series that were successfully copied to. A negative value indicates an error.

A target time series can only receive values from one source. If multiple
sources match the same target, the function returns an error.

## Example

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

`## = @CopyTs('Name', '*[.Type=TypeB].Ts1','Model:*[.Name=A1_3_New]/[.Type=TypeB].Ts1', 'Strict')`

Same as above, but using `Strict` execution mode which requires all sources and
all targets to have exactly one match.
