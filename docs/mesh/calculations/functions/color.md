# ColorARGB

The ColorARGB function converts a colour name into an ARGB value. It can be used
to produce time series values referenced by the COLOR_VALUE attribute in Mesh
template reports.

## Syntax

- ColorARGB(s)

## Description

| # | Type | Description |
|---|---|---|
| 1 | s | A named colour |

Returns an ARGB value.

Accepted colour names can be found in [this
list](https://www.w3schools.com/colors/colors_names.asp). 
The colour name is case insensitive and must not contain space characters.

Not accepted:
```  
Dark Green
```


Accepted:
```
DarkGreen
darkgreen
```

Each colour also has four different nuances, which can be specified by adding 1
to 4 as a suffix to the colour name. For instance:
```
steelblue
steelblue1
steelblue2
steelblue3
steelblue4
```

## Example

  `## = @t('.Income') > 1000 ? @ColorARGB('orange') : @ColorARGB('magenta')`

Returns the ARGB value for the colour named `orange` or the colour named
`magenta`, depending on the value of the `income` time series.

This function can be used as part of the value on a report attribute named  
`COLOR_VALUE` like this:

`EXP:## = @t('.Something') < 0 ? @ColorARGB('Red') : @ColorARGB('green')`
