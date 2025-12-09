### ScadaEx version history

The following table shows important changes in ScadaEx:

|VERSION|ADDED/ IMPROVED/ REMOVED|DESCRIPTION|
|-------|----------------------|-----------|
|Asteria/ 2026.1|Added|ScadaEx does now support Oracle 23ai client (64 bit).|
||Improved|Trace logging is enhanced and is enabled for AutoPilot, HistoryCollection and TsToScada modules. The trace file per running instance will be switched every midnight, and the trace filename will for TsToScada also contain the parameter file used when starting the module.|
||Improved|Transfer of new values in the AutoPilot module is improved to also transfer values if the previous value is missing, or if the next value is the same as the value before.|
|Phoebe|Improved|A new instance of AutoPilot trace file including date stamp in the name is created when AutoPilot is started.|
||Improved|An option to turn on/off Ifix log to ICC-Log with the configuration variable SCADAEX_LOG_IFIX (TRUE/FALSE or YES/NO). Default value is no logging to ICC log.|
||Improved|Logging user messages to console (if present) when shutting down ScadaEx with <CTRL_C> EVENT.|
||Added|Added configuration variable LOG_XTRA_2_TRACE_FILE to add more information to AutoPilot trace file to ease debugging. Default value is TRUE.|
|10.2.1|Added|Support for logging to Windows Event Log instead of console.|
||Added|Support for installing and running as a Windows Service.|
||Added|Support for reading command line arguments from file (command file).|
||Improved|Command line syntax extended to support new features (Windows Event Log, Windows Service, command file etc.), and some other general improvements. All changes are backwards compatible so existing commands should function as before.|
||Improved|Modifications in the main collection loop logic of history collection, primarily related to database disconnection and the creation of files. The configuration variable ICC_IFIX_MIN_QREAD is now only considered when database is not connected, and default value is the value of ICC_IFIX_MAX_CACHE.|
||Added|Added configuration variables ICC_SCADAEX_USE_EVENTLOG, ICC_SCADAEX_EVENTSOURCE, ICC_IFIX_CACHEDUMP_DIR and ICC_SCADAEX_COMMANDFILE.|
||Improved|Renamed configuration variable SCADAEX_DEBUGLEVEL to ICC_SCADAEX_DEBUGLEVEL (conformance with name format of the other variables).|
||Removed|Removed configuration variable DEBUG_IFIXIMP. Use ICC_SCADAEX_DEBUGLEVEL instead.|
