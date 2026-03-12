# Mesh model backup strategy and restore procedures

This document recommends a setup for backing up/restoring the Mesh model in case unintended/undesired changes have been made, such as deleting large parts of the model which would be complex to recreate manually.

## Scheduled Backup

The recommended setup is to have periodic backups of the production Mesh model, ideally on a daily basis. That way, if a restore is needed at some point during the next day, the latest backup should be relatively similar to the state of the model before the damaging changes were done. Backups and restores are done by using the `Model.ImportExport` tool; the backup themselves are .mdump binary files.

We provide a script called MeshModelBackup.ps1 which can be used to perform such backups in an easy way: <link to script>

## Restoring the Mesh model state from a backup

There are two options for this.

### Full restore

This is the recommended option. In this way we're performing an "on-top" import of the backup as described in <link to ModelMaintenanceConcepts.md>:

1. Any missing parts of the model that are present in the backup are restored.
2. Any objects and attributes in the model that differ from those of the backup are replaced by the latter, including link relations. This is useful for cases where e.g. a part of the model is accidentally deleted, thus nulling out any link relations pointing to deleted objects.
3. No objects are deleted from the model, even if they're not present in the backup.

While this approach is not recommended for model definition updates, it's safe to use for restoring a model from a backup. Note that there are a few caveats:

1. Any non-additive changes made since the backup will be lost.
2. If the model definition has changed since the backup, the issues described in <link to ModelMaintenanceConcepts.md> may appear.

As mentioned before, the recommended way to mitigate these issues is to have frequent backups so that a restore operation should not cause too much recent work to be lost.

To perform a full restore, run the following:

```
Powel.Mesh.Model.ImportExport.exe -i <path_to_backup> -S
```

Replace `<path_to_backup>` with the path to the `*_fm.mdump` file produced by `MeshModelBackup.ps1`. Note that this command will check whether any of the imported objects refers to a time series resource that doesn't exist; if so, it will create it (as an empty time series). You can pass the `-T` option to `Model.ImportExport` to disable this behavior; in this case the attributes will still be created but not connected to a time series.

### Partial restore

This option can be used if there are changes to the model since the last backup that need to be preserved. In this case, we'll only import the part of the model that needs to be restored, instead of the entire model.

This option is a bit more complicated than doing a full restore since there's no way to "extract" a part of the model directly from an .mdump file. Therefore, we need to import the backup to a non-production environment first, export the desired part of the model to a separate .mdump, and finally import that .mdump to the production model. The non-production environment should ideally be the customer test environment; if necessary, create a backup of its current state so it can be restored later once you've finished fixing the production model.

Note that this assumes there haven't been any changes to the model definition since the last backup that could affect the part of the model that we're restoring. If this is not the case, you must replicate those changes in the test environment before doing the export. Since we'll still do an "on-top" import, it should not be necessary to replicate changes that only added new objects. To view the differences between the test and production environments, you can first export each of them into an .mdump file and then compare them by running the following:

```
Powel.Mesh.Model.ImportExport.exe -w SummaryOfChangesReport -w <test_mdump> -w <prod_mdump> -o Report.md
```

Replace `<test_mdump>` and `<prod_mdump>` with the paths to the test and production .mdump files respectively.

_On the test environment_:

1. Import the latest backup:

```
Powel.Mesh.Model.ImportExport.exe -i <path_to_backup> -S
```

2. Find the GUID of the root object to restore. A way to do it is to run the following:

`IntMeshQuery.exe -a Lookup -p <path_to_object>`

and replacing `<path_to_object>` with the path to the desired object. Alternatively, you can run:

```
IntMeshQuery.exe -a ModelStructure -m <model_name> --verbose > ModelStructure.txt
```

and replace `<model_name>` with the name of the target model; then, locate the object's GUID in `ModelStructure.txt` (make sure this is the GUID of an `AttributeElement`).

3. Export this part of the model:


ACLARAR BIEN QUE HAY QUE ARREGLAR ACA SI HUBIERON CAMBIOS EN EL MODEL DEFINITION. ¿Que pasa si hubieron cambios en el model definition del test environment despues de hacer el backup?

```
Powel.Mesh.Model.ImportExport.exe -o objects_to_restore.mdump -c <object_guid>
```

Replace `<object_guid>` with the GUID from step 2.

_On the production environment_:

Import the .mdump file we created from the test environment:

```
Powel.Mesh.Model.ImportExport.exe -i objects_to_restore.mdump -S
```






### Partial rollback no Energy System model differences in affected area

If there have been made changes in the model that one wants to perserve, this is the best option.

First the backup needs to be imported to some server. Ideally, this should be the customer test environment. The test environment can be reverted to it's original state if needed, by taking a backup of the model before importing the backup from prod.

If the only difference is that some object instances were deleted e.g. Deleted a whole case or sub branch of the Mesh structure, the below process can be run without further preparations. After the import is completed, references pointing to the deleted objects need to be added, manually or make a Python script. **_Can we provide a Python script for it? Possibly higher effort than gain as this is a special situation_**

### Partial rollback with Energy System model differences in affected area

If there have been made changes to the EnergySystem object model since the backup, some manual changes might be required before the procedure is run. Addative changes are not an issue. You do not need to consider changes made in parts of the structure you will not be importing. E.g. if importing a case it is ok that an attribute has been removed in the Mesh part of the structure.

If and attribute or relation has been deleted since the backup, the same deletion must be performed in test before running the procedure.
Template calculation modifications may be an issue and the template calculation may need to be deleted, possibly the whole attribute.

If you do not know what the differences are you can run `Powel.Mesh.Model.ImportExport.exe -w SummaryOfChangesReport -w ES_test.mdump -w ES_prod.mdump -o Report.md` to create a report with an overview of the differences.

Once you have made the needed changes you can move on with the process as below. After the import is completed, references pointing to the deleted objects need to be added, manually or make a Python script. **_Can we provide a Python script for it? Possibly higher effort than gain as this is a special situation_**

### Partial backup procedure

_!Note_ ensure you have made changes as described above if there have been changes to the EnergySystem model.

#### On the test system

1. Find the **GUID** of the object that was the root of what was deleted.
   - You can use:
     `IntMeshQuery.exe -a ModelStructure -m ModelName --verbose > ModelStructure.txt`
   - Replace `ModelName` with the customer’s Mesh model name.
   - The model name can be found using `IntMeshQuery.exe`.

2. Locate theobject in this file and copy its **GUID** (this will be used in the next command).
   **Note:** It is important that this is the GUID of an `AttributeElement`.

   - Alternatively, you can use:
     `IntMeshQuery.exe -a Lookup -p ...path_to_object...`

3. Export this part of the model:
   `Powel.Mesh.Model.ImportExport.exe -o Objects_from_test.mdump -c GUID-of-Object`


#### On the production system

`Powel.Mesh.Model.ImportExport.exe -i Objects_from_test.mdump -S`

  You may want to add the -T option to the command above to prevent series from being created.

This will take some time because it reads the entire existing model to verify the changes. There is no point in running without commit first, the procedure will pass until saving is attempted.



#### Adding missing links

Objects linking to the objects added during rollback can be identified by using the search expression `~~` when standing on an object instance in Mesh Search on the object in test.

<img width="1312" height="378" alt="image" src="https://github.com/user-attachments/assets/de9810a6-8d67-4fc6-8555-c1e4a0b24515" />

You can check whether there is any possibility for a link existing in Mesh Configurator, before starting to check all object instances.

<img width="1731" height="634" alt="image" src="https://github.com/user-attachments/assets/aa5dfd2e-f213-4e8c-99e4-28cf18362715" />


