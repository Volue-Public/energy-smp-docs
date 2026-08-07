# YX

Combines an XY definition and a Y series to produce the corresponding X result.

## Syntax
- YX(t,s)


## Description


| # | Type | Description |
|---|---|---|
| 1 | t | Source time series for the Y values. |
| 2 | s | Search string for the XY attribute to use in the conversion.<br/> If this attribute is located on the:<br/> <ul><li>Same object as the expression, the argument should be .TheXYAttribute (assuming the name of this attribute is TheXYAttribute). The dot (.) limits the search operation to local attributes on current object.</li><li> Parent object, the argument should be ...TheXYAttribute. The two first dots mean go to the parent, and the third dot is the current object attribute prefix.</li></ul> If the search string is prefixed with NOLOG, for example NOLOG.TheXYAttribute, the function will not produce log messages.<br/> Tip! The prefix is removed before using the search string. |



This function uses the same principles as
[CONVERT_VOLUME](../functions/convert_volume.md) for setting up necessary attributes in
Mesh Configurator.
