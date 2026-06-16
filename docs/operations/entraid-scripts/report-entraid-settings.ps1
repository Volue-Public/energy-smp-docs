<#
Smart Power - Entra ID configuration reporter

Reads existing app registrations and outputs settings ready to paste into
application configuration files (appsettings.json, environment variables, etc.).

Read-only: requires only Application.Read.All on Microsoft Graph.
#>

# ----------------------------
# 0) LOGGING CONFIG
# ----------------------------
$Global:RunId       = [guid]::NewGuid()
$Global:LogLevel    = "INFO"     # TRACE, DEBUG, INFO, WARN, ERROR
$Global:WriteToFile = $false
$Global:LogFile     = Join-Path (Get-Location) ("smartpower-report_{0}.log" -f $Global:RunId)
$Global:ScriptStart = Get-Date

# ----------------------------
# 1) CONFIG
# ----------------------------

. "$PSScriptRoot\entraid-config.ps1"

# ----------------------------
# 2) LOG HELPERS
# ----------------------------

function _LevelRank([string]$Level) {
  switch ($Level.ToUpper()) {
    "TRACE" { 1 }
    "DEBUG" { 2 }
    "INFO"  { 3 }
    "WARN"  { 4 }
    "ERROR" { 5 }
    default { 3 }
  }
}

function Write-Log {
  param(
    [Parameter(Mandatory)] [string]$Message,
    [ValidateSet("TRACE","DEBUG","INFO","WARN","ERROR")] [string]$Level = "INFO"
  )

  if ((_LevelRank $Level) -lt (_LevelRank $Global:LogLevel)) { return }

  $ts   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
  $line = "[{0}][{1}] {2}" -f $ts, $Level, $Message

  switch ($Level) {
    "ERROR" { Write-Host $line -ForegroundColor Red }
    "WARN"  { Write-Host $line -ForegroundColor Yellow }
    "DEBUG" { Write-Host $line -ForegroundColor DarkGray }
    "TRACE" { Write-Host $line -ForegroundColor Blue }
    default { Write-Host $line }
  }

  if ($Global:WriteToFile) { Add-Content -Path $Global:LogFile -Value $line }
}

# ----------------------------
# 3) CONNECT TO GRAPH (read-only)
# ----------------------------

Write-Log "Report started. LogLevel=$($Global:LogLevel)" INFO

try {
  if (-not (Get-Module Microsoft.Graph -ListAvailable)) {
    Write-Log "Microsoft.Graph module not found. Installing..." WARN
    Install-Module Microsoft.Graph -Scope CurrentUser -Force
  }

  Connect-MgGraph -Scopes "Application.Read.All" | Out-Null

  $ctx      = Get-MgContext
  $tenantId = $ctx.TenantId
  Write-Log "Connected to Graph. TenantId=$tenantId" INFO
} catch {
  Write-Log "Connect to Graph failed: $($_.Exception.Message)" ERROR
  throw
}

# ----------------------------
# 4) READ HELPERS
# ----------------------------

function Get-ApplicationByDisplayName([string]$displayName) {
  $apps = Get-MgApplication -Filter "displayName eq '$displayName'" -ConsistencyLevel eventual -All
  $apps | Select-Object -First 1
}

function Get-ScopeIdByValue([object]$app, [string]$scopeValue) {
  if (-not $app -or -not $app.Api -or -not $app.Api.Oauth2PermissionScopes) { return $null }
  $scope = $app.Api.Oauth2PermissionScopes | Where-Object { $_.Value -eq $scopeValue } | Select-Object -First 1
  if ($scope) { return $scope.Id } else { return $null }
}

function Get-RedirectUris([object]$app) {
  $uris = @()
  if ($app.Spa -and $app.Spa.RedirectUris)          { $uris += $app.Spa.RedirectUris }
  if ($app.PublicClient -and $app.PublicClient.RedirectUris) { $uris += $app.PublicClient.RedirectUris }
  if ($app.Web -and $app.Web.RedirectUris)           { $uris += $app.Web.RedirectUris }
  $uris
}

# ----------------------------
# 5) LOOK UP MESH APP
# ----------------------------

$meshApp = Get-ApplicationByDisplayName $MeshAppDisplayName
if (-not $meshApp) {
  Write-Log "Mesh app '$MeshAppDisplayName' not found in directory." ERROR
  throw "Mesh app not found."
}

$meshClientId  = $meshApp.AppId
$meshScopeId   = Get-ScopeIdByValue $meshApp $MeshScopeValue
$meshScopeUri  = "api://$meshClientId/$MeshScopeValue"
$meshAuthority = "https://login.microsoftonline.com/$tenantId/"

