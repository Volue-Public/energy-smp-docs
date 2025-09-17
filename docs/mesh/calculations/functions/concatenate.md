# Concatenate
## About the function
Merge text arguments into a concatenated text. This is very useful when there is
a need to create a reference from multiple parts, for example from other object
attributes.

## Syntax
- Concatenate(s,s)
- Concatenate(S)


## Description


| # | Type | Description |
|---|---|---|
| 1 | s | First text argument |
| 2 | s | Second text argument |



## Example
  `## = @t(@Concatenate(‘../..’, @s(‘.TargetTimeseries’))`

The argument to @t is calculated based on the local text attribute
TargetTimeseries and a static movement `../..` . If the value of
TargetTimeseries is MyTsAttribute, the result is the time series addressed like
this, `../…MyTs`. This means go to the parent of the parent and get the time
series on the MyTsAttribute attribute.



  **Description**



| # | Type | Description |
|---|---|---|
| 1 | S | An array of texts to concatenate into the resulting text |



## Example
`## = @t( @Concatenate( {'*[.Type=HydroPlant&&.Name=', @MeshID('NAME'),'].Production' })`

If the name of current object is 'PlantX' then the Concatenate function will
return this string:

  `''*[.Type=HydroPlant&&.Name=PlantX].Production'`
