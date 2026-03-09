# How to execute and verify an AddIn Excel installation

## Prerequisites

1. Mesh REST API is installed on a local server
   1. Accessible as http://<server>:7060/swagger

## Installation

1. Download the Powel.Icc.TimeSeries.MeshClient.TsApi.Setup-xxx.zip package.
2. Run the Powel.Icc.TimeSeries.MeshClient.TsApi.Setup-xxx.msi from that package.
   1. Specify wanted location (example: C:\Volue\PowelMeshTsApi)
   2. Specify the Mesh RESP API endpoint (example: http:://server:7060)
   3. Specify correct Mesh path to the top node (example: Model/Company/Mesh)
3. Verify the installation by running the test script from a command tool:
   1. cd \volue\PowelMeshTsApi\bin
   2. cscript TestMeshTsApiInstall.wsf
   3. Verify that it returns something like: "Mesh version: 2.19.1+7", which means that there is a successful connection to the Mesh service
4. Start Excel
   1. Open `C:\Volue\PowelMeshTsApi\Excel\PowelAddIn.xls` and save it as an `Excel Add-In` as `C:\Volue\PowelMeshTsApi\Excel\PowelAdIn.xlam`
   2. In `Customize Ribbon` tab of `File\Options`: Verify that `Developer` option is selected in right-hand list
   3. In the `Developer` tab of Excel, select the `Excel Add-Ins` button and select the `Powel TS-API wrapping` item (add it if necessary by browse and select the add in created above)
   4. Verify the following settings (from File\Options)
      1. In the `Trust Center` tab select the `Trust Center Settings...` and ensure that `C:\volue\PowelMeshTsApi\Excel` directory is in the `Trusted Locations`tab list.
      2. In the `Macro Settings` tab ensure that the `Enable VBA macros` option is selected
   5. Close the Excel Add-In created, open the `C:\Volue\PowelMeshTsApi\Excel\FlexibleLoadStore.xlsm` and store it as a new file in the Documents folder (or anywhere else).
      1. Verify that the `Developer` tab is available.
      2. Press the `Excel Add-ins` button of the `Developer` tab, and verify that the `Powel TS-API wrapping` is selected. If the item does not exist, you need to load it from the `C:\Volue\PowelMeshTsApi\Excel\PowelAdIn.xlam` file.
      3. In the `LoadFromDB` tab of the Excel sheet, press the `Log on` button. This should result in a successful login and something like `Connected! 2.19.1+7` be presented as the logon info.
      4. In the same tab, press the `Find Full Name/TS Codes` button. This will bring up search dialog where it is possible specify a search criterion, f.ex. `*[.Type=Unit].Production_raw`. Press the `OK` button of the dialog, and the first 100 items found are listed in the B column.
      5. Copy two items from the returned list into the J36:J37 fields, adjust the time period specified in fields K26:K27, and press the `Load from Powel database` button. Verify that the found items are presented in the `Present` tab of the Excel sheet.
