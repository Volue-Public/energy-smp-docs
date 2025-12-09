# Powel ScadaEx - Installation and Configuration guide

## About this document

This document describes how to install and configure Powel ScadaEx. It is intended for a technical audience, to be used by Powel consultants and system administrator/IT personnel at Powel’s customers.

When installing Powel software, some level of knowledge of the following is required:

- Powel software, both from a technical and a functional point of view
- Installing and configuring Microsoft Windows operating systems for servers and clients
- Installing and configuring Oracle database solutions

### Documentation overview

|DOCUMENT|WHEN|TARGET GROUP|LOCATION|
|--------|----|------------|--------|
|SmG Release notes|Overview|System owner, system administrator/IT operations, end user|myPowel, Powel ftp-server|
|SmG Installation guide|Set-up|System administrator/IT operations|myPowel|
|ScadaEx User guide|Daily use|End user|myPowel|

### Writing conventions

- **Bold** is used for menu items, dialog boxes, buttons and functions in GUI.
- `>` is used to separate a sequentially selection of menu items, e.g. **File > Save as**
- The typewriter font is used in code examples.
- Numbered lists are used for steps in a process.
- Bulleted lists are used for items without priority.
- _**Note!**_ is used in front of important information.
- _**Tip!**_ is used in front of additional information.

## Introduction

ScadaEx is a software component that integrates the Powel SmG system and the Nematic Scada system. The component can be considered as an extended Scada component, and therefore it has been given the name “ScadaEx”. This comprehensive functionality includes two-way exchange of time series data between the Nematic/iFIX real-time database and the SmG time series database (Oracle), autopilot functionality, and naming conventions between the Powel Simulator data model and the Scada real time database.

For more details, see `ScadaEx User guide`.

## Prerequisites

### System requirements

For a detailed overview of system requirements, see SmG Release notes.

## Install ScadaEx

The ScadaEx software is distributed as a Zip archive file and is deployed using a simple “copy-install” method. There is no separate installer. To install you perform the following steps:

- Extract the Zip file to an appropriate folder.
  - Powel recommends extracting to folder `C:\Powel\Icc`.
  - Make sure you extract with paths, as the Zip file contains files in a subfolder structure that needs to be kept.