Write-Log "Mesh | ClientId=$meshClientId | ScopeUri=$meshScopeUri" INFO

# ----------------------------
# 6) COLLECT SETTINGS PER APP
# ----------------------------

$report = @()

foreach ($appDef in $SmartApps) {
  $app = Get-ApplicationByDisplayName $appDef.DisplayName

  if (-not $app) {
    Write-Log "App not found: $($appDef.DisplayName)" WARN
    $report += [pscustomobject]@{
      Key          = $appDef.Key
      DisplayName  = $appDef.DisplayName
      Found        = $false
      TenantId     = $tenantId
      ClientId     = ""
      Authority    = $meshAuthority
      ExposedScope = ""
      ScopeId      = ""
      RedirectUris = ""
      MeshScope    = $meshScopeUri
      MeshScopeId  = if ($meshScopeId) { $meshScopeId.ToString() } else { "" }
    }
    continue
  }

  $scopeUri  = ""
  $scopeId   = ""
  if ($appDef.ScopeValue) {
    $sid      = Get-ScopeIdByValue $app $appDef.ScopeValue
    $scopeUri = "api://$($app.AppId)/$($appDef.ScopeValue)"
    $scopeId  = if ($sid) { $sid.ToString() } else { "(not found)" }
  }

  $redirectUris = (Get-RedirectUris $app) -join ", "

  Write-Log "$($appDef.Key) | ClientId=$($app.AppId) | Scope=$scopeUri" INFO

  $report += [pscustomobject]@{
    Key          = $appDef.Key
    DisplayName  = $appDef.DisplayName
    Found        = $true
    TenantId     = $tenantId
    ClientId     = $app.AppId
    Authority    = $meshAuthority
    ExposedScope = $scopeUri
    ScopeId      = $scopeId
    RedirectUris = $redirectUris
    MeshScope    = $meshScopeUri
    MeshScopeId  = if ($meshScopeId) { $meshScopeId.ToString() } else { "" }
  }
}

# ----------------------------
# 7) OUTPUT
# ----------------------------

$duration = (Get-Date) - $Global:ScriptStart
Write-Log ("Report completed in {0:n2}s" -f $duration.TotalSeconds) INFO

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Smart Power - Entra ID configuration settings" -ForegroundColor Cyan
Write-Host "  TenantId : $tenantId" -ForegroundColor Cyan
Write-Host "  Authority: $meshAuthority" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "--- Mesh (shared resource) ---" -ForegroundColor Green
Write-Host "  DisplayName : $MeshAppDisplayName"
Write-Host "  ClientId    : $meshClientId"
Write-Host "  ScopeUri    : $meshScopeUri"
Write-Host "  ScopeId     : $meshScopeId"

Write-Host ""
Write-Host "--- Smart Power applications ---" -ForegroundColor Green
$report | Format-Table Key, ClientId, ExposedScope, RedirectUris -AutoSize -Wrap

Write-Host "--- Full settings per application ---" -ForegroundColor Green
foreach ($r in $report) {
  $status = if ($r.Found) { "" } else { " [NOT FOUND]" }
  Write-Host ""
  Write-Host "  [$($r.Key)]$status" -ForegroundColor $(if ($r.Found) { "White" } else { "Yellow" })
  Write-Host "    DisplayName  : $($r.DisplayName)"
  Write-Host "    TenantId     : $($r.TenantId)"
  Write-Host "    ClientId     : $($r.ClientId)"
  Write-Host "    Authority    : $($r.Authority)"
  if ($r.ExposedScope) {
    Write-Host "    ExposedScope : $($r.ExposedScope)"
    Write-Host "    ScopeId      : $($r.ScopeId)"
  }
  if ($r.RedirectUris) {
    Write-Host "    RedirectUris : $($r.RedirectUris)"
  }
  Write-Host "    MeshScope    : $($r.MeshScope)"
}

Write-Host ""
Write-Host "--- JSON snippet (for appsettings.json / env vars) ---" -ForegroundColor Green
$jsonOut = @{}
$jsonOut["Mesh"] = @{
  ClientId  = $meshClientId
  ScopeUri  = $meshScopeUri
  Authority = $meshAuthority
  TenantId  = $tenantId
}
foreach ($r in ($report | Where-Object { $_.Found })) {
  $entry = [ordered]@{
    ClientId  = $r.ClientId
    Authority = $r.Authority
    TenantId  = $r.TenantId
  }
  if ($r.ExposedScope) { $entry["ExposedScope"] = $r.ExposedScope }
  if ($r.RedirectUris) {
    $entry["RedirectUris"] = $r.RedirectUris -split ", "
  }
  $jsonOut[$r.Key] = $entry
}
$jsonOut | ConvertTo-Json -Depth 5
