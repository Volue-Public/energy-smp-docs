# Mesh search language

The Mesh search language can be used to find Mesh objects.

To be able to search for a Mesh object you need to specify which model to
search in, where in the model the search should start and the query matching
the criteria of the Mesh object you are searching for.

## Query syntax

A search consists of a traversal, optionally followed by an [attribute](./modelling/general.md#attribute)
access (".AttributeName"). A search takes an object (the start point) as input
and produces a set of objects or attributes as output (the result). If the
attribute access is specified, the result objects are all attributes (attribute
search), otherwise they are all objects (object search).

### Traversal

A traversal describes a set of relative paths in the Mesh object structure. It takes a set of objects as an input (the start points) and produces a set of objects as an output (the result) by following the paths from each start point and collecting end points. The start point is used as an input for the traversal. The attribute access is applied to the output of the traversal. Some of the traversals are parametrised on criteria (e.g. `[Criteria]` or `*[Criteria]`). For example, the traversal `..` will output the parent, if it exists, for each input object. Traversals can be combined with operators to form new traversals.

| NAME | SYNTAX |DESCRIPTION |EXAMPLE|
|---|---|---|---|
|Attribute access | `.<attribute name>` |Use dot as prefix to address attributes on the current object. In the example the current object matches the filter if it has an attribute named Siblings and its value is greater than 2. |`[.Siblings>2]`|
| Predicated child step     | `[<criteria expression>]` | Outputs children that match the criteria. | `[.Type=Teacher&&.Name=Berg]` |
| Composer | `Search1/Search2` | Use slash, /, to combine searches. | `operate_school/school_has_classes`|
| Intersection | `&` | Combines several separate searches into a collection of objects that are part of ALL separate search results.| `[.Type=School]&[.Name=Berg]`|
| Union | <code>&#124;</code> | Combines several separate searches into a unique collection.| <code>[.Name=Eng-1]&#124;[.Type=Pupil]</code> |
| Repeater | `<Search>+` | Repeats a search recursively one or more times, using the search output as the new starting points. Returns the most-nested matches. [See more](#predicated-child-walks-with-a-repeater).|`[.Name=Berg]+`|
| Memoizing repeater | `<Search>{+}` | Repeats a search recursively one or more times, using the search output as the new starting points. Returns the most-nested matches, as well as any matches found along the way. [See more](#predicated-child-walks-with-a-repeater).| `[.Name=Berg]{+}`|
| Self step | `@` | The output is the same as the input. This is useful when composing unions.|`@`|
| Filter | `@[<criteria expression>]` | Filters with help of example input object that matches criteria.| `@[.Name~a]`|
| Child walk | `*` | Outputs the leaf (lowest level) objects found when descending from the provided starting point. If the start point is a leaf, it is included in the result.| `*`|
| Predicated child walk | `*[<criteria expression>]` | Searches down until it finds the first object matching the criteria for every visited branch. If the starting point matches the criteria, it is returned as a result. If the star sign is in curly braces, it will also output objects visited on the way to the result. [See more](#predicated-child-walks). | <ul><li>`*[.Type=Pupil]`</li> <li>`{*}[.Type=Pupil]`</li>|
| Strict child walk | `+` | Outputs the leaf (lowest level) objects found when descending from the provided starting point. If the starting point is a leaf, it is not included in the result.| `+`|
| Predicated strict child walk | `+[<criteria expression>]` | Searches down until it finds the first object matching the criteria for every visited branch. Does not take the starting point into account when searching. If the plus sign is in curly braces, it will also output objects visited on the way to the result. [See more](#predicated-child-walks).| <ul><li>`+[.Type=Pupil]`</li> <li>`{+}[.Type=Pupil]`</li></ul>|
| Parent step | `..` | Returns parents of input objects. | <ul><li>`..`</li> <li>`*[.Name=Berg]/..`</li></ul>|
| Parent walk | `..*[<criteria expression>]` | Outputs the input object if it matches the criteria. Otherwise, it outputs the first ancestor that matches the criteria. If the star sign is in curly braces, it will also output objects visited on the way to the result. | `..*[.Name="Olav"]`|
| Strict parent walk | `..+[<criteria expression>]` | Outputs the first ancestor that matches the criteria. If the plus sign is in curly braces, it will also output objects visited on the way to the result. | `..+[.Name="Olav"]`|
| Link walk | `~` | Traverses by link relations. Yields all objects which current object links to. | `~[.Type=School]` |
| Reverse link walk | `~~` | Reverse link traversal. Yields all objects which link to current object. | `~~[.Type=School]` | 

### Criteria

Some traversals are parametrised on criteria (see predicated child walk and child step). The criteria control which objects the traversal will accept as output, and will either accept an object by outputting true or reject it by outputting false. You can combine criteria with operators to form new criteria (see AND, OR). For example, the traversal `[.Name=N]` will for each input object, output the set of child objects whose name equals `N`. The traversal `*[.Name=N]` will for each input object output the set of closest descendant objects whose name is `N`.

Criteria are always enclosed in square brackets, `[]`.

You may specify options for the criteria within suffix curly brackets `{}`, for example to ignore case sensitivity on text-based comparison. `{i}` means the search is case insensitive.

| NAME | SYNTAX |DESCRIPTION |EXAMPLE|
|---|---|---|---|
|Criteria relations| `>`, `<`, `>=`, `<=`, `=` | Numerical criteria used in combination with a number inside a square bracket. | `[.Type=Pupil&&.Siblings>1]` |
| Equal criteria | `=` | Used in combination with text inside a square bracket. | `[.Type=Pupil]` |
| Contains criteria | `~` | Used with text inside a square bracket. The string on the right-hand side is contained in the string on the left-hand side. | `[.Type=Pupil&&.Name~ok]` |
| Logic AND operator | `&&` | Combines sub-criteria. All criteria must evaluate to true to get a result. | `[.Type=Pupil&&.Siblings>1]` |
| Existence criteria | `search` | Checks if the search result is not empty. | <ul><li>`[.Siblings&&!.Age]` (objects with `Siblings` attribute, but not `Age` attribute)</li><li>`[.Siblings&&!...Age]` (objects with `Siblings` attribute, but whose parent has no `Age` attribute) |
| Logic OR operator | <code>&#124;&#124;</code> | Has lower precedence than the AND operator. Can be controlled by grouping criteria parts in brackets `()`.| <code>[.Name=Anita &#124;&#124; .Name=Beate]</code> |
| Logic NOT operator | `!` | Inverts the input.| `[!.Age=27]` |
| Match criteria | `#` | Regular expression. Only for text attributes (not numerical values). | <ul><li>`[.Name#.*nen]` (Names that ends with "nen". `.` matches any character, `.*` matches all characters.)</li><li>`[.Name#[A-C\\].*]` (Searches for objects with a name starting with A, B or C. It is a range based expression `[A-C]` followed by `.*` which means all characters. Note: A part regular expression needs a double back slash quote at the end). |

## Combining multiple search operations

You can combine search operations with the following operators:

- **INTERSECTION, &**:
    - The result is the intersection between each result set.
    - Syntax: *Search1&Search2*
- **UNION, \|**:
    - The result is the union between each result set.
    - Syntax: *Search1|Search2*
- **COMPOSITION, /**:
    - Uses the output from Search1 as input to Search2.
    - Syntax: *Search1/Search2*

    When using INTERSECTION and UNION between searches, you only use a single character, & or \|, respectively. Inside an object criteria, you use double character to specify a logic AND, &&, or logic OR, \|\|, respectively.

## Searching self-similar models

It is possible to create a model where an object of a certain type has a child of the same type. For example, an object `A1` owns an object called `A4` and both objects are of type `A`.
Composing search expressions in this case requires special attention.

### Example model

```
     Model
     |-- A1 -- A4
     |-- A2
     |-- A3
         |-- B3 -- A5
```

### Predicated child walks

A search expression `*[.Type=A]` with a starting point set to `Model` yields `A1`, `A2` and `A3`. **_Note!_** The search will not proceed to find `A4` and `A5`.

A search expression `*[.Type=A]` with a starting point set to `A1` yields `A1`. The expression matches the starting point and the search does not look for further matches.

A search expression `+[.Type=A]` with a starting point set to `A1` yields `A4`. The `+`
sign excludes the start point from the search.

### Predicated child walks with a repeater

A search expression `[.Type=A]+` with a starting point set to `Model` yields `A2`, `A3` and `A4`. It recursively applies the `[.Type=A]` part of the expression, using the output of the previous step as input. For example, when the search finds object `A1`, it looks for its direct children of type `A` to find object `A4` which ends up in the result set. Note that `A3` is included in the result set instead of `A5`. This is because when the search finds object `A3`, it looks for its _direct_ children of type `A` but it finds none. The `[.Type=A]` search is therefore not applied at `B3`.

A search expression `[.Type=A]{+}` with a starting point set to `Model` yields `A1`, `A2`, `A3` and `A4`. This follows the same logic as in the previous expression, but the `{+}` part in the expression also outputs intermediate matches such as `A1`.

A search expression `+[.Type=A]+` with a starting point set to `Model` yields `A2`, `A4` and `A5`. It recursively traverses the model to find the last object of type `A` on each branch. Here the `+[.Type=A]` part of the expression makes the search descend unconditionally down each branch until it finds the first object of type `A`; then, the trailing `+` re-applies the `+[.Type=A]` search so that it keeps descending down the branch. The search ends up returning the last object of type `A` on each branch, even if it is not a direct child of a type `A` object.

A search expression `+[.Type=A]{+}` with a starting point set to `Model` yields `A1`, `A2`, `A3`, `A4` and `A5`. It recursively traverses the model to find the last object of type `A` on each branch as before, but also adds any intermediate `A` objects to the result set.
