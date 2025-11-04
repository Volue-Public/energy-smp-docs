## Macros in Mesh template reports

Mesh has taken the template report concept to a new level. See [a general introduction](reports_intro.md) for more background info.

We utilize macros in order to make a generic report definition adapt to the specific information. These macros
are expanded with current Mesh object as the context. Current object is the "node" that owns the time series attribute where the actual time series is found.

### Which report attributes support macros

Macros can be used as part of the value for these report attributes:

- GROUP - defines hierarchical group membership
- GROUP_MGR - defines the "manager" of a hierarchical group, i.e. the only visible member when the given group is closed.
- PAGES - defines one or more logical pages that this time series is part of.
- GRAPHAXIS - general attribute that defines a named axis with info about min,max,legend etc.
- GRAPHUSEAXIS - defines the association with a named axis from actual time series
- WIDTH - defines the visual width of a time series column
- GRAPHWIDTH - defines the width of the graphical presentation of a time series
- GRAPHTYPE - defines the type of graph.
- GRAPHSTYLE - defines the style of a graph.
- GRAPHCOLOR - defines the colour of the graph.
- DESCRIPTION - defines a text that describes the time series. It is mapped to a tooltip text activated when hovering over the object on report visualisation.
- COLOR_VALUE - defines the color dependent of time series values.
- COLOR_CELL - defines the background color of table view cells.
- COLOR_HEAD - defines the colour used in table column header.
- COLOR - defines the general colour for numeric values.
- TEXT - defines the column header description.
- GRAPHTEXT - defines the legend attached to graph.
- INFO - contributes to the window header description.

### The syntax of report attribute macros

The syntax is:

- $<_definition_>
  - _definition_ can have simple format or a general search format
    - simple format is just referring to a name of an attribute on the current Mesh object.
      - The attribute have to be either one of these types: string, bool or numeric.
    - general format starts with **another $** followed by a search specification
- alternatively, a set of predefined macros are available. See below.

A macro can be located in the middle of a static string value and therefore the general format is having a prefix and `< >` scope delimiters.
  
#### Predefined macros

- $ObjName - the name of current Mesh object.
  - There might be one or more `../` between $ and ObjName.  
    Like $../ObjName and $../..ObjName referring to the name of parent of or grandparent of  
    current object.
- $FullObjName - path to current object. Only node names are included, so it is not a general
  path description described [here](../mesh/concepts/modelling/general.md#objects-and-attributes-paths)
- $Type - the type name of current object
- $AttrName - the time series attribute name where where current time series is connected
- $RootObjName - the name of the object from where the search operations (`TS_BINDING`) are done.
- $StartPointName - same value as $RootObjName but only applicable for the `PAGES` attribute.
- $StartPage - defines the name of the initial page that is activated. It has limited scope, contributes to the window title through the `INFO` attribute.
- $ReportName - the name of the report definition for the activated report. Applicable to `INFO` attribute.
- $FullReportName - the full path the report definition for the activated report. Applicable to `INFO` attribute.

### Examples

- TEXT `$ObjName#Level#Max $<HRWL>#masl`
  - If attribute HRWL exist on current object then `$<HRWL>` is replaced by the value 451.50, the value of this double attribute.
  - In this case we use the simple format. The same result we get if the general search format `$<$.HRWL>` is used. Here the _definition_ starts with a $ and search is simply saying get `HRWL`from current object referred by `.` in front.
- COLOR_CELL `$<$..*/[.Type=CellColors].ResultCell>`
  - This example refers to a string attribute `ResultCell` at an object of type `CellColors` found by searching upwards relative to current object.

The search syntax are described [here](../mesh/concepts/search-language.md).