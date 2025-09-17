﻿# MeshID
This function is used to get an identification of the Mesh object having a
calculated time series where this function is used. It is also possible to get
the identification from a related Mesh object by giving a search or navigation
suffix to the function argument.

## Syntax
- MeshID(s)

**Description**

| Type | Description |
|---|---|
| s | What type of identification to get and if it contains two parts divided by a semicolon (;) it also defines where to get it from. Valid specification of what type of id to get can be one of: NAME, TYPE, GUID or WRAPPEDGUID. The second part (optional part coming after a semicolon) is a relative navigation or search definition. Relative to current Mesh object. |

The function returns a symbol (a string).

**Note!** The navigation strings are model dependent.

## Example
`Ident = @MeshID(‘NAME’)`

Returns the name of current object (the one owning this calculation)

`Ident = @MeshID(‘TYPE’)`

Returns name of the type that current object is an instance of

`Ident = @MeshID(‘NAME;to_PriceArea’)`

Returns the name of the object found on the other side of the navigation given
by relation name to_PriceArea.

`Ident = @MeshID(‘NAME;to_PriceArea/..’)`

Returns the name of the parent object of the object found on the other side of
the navigation given by relation name to_PriceArea.
