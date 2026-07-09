# Introduction to the EntraID scripts

These scripts are intended to be used to create new EntraID environments in Azure owned/administrated by either Volue or the customer, and it can also be used to verify/update existing environments. In order to run the scripts the user needs to have necessary access to the EntraID environment.

- The `validate-entraid-environment.ps1` script is the main script to use and is run without any input parameters.
- The `entraid-config.ps1` script is the place where you make changes to local definitions and requirements.
- The `report-entraid-settings.ps1` script is just reporting important information for the different applications needed in order to update the installed configuration.
