# Install and verify Excel AddIn for Mesh

## Prerequisites

1. Mesh REST API is installed on a local server.
   1. Accessible as http://server:7060/swagger

## Install Excel AddIn for Mesh

1. Download the **Powel.Icc.TimeSeries.MeshClient.TsApi.Setup-xxx.zip** package.
2. Run the **Powel.Icc.TimeSeries.MeshClient.TsApi.Setup-xxx.msi** from that package.
   1. Specify the target location (example: `C:\Volue\PowelMeshTsApi`).
   2. Specify the Mesh RESP API endpoint (example: http:://server:7060).
   3. Specify correct Mesh path to the top node (example: Model/Company/Mesh).
3. Verify the installation by running the test script from a command tool:
   1. cd \volue\PowelMeshTsApi\bin
   2. cscript TestMeshTsApiInstall.wsf
   3. Verify that it returns something like: "Mesh version: 2.19.1+7", which means that there is a successful connection to the Mesh service.
4. Start Microsoft Excel.
   1. Open **C:\Volue\PowelMeshTsApi\Excel\PowelAddIn.xls** and save it as an **Excel Add-In** as **C:\Volue\PowelMeshTsApi\Excel\PowelAdIn.xlam**.
   2. Choose **File** > **Options…** and select the **Customize Ribbon** tab:
   Verify that the **Developer** option is selected in the right-hand list.
   3. Open the **Developer** tab and choose **Excel Add-Ins**. Select the **Powel TS-API wrapping** (if necessary, add it by browsing and selecting the add-in created above).
   4. Verify the following settings (from **File** > **Options**).
      1. Open the **Trust Center** tab and select **Trust Center Settings…**. Ensure that the `C:\volue\PowelMeshTsApi\Excel` directory is in the **Trusted Locations**tab list.
      2. In the **Macro Settings** tab ensure that the **Enable VBA macros** option is selected.
   5. Close the Excel add-in created, open **C:\Volue\PowelMeshTsApi\Excel\FlexibleLoadStore.xlsm** and store it as a new file in the `Documents` folder (or anywhere else).
      1. Verify that the **Developer** tab is available.
      2. Choose **Excel Add-ins** in the **Developer** tab, and verify that **Powel TS-API wrapping** is selected. If the item does not exist, you need to load it from the **C:\Volue\PowelMeshTsApi\Excel\PowelAdIn.xlam** file.
      3. In the **LoadFromDB** tab of the Excel sheet, choose **Log on**. This should result in a successful login and something like **Connected! 2.19.1+7** be presented as the logon info.
      4. In the same tab, choose **Find Full Name/TS Codes** to open a search dialog box where it is possible to specify a search criterion, e.g. `*[.Type=Unit].Production_raw`. Choose **OK**, and the first 100 items found are listed in the **B** column.
      5. Copy two items from the returned list into the J36:J37 fields, adjust the time period specified in fields K26:K27, and choose **Load from Powel database**. Verify that the returned items are presented in the **Present** tab of the Excel sheet.
