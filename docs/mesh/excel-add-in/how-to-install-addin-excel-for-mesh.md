# How to execute and verify an AddIn Excel installation

## Prerequisites

1. Mesh REST API is installed on a local server
   1. Accessible as http://server:7060/swagger

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
   5. Close the Excel Add-In created and open the `C:\Volue\PowelMeshTsApi\Excel\