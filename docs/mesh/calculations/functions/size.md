## Size

### About the function

This function returns the number of elements in the array given as argument.

### Syntax

- Size(T)
- Size(D)
- Size(S)

### Description

| Type | Description |
|---|---|
| T or D or S | Array of time series or array of numeric values or array of string (symbols). |

### Examples

`Result = @Size({4,2,7,8})`

Result = 4

`Result = @Size( @T('has_Units.Production'))`

Assume there are 3 units below current object (the object that owns the attribute having this expression).

Result = 3
