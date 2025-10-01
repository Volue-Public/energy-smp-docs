# General introduction

Mesh operates under a few basic assumptions:

- Every object has a unique GUID.
- Every object is able to do binary serialization (read/write).
- Every object has an associated version number.

## "Model definition" vs "model"
A model definition is a description of a domain with respect to object types, attributes, and
relations. It defines what information is available through Mesh for this domain. An instance of
a model definition is simply called a "model". See also the [Modelling](../concepts/modelling//general.md).

## The `EnergySystem` model definition
This is the Mesh model definition made by Volue to cover the information needed by the Mesh
connected modules. It defines the basic types to describe a hydro/thermal/wind system,
case management and time series quality related to this.  

## Customer extensions
An important point in Mesh modelling is the capability for customers, and specific projects,
to extend the `EnergySystem` model definition. This can be:

- Adding new attributes to existing types.
- Modifying time series calculation expressions initially provided by Volue.
- Modifying time series attributes to have an expression.
- Adding new object types.
- Making new connections between objects.

This feature is widely used in large projects, but also applicable for smaller customers.

### Managing customer extensions
Currently this is supported by use of Mesh namespaces. Changes made by customer/projects end up
in the `Custom` namespace. This basic configuration also prevents customers from making changes
on mandatory parts of the model definition. It's a simple solution while waiting for a full blown
authentication/authorization feature.


# Current process

## Master model
The master model definition is maintained through a server owned by Volue connected to an Oracle
database.

## Model definition update 
Mesh model definitions can be exported into a binary file by using the `Model.ImportExport` tool.
These binaries normally have an .mdump extension and are not human-readable (and thus not suited
for regular version control systems). The scope of the export can be specified through CLI options.
The exports can also include the corresponding model instances from the model definitions.

`Model.ImportExport` can also be used to import .mdump files into a target system in order to
perform an update of the model definition. A successful update of the model definition will include
saving the *target* binary file as a Mesh resource, located in a folder called `ObjectModelUpdates`.
The resource's name will consist of the name of the model definition and a timestamp. This storage
is actively used to retrieve the base for delta-based updates.

In practice, model definition updates are done by using a script called `ModelUpdate.ps1` which is
distributed alongside release packages. However, this document delves deeper into the underlying
process for updating, and indicates some of the problems that may arise along the way.

Throughout this document (and other literature) we'll use the term "model update" to refer to an
update of the model definition (as well as its derived models).

### Delta-based updates
This is the preferred approach for model updates. It performs the following steps:

- Get the differences between the model definition which is currently installed on the target system
  (`Base`) and the new one to be installed (`New`). These can include:
    - Objects that exist in both versions, but are different (marked for updating).
    - Objects that exist in `New` but not in `Base`, i.e. created after the `Base` installation
      (marked as new).
    - Objects that exist in `Base` but not in `New`, i.e. removed from the model definition since the
      `Base` installation (marked for deletion).
- Push the changes found in the previous point onto the target system.

In our current process, `Base` is the latest master model definition which the customer has 
installed (and potentially expanded on) on the target system, and `New` is a newer master model
definition. The customer's own changes to the model definition are not taken into account when
calculating the delta between `Base` and `New`.

### Assign-based ("on-top") updates
This approach should be avoided, but experience shows that this sometimes may be the only way to
fix some problematic cases. It's similar to forcing the model definition to change into a new state.

It performs the following steps:

- Push objects from the `New` model definition to the target system.
- If the target system accepts the incoming changes, it becomes the new model definition.

This operation does _not_ delete anything, just stores unconditionally on top of the existing state.
Alternatively, it is possible to specify that only whatever's missing should be imported by passing
the `-w ImportOnlyMissingElementTypesAndDefinitions` option to the `Model.ImportExport` tool.


# Challenges related to current approach/toolset

## Delta-based
Prior to the last step (push), the `Model.ImportExport` tool will check the following:

- Problem D1: An object is marked as new on the, but this object _does_ exist on the target system
  (based on ID lookup).
- Problem D2: An object marked for updating does _not_ exist on the target system.
- Problem D3: An object marked for deletion does _not_ exist on the target system.
- Problem D4: An object is marked for updating, but is really a switch between a time series
  attribute being a calculation or not.
- Problem D5: Version number conflicts. For example, pushing a version with a lower number than the
  target object's. In general, the versioning is _not_ active by default on `Model.ImportExport`
  due to the lack of a global version number that can be applied across database instances.  

The reason behind problems D1..D3 is hard to determine. Some probably come from the target system
missing validations and accepting operations that should not be allowed/authorized.
Another reason could be a wrong understanding of the latest installed master model definition
(`Base`) when doing version comparison.

An ["on-top" update](#assign-based-on-top-updates) can probably also lead to a situation like this,
for instance because parts that should be removed from the model definition are still not removed. 

There exist some other problems as well:

- Problem D6: Assume that there have been changes to an expression both in the master model
  definition and the customer's target system. In this case the delta-based import will favor the
  changes from the master model definition over the customer's.
- Problem D7: An attribute has been removed from the master model definition, and then recreated
  on master with the same name. Since the re-created object will now have a different GUID, this will
  appear as a new object in the delta update cause a duplicate name conflict on the target system.

As a side note, in the past there had been issues arising from conflicts related to the usage of
`PDCTimeseriesReferenceEntity`, which is no longer used in our master model definitions. Since delta
updates only handle differences between two versions of master, this means that such conflicts
should no longer apply. Note that there can be still some `PDCTimeseriesReferenceEntity` objects in
the customers' own models, but they won't be affected by the delta import since they're created by
the customers themselves.


## Assign-based ("on-top")
The following problems can appear on this approach:

- Problem A1: Some enumeration values related to no value seem to be recreated (especially the
  `Undefined` value) with a new GUID. This *dangling* definition may also create problems on imports.
- Problem A2: Because this approach does not delete anything, the target model definition may end up
  in a situation where leftovers from a previous version can create problems at some point.
  An immediate problem is e.g. when the master definition has changed the type of a given attribute, 
  such as from double to integer, which would change the attribute's GUID. If the attribute's name
  remains the same, a conflict would arise when trying to perform the update.
- Problem A3: The version of the model definition stored in the `ObjectModelUpdates` resource folder
  will not give a correct picture of the updated state (ref Problem A2). This may create problems
  on later attempts to do delta-based updates.


# Example

Consider the following sequence:

![](MMConcepts_1.png)

### Step 1
A Mesh model definition (MD) is in a master state 1. It is installed on a target system.
This should be straightforward, no problems at all.

The MD 1 is also stored as a file inside Mesh Resources, within the `ObjectModelUpdates` folder.

### Step 2
The master model definition is extended, and the version 3 is going to be updated on the target
system. There have been no customer changes on the MD on the target system at this point.
A delta update is provided from MD 3 "minus" MD 1, illustrated as triangle `a`. There should be
no problems doing this update.

The `ObjectModelUpdates` folder will now also contain the MD 3.

### Step 3
Now we wish to update the target system to master version 6, but the MD on the target system has
been modified as well by the customer. However, as the figure shows, these changes merely extend
the target system's MD, but do not modify the "core" MD 3. The delta update `b` is done based on
master MD 6 minus master MD 3. There should be no problems doing this update either.

The `ObjectModelUpdates` folder will now also contain the MD 6.

### Step 4
As before, we wish to update the target system to MD 7. However, in this case there have been
customer changes on core parts of the MD originating from master (represented by the two extra boxes
within the MD), so that the delta update `c` would be in conflict with such customer changes.
A merge conflict will happen in this case, with some of the problems indicated by D1..D4 above.

If there are changes on both master and target system, the master definition will be pushed.
In many cases this is accepted by the target system, so that the master MD is favored over the
local one.


# Summary
This document provides some background information on the process of model definition maintenance.
It shows that there are basic features in the tools supporting the maintenance process.
Experience shows that problems may arise, which must be worked around using miscellaneous cleanup
tools. In some cases, the only solution is to perform an "on-top" model update, which is *not*
usually recommended because it can cause further problems later on.