- Perform a basic SmG configuration.
  - Some SmG configuration is required for ScadaEx to run, e.g. installation path and database connection info. See [Basic SmG configuration](#basic-smg-configuration).

### Overview of application files

ScadaEx requires the following minimum set of files and folders for it to work correctly:

```
    bin\
        ScadaEx.exe
        LibDbAccess.dll
        log4cxx.dll
    gui\
        basis\
            ActivityLog.lang
            appl_desc.lang
            dbi_errno_messages.lang
            dbi_messages.lang
            PDLog.lang
        english\
            ActivityLog.lang
            appl_desc.lang
            dbi_errno_messages.lang
            dbi_messages.lang
            PDLog.lang
        norsk\
            ActivityLog.lang
            appl_desc.lang
            dbi_errno_messages.lang
            dbi_messages.lang
            PDLog.lang
        svensk\
            ActivityLog.lang
            appl_desc.lang
            dbi_errno_messages.lang
            dbi_messages.lang
            PDLog.lang
```

Following the standard SmG installation, the two folders bin and gui containing all the listed application files must be located in a folder given by the configuration variable **ICC_HOME**. Default **ICC_HOME** location is `C:\Powel\Icc`.

To be able to read the configuration from the SmG configuration database, the PowelCfgServer.exe COM component is also required and must be registered. This is normally not supplied with ScadaEx, and the SmG configuration must be stored in registry (or as environment variables).

#### Basic SmG configuration

Some of the required SmG configuration variables are listed below. For a complete list, see *SmG Installation guide*.

|NAME|DESCRIPTION AND DEFAULT/RECOMMENDED VALUE|
|----|-----------------------------------------|
|ICC_HOME|C:\Powel\Icc|
|HOME|C:\Powel\IccData|
|ICCDIR|%HOME%\iccfiles|
|ICC_LANGPATH|%ICC_HOME%\gui|
|NLS_LANG|american_america.we8iso8859p1|
|ICC_LANGUAGE|english|
|ICC_DBUSER|Database username. Do not set this if you are using external authentication.|
|ICC_DBPASSWD|Database password. Do not set this if you are using external authentication.|
|LOCAL|Name of your database service.|
|TWO_TASK|%LOCAL%|

### Configure logging to the Windows Event Log

ScadaEx supports logging to Windows Event Log as an alternative to logging to the console window, and as an addition to logging to Powel Activity Log (PAL). There are many advantages by using the Windows Event Log:

- Speed. Logging to the console window is slow, high debug level may lead to high CPU usage.
- Persistency. The information logged to the Windows Event Log is stored to a log file, managed by the Windows Event Logging subsystem. With console logging the information is mostly lost the moment the application is stopped.

The event logging system in Windows consists of a number of components:

- The event logging service
- Event log files
- The registry
- The Event Viewer application

#### About event logs

All configuration of the Windows’ event logging service is stored in registry. It is located under the `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EventLog` key. Under this key there is one subkey for each individual event log. In Windows there are three basic built-in event logs:

- Application
- Security
- System
  ```
    HKEY_LOCAL_MACHINE
      SYSTEM
        CurrentControlSet
          Services
            EventLog
              Application
              Security
              System
  ```

Custom event logs may be added as separate log keys at the same level as the built-in ones.

The configuration for each event log is stored as registry values under the event log key:

```
    HKEY_LOCAL_MACHINE
      SYSTEM
        CurrentControlSet
          Services
            EventLog
              Application
                File = %SystemRoot%\system32\winevt\Logs\Application.evtx
                MaxSize = 1400000
                Retention = 0
```

The name of the log key is also used as the display name for the log, e.g. in the Event Viewer application.

|PARAMETER|VALUE TYPE|DESCRIPTION|
|---------|----------|-----------|
1File|REG_SZ or REG_EXPAND_SZ|Path to the file where the event log records are stored. If not set then the event logging service will automatically create a file path with folder path %SystemRoot%\system32\winevt\logs, a file name matching the event log registry key (name of the log) and file extension .evt or .evtx (In Vista and Server 2008 the file type changed from binary .evt to XML-based .evtx). If an existing log file is to be moved, then this value must be changed accordingly.|
|MaxSize|REG_DWORD|The maximum physical size the log file may grow to. This value must be specified in 64Kb (0x00010000) increments. Nonconforming values are rounded upwards to the next 64Kb boundary by the event logging service. The default is 1MB (0x 00100000.|
|AutoBackupLogFiles|REG_DWORD|Enables automatic backup of the file. Default value is 0, then no backup is performed. Any other value than 0 needs retention value -1 (0xFFFFFFFF) for it to have effect.|
|Retention|REG_DWORD|Controls if it should be possible to delete old log items to make room for new when the file size reaches the maximum. Default value is 0, then oldest item will always be overwritten when the log is full. Any value different from 0, typically the value -1 (0xFFFFFFFF) is used, then no items will be deleted, and the log must be cleaned manually to make room for new items when it is full.|
|CustomSD|REG_SZ|Sets the access rights to the log by specifying ACL in the string format specified by the Security Descriptor Definition Language (SDDL).|
|Isolation|REG_SZ|Can set to value “Application” or “System” to get a set of predefined access rights (ACL).|

For more information: http://msdn.microsoft.com/en-us/library/aa363648%28VS.85%29.aspx

The properties of an event log can be changed from the Event Viewer application. Custom logs will be shown within a group named “Application and Services Logs”. Right-click the event log and select Properties. Here one has a “Clear log” button to manually remove all items from the log. There are also different configuration options, matching the registry values described above like “Log path” and “Maximum log size”. The option “When maximum event log size is reached” can be set to “Overwrite events as needed (oldest events first)”, which is default and corresponds to registry value Retention = 0 and AutoBackupLogFiles = 0. Also, it can be set to “Archive the log when full, do not overwrite events”, which corresponds to registry value Retention = 0xFFFFFFFF and AutoBackupLogFiles = 1. And finally, it can be set to “Do not overwrite events (Clear logs manually)”, which corresponds to registry value Retention = 0xFFFFFFFF and AutoBackupLogFiles = 0.

It is also possible to delete the entire log from the Event Viewer. This will delete the registry key representing the log.

***Note!*** The log file itself will not be deleted. It must be deleted manually (usually a restart is required first due to file locking). If the file is not deleted, and a log with the same name is re-created later, then (if not a custom log file is specified) the same log file will be re-used, and any existing log items in the file will be shown.

#### About event sources

Under each event log subkey there are zero or more event source subkeys. Each of these subkeys is named after an event source that may be used to report events. Every event source is associated with a specific event log (and an event log may contain dozens of event source subkeys). It is the name of the event source subkeys that is used when logging events from the application, and the event log service looks up the event source and finds the log to store the information in. This is the reason why an event source name cannot appear under two or more of the event log subkeys.

Each event source subkey contains information needed by the event logging service to interpret the event source's event record data. Such information includes the number of event categories and event types used by the event source, and the location of the event source's message files.

A message file is a resource that contains translations for descriptive message strings, identifiers, categories or parameters.

#### Logging to the event log without or with incorrect setup

You can log events to the Windows Event Log without installing an event source. Also, with some invalid event source setup the logging basically works. But the following will be observed:

- If a given event source name is not found, then the events will be added to the built-in “Application” log.
- If logging with an installed event source that has incorrect path in the EventMessageFile parameter, or if logging an event identifier that is not defined in the specified message file, then the events will be added to the correct event log - the event log which the event source is installed on, but the event description will contain the following error message:
  
  ```
  The description for Event ID 0 from source AutoPilot cannot be found. Either the component that raises this event is not installed on your local computer or the installation is corrupted. You can install or repair the component on the local computer.

  If the event originated on another computer, the display information had to be saved with the event.

  The following information was included with the event:
  ```

  Below this error message the information supplied by the application when logging the event will be shown. Depending on the message file this may only be parts of the event information.

  For ScadaEx the message file only contains very generic event message strings, and all information is supplied by ScadaEx during logging. Therefore, all information will be included in the event after the error message above.

#### Configure event logging for ScadaEx

You can manually configure the event log and event source to be used by ScadaEx, or you can let ScadaEx do it for you. ScadaEx can be run in setup mode to install event logging. The generic syntax is:

```cmd
   -setup InstallEventLog [AutoPilot|TsToScada|ScadaValuesToHistDb]
```

The result of this command is:

- A custom event log for ScadaEx will be created if it does not exist already. It will get the pre-defined name “Powel ScadaEx”. Event log properties will be default values only, so you may want to manually inspect it later – although in the normal case the default setup should work fine. This event log is shared by all instances of ScadaEx on the computer.
- A common event source for ScadaEx will be created if it does not exist already. It will get the name “Powel ScadaEx”, and will be added to the custom event log described in the previous point.
- A dedicated event source for the ScadaEx operation will also be created if it does not exist already. By specifying one of the operational modes ScadaEx supports as an argument, the event source name will be some predefined name based on this (“AutoPilot”, “TsToScada” or “HistoryCollection”). This means that all instances of ScadaEx running in AutoPilot mode on the computer will be logging with the same event source. But you can also customize an event source just for a single instance of ScadaEx. To do this you have to specify the configuration variable `ICC_SCADAEX_EVENTSOURCE`. When this variable is set, and you run the setup command with just “-setup InstallEventLog” (not the optional operational mode argument), then the event source name will be taken from the configuration variable. Note that it is important that the same value is set for the configuration variable in the environment of the ScadaEx instance that will be logging with this event source.

The immediate result of the “InstallEventLog” setup command is only changes in the Windows registry. A registry key will be created for the custom event log, and the event sources will be created as subkeys of this. No values (parameters) will be added to the log key, which means Windows’ event logging service will use default configuration for the log. When Windows’ event logging service discovers this registry key it will create an event log file where it will store any event records logged to it, so even if ScadaEx only performs registry-only changes the indirect result is also creation of a log file. Since we have not explicit set the log file path, it will be created in the default location and with the default name matching the name of the event log registry key. The maximum size of the log file will be 1MB (assuming Server 2008 or newer), and the retention policy will be to overwrite old items when the log file is full.

The event sources, sub-keys of the event log, will also be created with mostly default configuration. But there are some parameters that are required: In addition to a required integer value TypesSupported which must be set to 7 (ScadaEx implementation specific), the main parameter is a reference to the message file, which is message text resources compiled into ScadaEx.exe. This is set with string value EventMessageFile, with a reference to the full path of the ScadaEx.exe used to run the setup command.

The result of running the following command:

```cmd
    C:\Powel\Icc\bin\ScadaEx.exe -setup InstallEventLog AutoPilot
```

Is the same as importing the following registry file:

```cmd
  Windows Registry Editor Version 5.00
  [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx]
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx\Powel ScadaEx]
      "EventMessageFile"="C:\\Powel\\Icc\\bin\\ScadaEx.exe"
      "TypesSupported"=dword:00000007
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx\AutoPilot]
      "EventMessageFile"="C:\\Powel\\Icc\\bin\\ScadaEx.exe"
      "TypesSupported"=dword:00000007
```

To make ScadaEx log to the configured event log, the configuration variable **ICC_SCADAEX_USE_EVENTLOG** must be set.

***Notes!***

- Each event source is connected to a copy of ScadaEx.exe by a reference to the full path. If the file is deleted or moved, then logging using this event source name will still work – but not exactly as intended. It will work as described in Logging to the event log without or with incorrect setup, page 10.
- If an event source with the same name is already installed in for the event log, the existing configuration will not change. This means that the event source will still be connected to the path to `ScadaEx.exe` that initially was installed to the event source. To change the path, you must either modify registry manually or run “UninstallEventLog” on the event source first and then “InstallEventLog”.
- Since the event logging service looks up event sources by name to find the event log to use, there is a risk of naming conflicts. E.g. other applications may already have installed an event source with name “AutoPilot” when you install one on the ScadaEx custom log. When logging ScadaEx and other applications have no reference to the event log name only the event source, so it is entirely up to the event logging service to resolve this into an appropriate event log. The result of duplicate event source names is unpredictable, possibly the events will be logged to an incorrect log. The solution to this is to specify a different event source name to be used by ScadaEx using the configuration variable `ICC_SCADAEX_EVENTSOURCE`.

Uninstallation may be performed using “-setup UnistallEventLog”. The syntax is similar to install. This will remove the event source by deleting its registry key.

***Note!*** The deletion is done by name only, it does not match the path of the `ScadaEx.exe` used to execute the uninstall command with the path stored in the EventMessageFile. The event log key itself is not removed, only the event source.

You can use the additional argument “All” to remove the entire event log, and any event sources added to it. Note that the event log file itself is not deleted, as described above, only the registry key for it – the entry for the event log in the event logging service’s configuration.

If event sources have been installed with custom names that are no longer known, then uninstalling with the “All” option will remove them. This will also remove any other event sources and the entire event log configuration. See Manage the event logging (page 12) for a solution to this problem.

#### Manage the event logging

The event log can be managed from the Windows Event Viewer application or other third-party applications. It can also be administrated from registry by accessing registry key `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx`. Deleting the event log, either from an application or by manually deleting the registry key will leave the log file on the computer. When ScadaEx installs the event log it uses default configuration, which means the log file will be located in `%SystemRoot%\system32\winevt\logs` and will have the file name “Powel ScadaEx” and extension .evt or .evtx. If you want to remove the log file also, to remove any traces of the ScadaEx event logging setup, you can manually delete this file.

***Note!*** You may not have access to do this without restarting the computer first. This is described in Microsoft Knowledge Base article 172156: “How to Delete Corrupt Event Viewer Log Files” (http://support.microsoft.com/kb/172156).

The event sources do not have a very convenient administrative tool, and you will probably have to use registry. Each event source installed by ScadaEx will be listed as subkeys under the “Powel ScadaEx” event log key described above. By looking at these in the Windows registry editor you will see the names of the event sources, and the paths to ScadaEx they refer to. The event source names are the names of the registry keys, the file references are stored in a string value with name EventMessageFile under this key. If you locate an event source that is not needed you can just delete the event source’s registry key, or you can take note of the name and use ScadaEx’s “-setup uninstalleventlog” command.

Windows PowerShell makes it easy to access registry from command prompt, and since the event sources are just registry items, PowerShell can easily be used to show – and modify - the event sources. The following command will list all event source sub-keys under the registry key for the “Powel ScadaEx” event log (assuming it exist):

```powershell
    Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx"
```

To list only the relevant properties, event source name and referenced ScadaEx.exe, the command can be extended to this:

```powershell
    Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx" | ForEach-Object { @{$_.PSChildName = $_.GetValue("EventMessageFile")} }
```

To remove an event source no longer in use, here the event source called “HistoryCollection”:

```powershell
    Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\Eventlog\Powel ScadaEx\HistoryCollection"
```

### Install as Windows Service

ScadaEx supports running as a Windows Service. Installation and uninstallation are performed using the setup command, similar to setup of event logging. Also similar to event logging, the service setup is basically a registry operation.  Installing a service with name “ScadaEx AutoPilot” is done by creating a registry key with this name below the “Services” key:

```dir
    HKEY_LOCAL_MACHINE
      SYSTEM
        CurrentControlSet
          Services
            ScadaEx AutoPilot
```

The command line syntax is:

```cmd
    -setup InstallService <service_name> [<run_options> [<display_name>  [<description>]]]
```

The `<service_name>` parameter defines the name of the registry key for the service, and this will also be the service name used by windows service controller. Any run options given will be added to the command to execute when the service is started. This is stored as an ImagePath string value in the registry key for the service. ScadaEx automatically sets the full path to itself followed by the argument “-service” which is required for it to be started as a service. Any additional run_options specified will be appended to the same command string. Display name is a user-friendly name which is what Windows Services control panel will show for the service. It will be stored in a string value with name “DisplayName”. If not specified, the service will only be identified by the main service name. Also, a descriptive string may be added, it will be stored in a string value with name “Description”.

When installing as service using the setup command line, then ScadaEx will also install event logging support for the service. The regular event log will be created, if not already exists, and an event source with same name as the service will be added to it, the same way as when installing event logging.

Note that the service will be setup with manual startup and it will be running as the Local System user account. If this is not desirable, then you should change this from the regular Services control panel.

Uninstalling the service is done by command line:

```cmd
    -setup UninstallService <service_name>
```

This will delete the service and uninstall its event source. As with event logging configuration the event log itself will not be removed, to remove that one must use “-setup UninstallEventLog All”

#### Manage the service

The service can be managed by many different programs. Windows provides the Service management user interface and the SC command line program for various administrative tasks, as well as the simple “net start” and “net stop” commands for starting and stopping the service.

Only a few aspects are possible to change from the Service management user interface in Windows, mainly the current status (starting and stopping the service), the start-up type (manual or automatic) and the user account the service shall run in. Windows PowerShell makes it easy to access services from command prompt and allows changing most of the properties. Since the service configuration is stored in registry, the generic registry commands can be used to modify the stored configuration just like for the Windows event log as described in Manage the event logging, page 12. But PowerShell provides dedicated commands to administrate services which make it even more powerful. The following is some of the relevant commands available in PowerShell V2:

- Start-Service
- Stop-Service
- Get-Service
- Set-Service

The following command can be used to list all services with prefix “ScadaEx” in their service name:

```powershell
    Get-Service ScadaEx*
```

The following command can be used to list all services with prefix “ScadaEx” in their service display name:

```powershell
    Get-Service -DisplayName ScadaEx*
```

The following command will start a service with name “ScadaExService1”

```powershell
    Start-Service ScadaExService1
```

The following command can be used to modify the displayname and description, and change the startup type to “Automatic”, of a service with name “ScadaExService1”

```powershell
    Set-Service ScadaExService1 -DisplayName "ScadaEx Service #1" –Description “This is the description of my first ScadaEx Service” –StartupType Automatic
```

One property of the service that you cannot change with the service-related PowerShell commands is the property shown in the service manager as “path to execute”. This is stored in registry as “ImagePath” string value on the service’s registry key. Therefore, you will need to manipulate the registry, either manually in Windows registry editor or with PowerShell from the registry provider, to change this. From the service management user interface, in the properties dialog on the service there is an input field for “Start parameters”. This allows you to append additional arguments to the command path, but it will only be used when you start the service by clicking the Start-button in the properties dialog – it is not a permanent change of the ImagePath property.

## Configure ScadaEx

### Configuration locations

The configuration can be stored in one of the following locations:

- Windows environment variables
  - This may be system, user or process specific. When running as console application from Windows Command Prompt (cmd.exe) you can set process specific variables using the SET command before starting ScadaEx.exe, and likewise when using a batch file you can set variables using the SET command in the bat file before calling ScadaEx.exe.
- Command line arguments
  - The command line syntax of ScadaEx allows you to define configuration variables at the end of the command string.
- See *ScadaEx User guide* for more information about configuration variables.
- Powel configuration variables
  - This may be in registry or in configuration database. Note that the use of configuration database introduces dependency on a separate COM module.
  - When the configuration variables are loaded when the application is started, they will be loaded as regular process environment variables into the ScadaEx process. Any existing variables will not be modified or removed, so if set in the environment where the application is started before the start of the application, they will have the initial value within the process.

### Logging

Log systems supported:

- Console window
- Windows Event Log
- Powel Application Log (PAL)

ScadaEx will by default log a certain amount of information, but when needed the log level can be increased by activating the debug level. The debug level may be set in one of two ways:

- “Debug” as command line argument
- Configuration variable `ICC_SCADAEX_DEBUGLEVEL`

AutoPilot, HistoryCollection and TsToScada supports a command line argument “Debug” that will set the base debug level (1), if not debug logging is already enabled.

The configuration variable `ICC_SCADAEX_DEBUGLEVEL` can be used to specify any debug level as an integer value. The following debug levels are currently defined:

1. No debug logging.
2. The base debug level. Will enable extensive logging of various information.
3. Used by the AutoPilot mode to report modifications of plan series (“AP-NW”, “AP-RM” and “AP-CH”). Independent of the debug level this information will be logged to PAL. Also the time series refresh procedure common to all operation modes will log information about the contents of the time series in memory (“Changed TS…”, “Before refresh…”, “After refresh…”, and time-value for the entire memory-period of the time series).
4. Used to log information about which time periods of data that are stored in memory for the active time series. 
5. Only used by the AutoPilot operation mode and will make it report the contents of every time series it monitors. This reported information is the same as when refreshing time series with debug level 2.

Some configuration variables – including `ICC_SCADAEX_DEBUGLEVEL`, sometimes will only be considered when set in the environment before ScadaEx is started (see ScadaEx User guide for more information about configuration variables). For instance, debug logging during command argument parsing, service initialisation etc. cannot be enabled by setting the debug level configuration variable in SmG configuration or in the command argument string itself, it must be set in the calling environment – e.g. by use of the set-command in a command prompt or batch file before starting ScadaEx. After the command arguments have been parsed and all configuration variables loaded the debug level variable is updated, so any settings will have affect from that point on.

### Configuration variable reference

The following sections describes groups of configuration variables. Each variable is described by a description and the type of variable. The different variable types are: “B” for Boolean, “I” for integer and “S” for string.

#### Common

|NAME|TYPE|DESCRIPTION|
|----|----|-----------|
|ICCDIR|B|After the configuration has been loaded the current directory of the process will be set to the path given by this variable. This means any relative file paths will be resolved according to this path. The exception is the command file, since it is evaluated before the configuration has been loaded.|
|ICC_SCADAEX_DEBUGLEVEL|I|An integer to set as the debug level, which controls how much information that will be logged. See Logging (page 15) for more information.|
|ICC_IFIX_TZ_STD|B|Specifies the time zone of time stamps read from the iFix interface. Default is to assume UTC, but if this variable is set then default time zone is assumed instead.|
|ICC_IFIX_NO_WINDOW_TITLE|B|By default the console window title will be changed according to the running operation. If this variable is set then the title will not be set.|
|ICC_SCADAEX_COMMANDFILE|S|Absolute or relative path to a command file, a text file containing command arguments to ScadaEx. If relative it is relative to the current directory at the time of application startup - not `ICCDIR` like most other file paths. ***Note!*** This variable must be present in the environment ScadaEx is started from (e.g. using a set-command in a bat file), it cannot be set as a regular SmG configuration variable because it is used before the regular configuration is loaded. It can however be set as a configuration variable argument on the command line as described in the ScadaEx User guide. See *ScadaEx User guide* for more information about the command file.|
|ICC_SCADAEX_USE_EVENTLOG|B|To enable logging to Windows Event Log when running ScadaEx as a console application. No information (other than some initial startup information) will be logged to the command prompt. When running as service this is forced behavior. See ScadaEx User guide for more information about installing and uninstalling the event log.|
|ICC_SCADAEX_EVENTSOURCE|S|Name of the event source to use when logging to Windows Event Log. When running as service the event source name is forced identical to the service name. See ScadaEx User guide for more information about installing and uninstalling the event log.|
|ICC_SCADAEX_DB_RECONNECT|B|If automatic reconnection should be performed when connection to database is lost. This is forced behaviour in HistoryCollection, and it is unsupported in AutoPilot. Only TsToScada will use this variable: If not set then it will quit at first database connection problem like AutoPilot does, and if set it will keep running and at irregular intervals try to reconnect like HistoryCollection does.|
|ICC_IFIX_RECONNECT_DELAY|I|Minimum time period in number seconds between a reconnect should be attempted after connection to database has been lost. Default value is 10 seconds. The reconnection will only be attempted when a database connection is needed, and not all functions will comply with this setting. E.g. when HistoryCollection decides to attempt to commit it’s time series cache to the database it will attempt to reconnect regardless of this configuration variable. The main purpose of this is to avoid that extensive efforts to try to reconnect will make the any backup off-line operation modes suffer, which e.g. could lead to HistoryCollection failing to avoid queue size from growing above its limit and thereby losing data.|

#### HistoryCollection

|NAME|TYPE|DESCRIPTION|
|----|----|-----------|
|ICC_IFIX_QUEUE|I|The queue identifier in iFix to connect to. Default is 4.|
|ICC_IFIX_FLUSH_QUEUE|B|If set, then the initial contents of the iFix queue will be cleared before the history collection begins. If not set then any existing items will be processed at application startup (may lead to “old timestamp..” messages etc.)|
|ICC_IFIX_NO_INITIAL_STATE|B|Turn off the initial state processing that is performed by default. This processing discovers all database blocks in the iFix system configured for history collection and prepares time series for these. If this is switched off the time series preparation has to be done individually each time a item from a new “unknown” block is read from the queue.|
|ICC_IFIX_MAX_CACHE|I|Number of items to collect in the internal cache before attempting to store them (commit) to the SmG history database and then removing them from the cache (flush). Default value is 5000 (items).|
|ICC_IFIX_SLEEP|I|Idle sleep. Number of milliseconds to sleep when the queue has been emptied. Default value is 5000 (5 seconds), minimum allowed value is 100 (0,1 seconds).|
|ICC_IFIX_MAX_CACHE_AGE|I|Maximum age of the items in the internal cache in number of seconds before committing them instead of sleeping when the queue has been emptied and the cache is not full yet. Default value is 5, minimum allowed value is 1.|
|ICC_IFIX_MIN_QREAD|I|When the cache is full, but database is not currently connected, then this defines a minimum number of items to read from the queue before aborting the collection loop to attempt to commit. This is only used when database connection is down, and the rationale behind it is to avoid attempting to commit the cache for every new item read from the queue. Each commit attempt will trigger a file backup operation if configured (see `ICC_IFIX_DUMP_TO_FILE_ON_ERROR`  and `ICC_IFIX_BACKUP_TO_FILE_ON_ERROR`). Commit attempts will also force a reconnection attempt, but the variable `ICC_IFIX_RECONNECT_DELAY` is the main parameter to avoid continuous reconnection attempts. Default value is the same as the cache size, which is given by variable `ICC_IFIX_MAX_CACHE` with default value 5000.|
|ICC_IFIX_HISTMODE_DIR|S|Absolute or relative path to the folder where backup files with SQL expressions for updating time series meta data information will be stored when the automatic update failed. The files will get names “<tscode>.txt”. Relative paths will be resolved according to `ICCDIR`. Default is relative path “ifix_histmode”, which will be used if variable is not specified or specified directory cannot be found or cannot be created (e.g. due to invalid path). Fall-back if all other fails is to use the working directory (`ICCDIR`) itself. NB: The directory will be created if not already exists, but only the last component of directory path can name a new directory, any intermediate directories must exist.|
|ICC_SCADAEX_DBPATH_FIX|B|To replace any occurences of the forward slash character (‘/’) with underscore (‘_’) in tag names when creating time series names from them. The background for this is that the slash is path separator in SmG, so without this fix tag names with slash will lead to time series with parts of the tag name as path and parts of it as name (tscode).|
|ICC_IFIX_NAME_MAP|S|Absolute or relative path to configuration/mapping file that maps SmG time series and Nematic Node.Tag.Field. Relative paths will be resolved according to `ICCDIR`. Default is "ifix_name_map.txt".|
|ICC_IFIX_NAME_FMT|S|The fallback method for mapping time series to NTF, when no mapping file has been specified, or if the file is not found, or if a given tag is not found in the file. The value is a format string where “%%s” must be used (required) to be replaced by the individual tag names, and “%%N” may be used (optional) to be replaced by the node name. Default is “%%s.hist”.|
|ICC_IFIX_NO_TIMESTAMPFILTER|B|Turns off the filtering on old timestamps when adding items to the cache.|
|ICC_IFIX_NO_OLD_ITEM_REPORT|B|Turns off logging of old timestamps when adding items to the cache, if not `ICC_IFIX_NO_TIMESTAMPFILTER` (in which case no filtering will be performed at all).|
|ICC_IFIX_NO_DUP_ITEM_REPORT|B|Turns off logging of duplicate timestamps when adding items to the cache.|
|ICC_IFIX_ALL_ITEMS|B|The default behavior is to only collect items that contain a master flag indicating the Scada node is running as a master. Setting this variable will make the HistoryCollection collect and store any items, regardless of the master flag.|
|ICC_IFIX_OLD_ENUMERATOR|B|Deprecated.|
|ICC_IFIX_IGNORE_OVERFLOW|B|When the iFix queue overflows the default behavior in ScadaEx is to perform a recovery procedure, basically clearing the internal mapping information and performing the initial state processing again. There is a probability that this will just make the situation persist, so therefore this variable can be set to turn it off and make ScadaEx just continue collecting items after overflow.|
|ICC_IFIX_NO_INIT_TS_VALUE|B|During initial state processing, and also during normal operation when an item for a new unknown tag is read from the queue, the default behavior is to retrieve the initial value in addition to the metadata required to set up a time series in the SmG database. This variable will make ScadaEx not store the initial value fetched from iFix during this processing.|
|ICC_IFIX_NO_RM_DUPENTRIES|B|During store of cache items into SmG database the default is to perform  a special procedure to resolve duplicate entries by just storing the one considered best according to value status. This processing could be time consuming so this variable can be set to turn it off.|
|ICC_IFIX_DUMP_TO_FILE_ON_ERROR|B|Backup procedure when connected to database is broken. When an attempt to store cache (commit) into the SmG database fails, the cache contents will be stored as SQL statements in a text file instead. The cache will then be cleared, and ScadaEx will continue as normal - as if the cache was successfully stored. The dumped file needs to be manually imported into the database later. File names will be “<date_time_17c>_histvalues_dump.sql”, and they will be written to a directory according to `ICC_IFIX_CACHEDUMP_DIR`. See *ScadaEx User guide* for more information about error handling. See also the configuration variables `ICC_IFIX_BACKUP_TO_FILE_ON_ERROR` and `ICC_IFIX_CACHEDUMP_DIR`.|
|ICC_IFIX_BACKUP_TO_FILE_ON_ERROR|B|Backup procedure when database connection is down. Alternative to `ICC_IFIX_DUMP_TO_FILE_ON_ERROR` described above - only one of these can be used at the same time. As with that option: When an attempt to store cache into SmG (commit) fails then the cache contents will be stored as SQL statements to a text file instead. But in contrast to the dump option, the cache is not cleared after the file has been written. If the database connection is later successfully re-established then the entire cache will be written to the SmG database and the backup files created do not need to be manually imported. See ScadaEx User guide for more information about error handling. See also configuration variables `ICC_IFIX_DUMP_TO_FILE_ON_ERROR` and `ICC_IFIX_CACHEDUMP_DIR`.|
|ICC_IFIX_CACHEDUMP_DIR|S|Absolute or relative path to the directory where cache dump files according to `ICC_IFIX_DUMP_TO_FILE_ON_ERROR` and `ICC_IFIX_BACKUP_TO_FILE_ON_ERROR` (see above) will be stored. Relative paths will be resolved according to `ICCDIR`. Default is relative path “ifix_cachedump”, which will be used if variable is not specified or specified directory cannot be found or cannot be created (e.g. due to invalid path). Fall-back if all other fails is to use the working directory (`ICCDIR`) itself. ***Note!*** The directory will be created if not already exists, but only the last component of directory path can name a new directory, any intermediate directories must exist.|

#### Common AutoPilot and TsToScada

|NAME|TYPE|DESCRIPTION|
|----|----|-----------|
|ICC_DLSEXPORT|B|If the DLSExport functionality should be enabled, performing file-based export of values written to Nematic.|
|ICC_IFIX_TARGETTIME_FMT|S|The string format to be used when writing future target times to the “target time” data block in Nematic. The value of the configuration variable is a formatting string according to regular C-style formatted output (printf). When a target time back in time is detected the special value “NOW” will be written. Default value is “%02h:%02m:%02s”.|

#### TsToScada

|NAME|TYPE|DESCRIPTION|
|----|----|-----------|
|ICC_2IFIX_SLEEP|I|Idle sleep period. Time in number of milliseconds that the program shall sleep between each time it refreshes the configured time series and writes any updated values to iFix. Default value is 5000 (5 seconds), minimum allowed value is 100 (0,1 seconds).|
|ICC_2IFIX_REFRESH|I|Interval between each time a forced refresh of time series should be performed. Value is number of times in the main loop, which means a multiple of time required for processing plus the following idle sleep. Default value is 5, minimum allowed value is 2.|
|ICC_2IFIX_MEMCLEANUP|I|Number of seconds between each time the internal time series cache shall be cleared to avoid accumulation of a data for long time periods that will no longer be of any use. Default value is 86400 (24 hours, 24*3600). Minimum allowed value is 2.|
|ICC_IFIX_EXP_MAP|S|Absolute or relative path to the mapping/configuration file for TsToScada - the file that maps Nematic objects identified by node.tag.field to SmG time series identified by tscode or fullname. Relative paths will be resolved according to ICCDIR. Default value is “ts_to_ifix_map.txt”.|

#### AutoPilot

|NAME|TYPE|DESCRIPTION|
|----|----|-----------|
|ICC_SCADAEX_AP_FILE|S|Absolute or relative path to the configuration file for AutoPilot. Relative paths will be resolved according to `ICCDIR`. Default value is “autopilot.txt”.|
|ICC_SCADAEX_AP_TIMESPEC|S|Monitoring period to use for StandardPowerPlant and StandardReservoir. CustomAutopilot allows customization of monitoring period for each time series. Default is "START=LOCAL DAY END=LOCAL DAY+2d".|
|ICC_SCADAEX_AP_SLEEP|I|Idle sleep period. Time in number of milliseconds that the program shall sleep between each time it refreshes the configured time series and writes any updated values to iFix. Default value is 5000 (5 seconds), minimum allowed value is 100 (0,1 seconds).|
|ICC_SCADAEX_AP_INITSLEEP|I|Initial sleep period. Value is number of times in the main loop, which means a multiple of idle sleeps. Default value is 0, in which case there will be no initial sleep.|
|ICC_SCADAEX_AP_OPERSLEEP|I|Sleep period between each unit processed. Default is 0, which means all units will be processed in sequence without any sleep between.|
|ICC_SCADAEX_AP_MEMCLEANUP|I|Same as `ICC_2IFIX_MEMCLEANUP`:  Number of seconds between each time the internal time series cache shall be cleared to avoid accumulation of a data for long time periods that will no longer be of any use. Default value is 86400 (24 hours, 24*3600). Minimum allowed value is 2.|
|ICC_AP_PLANCHANGE_NEXT_DAY_HOUR|I|Hour of the day when changes for the next day should be reported by setting the plan changed alarm, in addition to changes the current day. Default is 17, which means after 17:00 any changes for the following day will be reported.|
|ICC_SCADAEX_AP_POWELSIMSHOP|B|Enables the “PowelSimShop” mode of the missing plan alarms. See ScadaEx User guide for more information about alarms.|
|ICC_SCADAEX_AP_CHECK_HOUR|I|Hour of the day to check if plan value for the next day is missing. Default value is 21. See ScadaEx User guide for more information about alarms.|
|ICC_SCADAEX_AP_OLD_PLAN|I|In “PowelSimShop” missing plan alarm mode this value specifies the length of the time window in number of hours where a value is considered valid. If the break point value for the current time is older than this number of hours then it is considered old, and a missing plan alarm will be set. Default value is 24. See ScadaEx User guide for more information about alarms.|
|ICC_IFIX_EXEC_ON_FAILED_VALUES|B|If execute block should be set even if ScadaEx failed to write some of the values to iFix. If not set then the following will be logged: "Failed to update AP values. Final execute command <NTF> skipped for safety reasons".|
|ICC_IFIX_EXEC_ON_MISSING_VALUES|B|If execute block should be set even if ScadaEx found missing values in some of the planning time series. If not set then the following will be logged: "Missing values for ts <TS>. Final execute command skipped for safety reasons".|
|ICC_SCADAEX_AP_FMS|B|If ScadaEx should write information to the SmG database required by the Flexible Manning Security (FMS) functionality in other SmG software.|
|ICC_SCADAEX_AP_FMS_DISABLE|B|Special flag to properly deactivate the FMS information written by ScadaEx due to `ICC_SCADAEX_AP_FMS`. The reason for this is that the information written by ScadaEx includes reference to node and mapfile, and when ScadaEx is stopped this information will not be removed for safety reasons. Therefore, when a configuration file is renamed or is no longer in use the information will be kept in the database. This configuration variable (ICC_SCADAEX_AP_FMS_DISABLE) will make ScadaEx remove any FMS information written for the current configuration. To deactivate a configuration file the ScadaEx must be started with this variable set and can then be stopped immediately after the FMS processing has completed.|
