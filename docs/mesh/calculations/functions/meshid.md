## MeshID

This function is used to get an identification of the Mesh object having a
calculated time series where this function is used. It is also possible to get
the identification from a related Mesh object by giving a search or navigation
suffix to the function argument.

### Syntax

- MeshID(s)

**Description**

| Type | Description |
|---|---|
| s | What type of identification to get and if it contains two parts divided by a semicolon (;) <br>it also defines where to get it from. <br>Valid specification of what type of id to get is one of: <br>NAME, TYPE, GUID or WRAPPEDGUID. <br>The second part (optional part coming after a semicolon) is a relative navigation or <br>search definition. Relative to current Mesh object. |

The function returns a symbol (a string).


## Example


`Ident = @MeshID(‘NAME’)`

Returns the name of current object (the one owning this calculation)

`Ident = @MeshID(‘TYPE’)`

Returns name of the type that current object is an instance of

**Note!** The navigation strings are model dependent.

`Ident = @MeshID(‘NAME;to_PriceArea’)`

Returns the name of the object found on the other side of the navigation given
by relation name to_PriceArea.

`Ident = @MeshID(‘NAME;to_PriceArea/..’)`

Returns the name of the parent object of the object found on the other side of
the navigation given by relation name to_PriceArea.
