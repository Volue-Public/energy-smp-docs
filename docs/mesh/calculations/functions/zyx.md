# ZY_X
## About the function

Gets the result X from an XYZ-attribute with input series Z and Y. An
XYZ-attribute is a table in three dimensions defined on a Mesh object, e.g. a
gate capacity table.

## Syntax
- ZY_X(t,t,s)


## Description


| # | Type | Description |
|---|---|---|
| 1 | t | Source time series for the Z values. |
| 2 | t | Source time series for the Y values. |
| 3 | s | Search string for the XYZ attribute to use in the conversion.<br/> If this attribute is located on the:<br/><ul><li>Same object as the expression, the argument should be ‘.TheXYZAttribute’ (assuming the name of this attribute is TheXYZAttribute). The dot (.) limits the search operation to local attributes on the current object.</li><li>Parent object, the argument should be ‘…TheXYZAttribute’. The two first dots means go to the parent and the third dot is the current object attribute prefix.</li></ul> If the search string is prefixed with NOLOG, for example NOLOG.TheXYAttribute, the function will not produce log messages.<br/> Tip! The prefix is removed before using the search string. |



This function uses the same principles as
[CONVERT_VOLUME](../functions/convert_volume.md) for setting up necessary attributes in
Mesh Configurator.

## Example
This function returns the reservoir level:

```
## = @ZY_X(@t(‘.gate_opening’), @t(‘.gate_discharge’),’.gate_capacity_table’)
```
