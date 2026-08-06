# CONVERT_VOLUME
## About the function

Converts a time series unit into a new unit. The result series has the same
resolution as the input time series.

## Syntax
- CONVERT_VOLUME(t)


## Description


| # | Type | Description |
|---|---|---|
| 1 | t | Time series with reservoir content. |



This function implicitly uses an XY table attribute which must be defined in
Mesh Configurator and attached to the same object where the time series
expression is defined.

The XY table attribute must be set up with reference to an external attribute in
sim models.

The syntax for the Reservoir storage is:
`CONTEXT=XYSET;HYD_KEY=$LocalId;HYDFN_CODE=RsvElevStorage`

`$LocalId` is a reference to an attribute name with the HYD_KEY number specified
for each reservoir. This attribute must also be defined in Mesh Configurator and
attached to the same object. See help text in Mesh Configurator > Reference to
external attributes in sim models.
