<#
Smart Power provisioning (Entra ID / Microsoft Graph) + Rich Logging + Idempotency

Aligned with internal Smart Power docs:
- /callback redirect for apps
- client secret per app (OBO to Mesh)
- expose API scopes
- app roles mapped to groups
- add delegated permission from each Smart Power app to Mesh API
- pre-authorize client applications in Mesh

Idempotent behavior:
- Re-run safe: only patches when needed, no duplicate roles/scopes/redirects/assignments
#>

# ----------------------------
# 0) LOGGING CONFIG + HELPERS
# ----------------------------
$Global:RunId          = [guid]::NewGuid()
$Global:LogLevel       = "DEBUG"     # TRACE, DEBUG, INFO, WARN, ERROR
$Global:WriteToFile    = $true
$Global:LogFile        = Join-Path (Get-Location) ("smartpower-provisioning_{0}.log" -f $Global:RunId)
$Global:ScriptStart    = Get-Date
$Global:StepIndex      = 0
$Global:StepsTotalHint = 30
# ----------------------------
# SECRET HANDLING (secure by default)
# ----------------------------
$Global:EmitSecretsToConsole = $true   # secure default (do NOT print secretText)
$Global:StoreSecretsInKeyVault = $false  # set to $false if you only want manual handling
$Global:KeyVaultName = "kv-smartpower-auto"              # e.g. "kv-smartpower-dev" (leave empty to disable KV store)
$Global:KeyVaultSecretPrefix = "smartpower"  # name prefix for secrets in KV

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
    [ValidateSet("TRACE","DEBUG","INFO","WARN","ERROR")] [string]$Level = "INFO",
    [switch]$Sensitive,
    [switch]$RevealSensitiveInConsole
  )

  $Lvl = _LevelRank $Level
  $GLvl = _LevelRank $Global:LogLevel
  if ($Lvl -lt $GLvl) { return }

  $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
  $safeMessageFile = if ($Sensitive) { "***REDACTED***" } else { $Message }
  $safeMessageConsole = if ($Sensitive -and -not $RevealSensitiveInConsole) { "***REDACTED***" } else { $Message }
  $lineFile = "[{0}][{1}][RunId:{2}] {3}" -f $ts, $Level, $Global:RunId, $safeMessageFile
  $lineConsole = "[{0}][{1}][RunId:{2}] {3}" -f $ts, $Level, $Global:RunId, $safeMessageConsole

  switch ($Level) {
    "ERROR" { Write-Host $lineConsole -ForegroundColor Red }
    "WARN"  { Write-Host $lineConsole -ForegroundColor Yellow }
    "DEBUG" { Write-Host $lineConsole -ForegroundColor DarkGray }
    "TRACE" { Write-Host $lineConsole -ForegroundColor Blue }
    default { Write-Host $lineConsole }
  }

  if ($Global:WriteToFile) {
    Add-Content -Path $Global:LogFile -Value $lineFile
  }
}

function Start-Step {
  param(
    [Parameter(Mandatory)] [string]$Name,
    [int]$PercentComplete = -1
  )
  $Global:StepIndex++

  if ($PercentComplete -ge 0) {
    Write-Progress -Activity "Smart Power Provisioning" -Status $Name -PercentComplete $PercentComplete
  } else {
    $pct = [math]::Min(100, [math]::Round(($Global:StepIndex / [double]$Global:StepsTotalHint) * 100))
    Write-Progress -Activity "Smart Power Provisioning" -Status $Name -PercentComplete $pct
  }

  Write-Log ("▶ START ({0}/{1}): {2}" -f $Global:StepIndex, $Global:StepsTotalHint, $Name) INFO
  return [pscustomobject]@{ Name = $Name; Started = Get-Date }
}

function End-Step {
  param(
    [Parameter(Mandatory)] $Step,
    [bool]$Success = $true,
    [string]$Details = ""
  )
  $elapsed = (Get-Date) - $Step.Started
  $suffix = if ($Details) { " | $Details" } else { "" }

  if ($Success) {
    Write-Log ("✅ DONE: {0} (took {1:n2}s){2}" -f $Step.Name, $elapsed.TotalSeconds, $suffix) INFO
  } else {
    Write-Log ("❌ FAILED: {0} (after {1:n2}s){2}" -f $Step.Name, $elapsed.TotalSeconds, $suffix) ERROR
  }
}

function Fail-Fast {
  param(
    [Parameter(Mandatory)] [string]$Context,
    [Parameter(Mandatory)] $ErrorRecord
  )
  Write-Log ("{0}: {1}" -f $Context, $ErrorRecord.Exception.Message) ERROR
  Write-Log ($ErrorRecord.ScriptStackTrace) DEBUG
  Write-Progress -Activity "Smart Power Provisioning" -Status "Failed" -Completed
  throw $ErrorRecord
}

Write-Log "Provisioning started. LogFile=$($Global:LogFile), LogLevel=$($Global:LogLevel)" INFO
Write-Log "RunId=$($Global:RunId)" INFO

# ----------------------------
# 1) CONFIG (edit these)
# ----------------------------

$NamePrefix = "energy-"
$EnvSuffix  = "-auto"  # set "" if you don't want environment suffix

$Fqdn = "localhost"
$AppPorts = @{
  AssetManager        = "1234"
  AvailabilityPlanner = "1235"
  MeshConfigurator    = "1236"
}

# Scope "values" (strings). Script reuses existing scope IDs if these exist.
##$SmartAppScopeValue = "user_impersonation"
$MeshScopeValue     = "Mesh.Grpc"

# Type definitions:
#   MemberType - defines the member type of a role, legal values: User, Application
#   ObjectType - defines the access group type, legal values: Group
#   PermissionType - defines the API permission type, legal values: Scope, Role
#   AppType - defines type of application, legal values: Application, Daemon

# Mesh roles (examples)
$MeshRolesDesired = @(
  @{ DisplayName="ModelReader"; Value="ModelReader"; MemberType="User"; Description="Mesh model read access"                  },
  @{ DisplayName="ModelWriter"; Value="ModelWriter"; MemberType="User"; Description="Mesh model write access"                 },
  @{ DisplayName="TimeSeriesReader"; Value="TimeSeriesReader"; MemberType="User"; Description="Mesh time series read access"  },
  @{ DisplayName="TimeSeriesWriter"; Value="TimeSeriesWriter"; MemberType="User"; Description="Mesh time series write access" },
  @{ DisplayName="Daemon"; Value="Daemon"; MemberType="Application"; Description="Mesh daemon access"                         }
)
$MeshGroupsDesired = @(
  @{ DisplayName="HteWrite"; ObjectType="Group"; RoleAssigned="ModelWriter"      },
  @{ DisplayName="HteWrite"; ObjectType="Group"; RoleAssigned="TimeSeriesWriter" },
  @{ DisplayName="HteRead";  ObjectType="Group"; RoleAssigned="ModelReader"      },
  @{ DisplayName="HteRead";  ObjectType="Group"; RoleAssigned="ModelReader"      }
)

# Smart Power apps + their role names (match the docs examples)
$SmartApps = @(
  @{
    Key="OptimalGateway"
    DisplayName=("${NamePrefix}optimal-gateway${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="OptimalGwAdmin";  Value="OptimalGwAdmin";  MemberType="User"; Description="Full access including delete and config"                                              },
      @{ DisplayName="OptimalGwEditor"; Value="OptimalGwEditor"; MemberType="User"; Description="Read + create/update (no delete)"                                                     },
      @{ DisplayName="OptimalGwViewer"; Value="OptimalGwViewer"; MemberType="User"; Description="Read only access (GET endpoints only)"                                                },
      @{ DisplayName="OptimalGwServiceAccount"; Value="OptimalGwServiceAccount"; MemberType="Application"; Description="Machine/daemon clients, used for background jobs or interface" },
      @{ DisplayName="Daemon"; Value="Daemon"; MemberType="Application"; Description="Mesh daemon access"                                                                              }
    )
    Groups=@(
      @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="OptimalGwAdmin"  },
      @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="OptimalGwEditor" },
      @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="OptimalGwViewer" }
    )
    ScopeValue="Optimal.Gateway"
    MeshPermissions=@(
      @{ PermissionType="Scope" },
      @{ PermissionType="Role" }
    )
  },
  @{
    Key="AssetManager"
    DisplayName=("${NamePrefix}asset-manager${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="AssetManagerRead";   Value="AssetManagerRead";   MemberType="User"; Description="Asset Manager read access"       },
      @{ DisplayName="AssetManagerWrite";  Value="AssetManagerWrite";  MemberType="User"; Description="Asset Manager modify access"     },
      @{ DisplayName="AssetManagerDelete"; Value="AssetManagerDelete"; MemberType="User"; Description="Asset Manager add/delete access" }
    )
    Groups=@(
      @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="AssetManagerRead"   },
      @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="AssetManagerWrite"  },
      @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="AssetManagerDelete" }
    )
    ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="AvailabilityPlanner"
    DisplayName=("${NamePrefix}availability-planner${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="AvailabilityRead";  Value="AvailabilityRead";  MemberType="User"; Description="Availability Planner read access"   },
      @{ DisplayName="AvailabilityWrite"; Value="AvailabilityWrite"; MemberType="User"; Description="Availability Planner modify access" },
      @{ DisplayName="AvailabilityAdmin"; Value="AvailabilityAdmin"; MemberType="User"; Description="Availability Planner admin access"  }
    )
    Groups=@(
      @{ DisplayName="Availabilityadmin"; ObjectType="Group"; RoleAssigned="AvailabilityAdmin" },
      @{ DisplayName="Availabilityread";  ObjectType="Group"; RoleAssigned="AvailabilityRead"  },
      @{ DisplayName="Availabilitywrite"; ObjectType="Group"; RoleAssigned="AvailabilityWrite" },
      @{ DisplayName="HteRead";           ObjectType="Group"; RoleAssigned="AvailabilityRead"  },
      @{ DisplayName="HteWrite";          ObjectType="Group"; RoleAssigned="AvailabilityWrite" },
      @{ DisplayName="HteDelete";         ObjectType="Group"; RoleAssigned="AvailabilityAdmin" }
    )
    ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="MeshConfigurator"
    DisplayName=("${NamePrefix}mesh-configurator${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="MeshConfiguratorRead";  Value="MeshConfiguratorRead";  MemberType="User"; Description="Mesh Configurator read access"   },
      @{ DisplayName="MeshConfiguratorWrite"; Value="MeshConfiguratorWrite"; MemberType="User"; Description="Mesh Configurator modify access" }
    )
    Groups=@(
      @{ DisplayName="Availabilityread"; ObjectType="Group"; RoleAssigned="MeshConfiguratorRead"  },
      @{ DisplayName="HteRead";          ObjectType="Group"; RoleAssigned="MeshConfiguratorRead"  },
      @{ DisplayName="HteWrite";         ObjectType="Group"; RoleAssigned="MeshConfiguratorRead"  },
      @{ DisplayName="HteDelete";        ObjectType="Group"; RoleAssigned="MeshConfiguratorWrite" }
    )
    ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="Nimbus"
    DisplayName=("${NamePrefix}nimbus${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="NimbusRead";  Value="NimbusRead";  MemberType="User"; Description="Nimbus read access"   },
      @{ DisplayName="NimbusWrite"; Value="NimbusWrite"; MemberType="User"; Description="Nimbus modify access" }
    )
    Groups=@(
      @{ DisplayName="HteRead";  ObjectType="Group"; RoleAssigned="NimbusRead"  },
      @{ DisplayName="HteWrite"; ObjectType="Group"; RoleAssigned="NimbusWrite" }
    )
    ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
    OptimalGatewayPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="MarginalCost"
    DisplayName=("${NamePrefix}marginal-cost${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="MarginalCostRead";  Value="MarginalCostRead";  MemberType="User"; Description="Marginal Cost read access"   },
      @{ DisplayName="MarginalCostWrite"; Value="MarginalCostWrite"; MemberType="User"; Description="Marginal Cost modify access" }
    )
    Groups=@(
      @{ DisplayName="HteRead";  ObjectType="Group"; RoleAssigned="MarginalCostRead"  },
      @{ DisplayName="HteWrite"; ObjectType="Group"; RoleAssigned="MarginalCostWrite" }
    )
    ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="MeshDataTransfer"
    DisplayName=("${NamePrefix}mesh-data-transfer${EnvSuffix}")
    AppType="Daemon"
    #Roles=@(
    #  @{ DisplayName="OptimalGwAdmin";  Value="OptimalGwAdmin";  MemberType="User"; Description="Full access including delete and config"                                              },
    #  @{ DisplayName="OptimalGwEditor"; Value="OptimalGwEditor"; MemberType="User"; Description="Read + create/update (no delete)"                                                     },
    #  @{ DisplayName="OptimalGwViewer"; Value="OptimalGwViewer"; MemberType="User"; Description="Read only access (GET endpoints only)"                                                },
    #  @{ DisplayName="OptimalGwServiceAccount"; Value="OptimalGwServiceAccount"; MemberType="Application"; Description="Machine/daemon clients, used for background jobs or interface" }
    #)
    #Groups=@(
    #  @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="OptimalGwAdmin"  },
    #  @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="OptimalGwEditor" },
    #  @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="OptimalGwViewer" }
    #)
    #ScopeValue="user_impersonation"
    MeshPermissions=@(
      @{ PermissionType="Role" }
    )
  }
)

$MeshAppDisplayName = "${NamePrefix}mesh${EnvSuffix}"

$Global:StepsTotalHint = 12 + ($SmartApps.Count * 10) + ($MeshRolesDesired.Count * 3)

Write-Log "Config: Mesh=$MeshAppDisplayName, Apps=$($SmartApps.DisplayName -join ', ')" DEBUG

# ----------------------------
# 2) CONNECT TO GRAPH
# ----------------------------

$step = Start-Step "Ensure Microsoft.Graph module + Connect-MgGraph"
try {
  if (-not (Get-Module Microsoft.Graph -ListAvailable)) {
    Write-Log "Microsoft.Graph module not found. Installing..." WARN
    Install-Module Microsoft.Graph -Scope CurrentUser -Force
  }
  ##Import-Module Microsoft.Graph

  ##$scopes = @(
  ##  "Application.ReadWrite.All",
  ##  "Directory.ReadWrite.All",
  ##  "Group.ReadWrite.All",
  ##  "AppRoleAssignment.ReadWrite.All"
  ##)
  $scopes = @(
    "Application.ReadWrite.All"
  )
  Write-Log ("Connecting with scopes: {0}" -f ($scopes -join ", ")) DEBUG
  Connect-MgGraph -Scopes $scopes | Out-Null

  $ctx = Get-MgContext
  $tenantId = $ctx.TenantId
  Write-Log "Connected to Graph. TenantId=$tenantId" INFO
  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "Connect to Graph failed" $_
}

# ----------------------------
# 3) GENERIC HELPERS (IDEMPOTENT PATCHES)
# ----------------------------

function New-Guid { [guid]::NewGuid() }

function Json-Equal($A, $B) {
  ($A | ConvertTo-Json -Depth 40) -eq ($B | ConvertTo-Json -Depth 40)
}

function Get-ApplicationByDisplayName([string]$displayName) {
  Write-Log "Searching application by displayName='$displayName'" DEBUG
  $apps = Get-MgApplication -Filter "displayName eq '$displayName'" -ConsistencyLevel eventual -All
  $apps | Select-Object -First 1
}

function Ensure-Application([string]$displayName) {
  $existing = Get-ApplicationByDisplayName $displayName
  if ($existing) {
    Write-Log "Using existing app: $displayName | AppId=$($existing.AppId) | ObjId=$($existing.Id)" INFO
    return $existing
  }
  $app = New-MgApplication -DisplayName $displayName -SignInAudience "AzureADMyOrg"
  Write-Log "Created app: $displayName | AppId=$($app.AppId) | ObjId=$($app.Id)" INFO
  return $app
}

function Ensure-ServicePrincipalForApp([string]$appId, [string]$displayName) {
  $sp = Get-MgServicePrincipal -Filter "appId eq '$appId'" -All | Select-Object -First 1
  if ($sp) { return $sp }
  Write-Log "Creates SP appId=$appId displayName=$displayName" DEBUG
  $spNew = New-MgServicePrincipal -AppId $appId -DisplayName $displayName
  Write-Log "Created SP | SpObjId=$($spNew.Id) | AppId=$appId" INFO
  return $spNew
}

function Ensure-ServicePrincipalAppRoleAssignment {
  param(
    [Parameter(Mandatory)][string]$principalSpId,   # client/service SP (mesh-data-transfer)
    [Parameter(Mandatory)][string]$resourceSpId,    # resource SP (Mesh enterprise app)
    [Parameter(Mandatory)][guid]  $appRoleId,
    [Parameter()][string]$RoleValue = ""
  )

  # Check existing assignments to avoid duplicates
  $resp = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$principalSpId/appRoleAssignments"
  $exists = $false
  if ($resp.value) {
    $exists = $resp.value | Where-Object { $_.resourceId -eq $resourceSpId -and $_.appRoleId -eq $appRoleId } | Select-Object -First 1
  }

  if ($exists) {
    Write-Log "SP appRoleAssignment exists -> skip (Role=$RoleValue)" DEBUG
    return
  }

  Write-Log "Assign SP->appRole | PrincipalSpId=$principalSpId | ResourceSpId=$resourceSpId | Role=$RoleValue" INFO
  $body = @{
    principalId = $principalSpId
    resourceId  = $resourceSpId
    appRoleId   = $appRoleId
  }

  Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$principalSpId/appRoleAssignments" -Body ($body | ConvertTo-Json -Depth 10) | Out-Null
}

function Get-Application([string]$appObjectId) {
  Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/v1.0/applications/$appObjectId"
}

function Patch-ApplicationIfChanged([string]$appObjectId, [hashtable]$patchBody, [string]$what) {
  Write-Log "Patch-ApplicationIfChanged appObjectId=$appObjectId patchBody=$patchBody what=$what" DEBUG
  # Only patch if at least one field differs
  $current = Get-Application $appObjectId
  $currentJson = $current | ConvertTo-Json -Depth 60
  $patchBodyJson = $patchBody | ConvertTo-Json -Depth 60

  $changed = $false
  foreach ($k in $patchBody.Keys) {
    if (-not (Json-Equal $current.$k $patchBody[$k])) {
      $currentKjson = $current.$k | ConvertTo-Json -Depth 10
      $patchBodyKjson = $patchBody[$k] | ConvertTo-Json -Depth 10
      $changed = $true
      break
    }
  }

  if (-not $changed) {
    Write-Log "$what : no changes detected -> skipping PATCH" DEBUG
    return $false
  }

  Write-Log "$what : changes detected -> PATCH" INFO
  Write-Log "current: $currentJson" TRACE
  Write-Log "patchBody: $patchBodyJson" TRACE
  Invoke-MgGraphRequest -Method PATCH -Uri "https://graph.microsoft.com/v1.0/applications/$appObjectId" -ContentType "application/json" -Body $patchBodyJson | Out-Null
  return $true
}

function Ensure-Group([string]$displayName) {
  $g = Get-MgGroup -Filter "displayName eq '$displayName'" -All | Select-Object -First 1
  if ($g) {
    Write-Log "Using existing group '$displayName' | GroupId=$($g.Id)" DEBUG
    return $g
  }

  $nick = ($displayName -replace '[^a-zA-Z0-9]', '').ToLower()
  if ($nick.Length -gt 50) { $nick = $nick.Substring(0,50) }
  if ([string]::IsNullOrWhiteSpace($nick)) { $nick = "grp$(Get-Random)" }

  $gNew = New-MgGroup -DisplayName $displayName -MailEnabled:$false -SecurityEnabled:$true -MailNickname $nick
  Write-Log "Created group '$displayName' | GroupId=$($gNew.Id)" INFO
  return $gNew
}

function Ensure-GroupAppRoleAssignment([string]$groupId, [string]$resourceSpId, [guid]$appRoleId, [string]$RoleValue) {
  # Pre-check existing assignment to avoid duplicates
  $resp = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/v1.0/groups/$groupId/appRoleAssignments"
  $exists = $false
  if ($resp.value) {
    $exists = $resp.value | Where-Object { $_.resourceId -eq $resourceSpId -and $_.appRoleId -eq $appRoleId } | Select-Object -First 1
  }

  if ($exists) {
    Write-Log "Assignment exists -> group '$RoleValue' already assigned" DEBUG
    return
  }

  Write-Log "Assign group->appRole | GroupId=$groupId | Role=$RoleValue" INFO
  $body = @{
    principalId = $groupId
    resourceId  = $resourceSpId
    appRoleId   = $appRoleId
  }
  Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/groups/$groupId/appRoleAssignments" -Body ($body | ConvertTo-Json -Depth 10) | Out-Null
}

function Ensure-OAuth2PermissionGrant([string]$clientSpId, [string]$resourceSpId, [string]$scopeValue) {
  $grants = Invoke-MgGraphRequest -Method GET -Uri "https://graph.microsoft.com/v1.0/oauth2PermissionGrants?`$filter=clientId eq '$clientSpId' and resourceId eq '$resourceSpId'"
  $existing = $null
  if ($grants.value) { $existing = $grants.value | Select-Object -First 1 }

  if ($existing) {
    # ensure scopeValue included
    $scopes = @($existing.scope -split '\s+') | Where-Object { $_ }
    if ($scopes -contains $scopeValue) {
      Write-Log "oauth2PermissionGrant already contains '$scopeValue' -> skip" DEBUG
      return
    }
    $newScope = (@($scopes + $scopeValue) | Select-Object -Unique) -join " "
    Write-Log "Updating oauth2PermissionGrant scope: '$($existing.scope)' -> '$newScope'" INFO
    Invoke-MgGraphRequest -Method PATCH -Uri "https://graph.microsoft.com/v1.0/oauth2PermissionGrants/$($existing.id)" -Body (@{ scope = $newScope } | ConvertTo-Json) | Out-Null
    return
  }

  Write-Log "Creating oauth2PermissionGrant (AllPrincipals) for scope '$scopeValue'" INFO
  $body = @{
    clientId    = $clientSpId
    consentType = "AllPrincipals"
    principalId = $null
    resourceId  = $resourceSpId
    scope       = $scopeValue
  }
  Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/oauth2PermissionGrants" -Body ($body | ConvertTo-Json -Depth 10) | Out-Null
}

function Ensure-RedirectUri([string]$appObjectId, [string]$redirect) {
  $app = Get-Application $appObjectId
  $current = @()
  if ($app.spa -and $app.spa.redirectUris) { $current = @($app.spa.redirectUris) }

  if ($current -contains $redirect) {
    Write-Log "Redirect URI exists -> skip ($redirect)" DEBUG
    return $false
  }

  $newUris = @($current + $redirect)
  return (Patch-ApplicationIfChanged $appObjectId @{ spa = @{ redirectUris = $newUris } } "Ensure redirect URIs")
}

function Ensure-ApiScopeByValue([string]$appObjectId, [string]$scopeValue, [string]$displayNameForConsent) {
  Write-Log "Ensure-ApiScopeByValue appObjectId=$appObjectId scopeValue=$scopeValue displayNameForConsent=$displayNameForConsent"
  $app = Get-Application $appObjectId
  $scopes = @()
  if ($app.api -and $app.api.oauth2PermissionScopes) { $scopes = @($app.api.oauth2PermissionScopes) }

  $existing = $scopes | Where-Object { $_.value -eq $scopeValue } | Select-Object -First 1
  if ($existing) {
    Write-Log "Scope '$scopeValue' exists -> reuse id=$($existing.id)" DEBUG
    return [pscustomobject]@{ Id = $existing.id; Value = $existing.value }
  }

  $newId = New-Guid
  $newScope = @{
    adminConsentDescription = "Access $displayNameForConsent as the signed-in user"
    adminConsentDisplayName = "Access $displayNameForConsent"
    id = $newId
    isEnabled = $true
    type = "User"
    userConsentDescription = "Access $displayNameForConsent as you"
    userConsentDisplayName = "Access $displayNameForConsent"
    value = $scopeValue
  }

  $newScopes = @($scopes + $newScope)

  $api = @{
    requestedAccessTokenVersion = 2
    oauth2PermissionScopes      = $newScopes
    preAuthorizedApplications   = @() # $(if ($app.api -and $app.api.preAuthorizedApplications) { $app.api.preAuthorizedApplications } else { @() })
  }
  if ($app.api -and $app.api.preAuthorizedApplications) { $api.preAuthorizedApplications = $app.api.preAuthorizedApplications }

  Patch-ApplicationIfChanged $appObjectId @{ api = $api } "Ensure API scope '$scopeValue'" | Out-Null
  return [pscustomobject]@{ Id = $newId; Value = $scopeValue }
}

function Ensure-AppRolesByValue([string]$appObjectId, [array]$desiredRoles) {
  $app = Get-Application $appObjectId
  $current = @()
  if ($app.appRoles) { $current = @($app.appRoles) }

  $newRoles = @()

  foreach ($r in $desiredRoles) {
    $existing = $current | Where-Object { $_.value -eq $r.Value } | Select-Object -First 1
    if ($existing) {
      Write-Log "Role '$($r.Value)' exists -> reuse" DEBUG
      $newRoles += $existing
    } else {
      Write-Log "Creating role '$($r.Value)'" INFO
      $newRoles += @{
        id = (New-Guid)
        allowedMemberTypes = @($r.MemberType)
        description = $r.Description
        displayName = $r.DisplayName
        isEnabled = $true
        value = $r.Value
      }
    }
  }
  $newRolesJson = $newRoles | ConvertTo-Json -Depth 10
  Write-Log "newRoles=$newRolesJson" TRACE
  # Keep roles not managed by this script? (Optional)
  # For strict control comment out the line below and only use $newRoles.
  $unmanaged = $current | Where-Object { ($desiredRoles.Value -notcontains $_.value) }
  $unmanagedJson = $unmanaged | ConvertTo-Json -Depth 10
  Write-Log "unmanaged=$unmanagedJson" TRACE
  $merged = @($unmanaged + $newRoles)

  if (Json-Equal $current $merged) {
    Write-Log "App roles already match desired state -> skip" DEBUG
    return $merged
  }

  Patch-ApplicationIfChanged $appObjectId @{ appRoles = $merged } "Ensure app roles" | Out-Null
  return $merged
}

function Ensure-RequiredResourceAccess{
  param(
    [Parameter(Mandatory)][string]$appObjectId, 
    [Parameter(Mandatory)][string]$resourceAppId, 
    [Parameter(Mandatory)][guid]$permissionId, 
    [Parameter(Mandatory)][ValidateSet("Scope","Role")] [string]$permissionType
  )  
  $app = Get-Application $appObjectId
  $rra = @()
  if ($app.requiredResourceAccess) { $rra = @($app.requiredResourceAccess) }

  $entry = $rra | Where-Object { $_.resourceAppId -eq $resourceAppId } | Select-Object -First 1
  if ($entry) {
    $ra = @()
    if ($entry.resourceAccess) { $ra = @($entry.resourceAccess) }
    $has = $ra | Where-Object { $_.id -eq $permissionId -and $_.type -eq $permissionType } | Select-Object -First 1
    if ($has) {
      Write-Log "requiredResourceAccess already includes Mesh scope -> skip" DEBUG
      return $false
    }
    $entry.resourceAccess = @($ra + @{ id = $permissionId; type = $permissionType })
  } else {
    $rra += @{
      resourceAppId = $resourceAppId
      resourceAccess = @(
        @{ id = $permissionId; type = $permissionType }
      )
    }
  }

  return (Patch-ApplicationIfChanged $appObjectId @{ requiredResourceAccess = $rra } "Ensure requiredResourceAccess ($permissionType)")
}

function Ensure-PreAuthorizedApplication([string]$meshAppObjectId, [string]$clientAppId, [guid]$delegatedPermissionId) {
  $mesh = Get-Application $meshAppObjectId
  $api = $mesh.api
  if (-not $api) { $api = @{ requestedAccessTokenVersion = 2; oauth2PermissionScopes=@(); preAuthorizedApplications=@() } }

  $pre = @()
  if ($api.preAuthorizedApplications) { $pre = @($api.preAuthorizedApplications) }

  $existing = $pre | Where-Object { $_.appId -eq $clientAppId } | Select-Object -First 1
  if ($existing) {
    $ids = @()
    if ($existing.delegatedPermissionIds) { $ids = @($existing.delegatedPermissionIds) }
    if ($ids -contains $delegatedPermissionId) {
      Write-Log "Mesh preAuthorizedApplications already contains client=$clientAppId -> skip" DEBUG
      return $false
    }
    $existing.delegatedPermissionIds = (@($ids + $delegatedPermissionId) | Select-Object -Unique)
  } else {
    $pre += @{
      appId = $clientAppId
      delegatedPermissionIds = @($delegatedPermissionId)
    }
  }

  $api.preAuthorizedApplications = $pre
  return (Patch-ApplicationIfChanged $meshAppObjectId @{ api = $api } "Ensure Mesh preAuthorizedApplications")
}

function Ensure-ClientSecret {
  param(
    [Parameter(Mandatory)][string]$appObjectId,
    [Parameter(Mandatory)][string]$secretDisplayName,
    [string]$KeyVaultName = $Global:KeyVaultName,
    [string]$KeyVaultSecretName = "",
    [switch]$StoreInKeyVault = $Global:StoreSecretsInKeyVault,
    [switch]$ReturnSecretText = $Global:EmitSecretsToConsole # default: OFF (secure)
  )

  $app = Get-Application $appObjectId
  $creds = @()
  if ($app.passwordCredentials) { $creds = @($app.passwordCredentials) }

  $existing = $creds | Where-Object { $_.displayName -eq $secretDisplayName } | Select-Object -First 1
  if ($existing) {
    Write-Log "Client secret credential '$secretDisplayName' already exists (Graph can't return value) -> skip creation" WARN
    return [pscustomobject]@{
      Created        = $false
      DisplayName    = $secretDisplayName
      SecretText     = $null
      KeyVaultId     = $null
    }
  }

  Write-Log "Creating client secret '$secretDisplayName' (value available only now)" INFO
  $pwd = Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/applications/$appObjectId/addPassword" -Body (@{
    passwordCredential = @{ displayName = $secretDisplayName }
  } | ConvertTo-Json -Depth 10)

  $secretText = $pwd.secretText  # DO NOT log this!

  # Optional: store to Key Vault
  $kvId = $null
  if ($StoreInKeyVault) {
    if ([string]::IsNullOrWhiteSpace($KeyVaultSecretName)) {
      $KeyVaultSecretName = $secretDisplayName
    }
    $kvId = Store-SecretInKeyVault -VaultName $KeyVaultName -SecretName $KeyVaultSecretName -SecretText $secretText
  }

  # Return secretText only if explicitly requested
  return [pscustomobject]@{
    Created        = $true
    DisplayName    = $secretDisplayName
    SecretText     = $(if ($ReturnSecretText) { $secretText } else { $null })
    KeyVaultId     = $kvId
  }
}

function Ensure-AzKeyVaultModule {
  if (-not (Get-Module Az.KeyVault -ListAvailable)) {
    Write-Log "Az.KeyVault module not found. Skipping Key Vault secret storage." WARN
    return $false
  }
  Import-Module Az.KeyVault -ErrorAction SilentlyContinue | Out-Null
  return $true
}

function Store-SecretInKeyVault {
  param(
    [Parameter(Mandatory)][string]$VaultName,
    [Parameter(Mandatory)][string]$SecretName,
    [Parameter(Mandatory)][string]$SecretText
  )

  if ([string]::IsNullOrWhiteSpace($VaultName)) {
    Write-Log "KeyVaultName not set -> not storing secret in Key Vault." DEBUG
    return $null
  }

  if (-not (Ensure-AzKeyVaultModule)) { return $null }

  try {
    # Never log SecretText
    $secure = ConvertTo-SecureString $SecretText -AsPlainText -Force
    $kv = Set-AzKeyVaultSecret -VaultName $VaultName -Name $SecretName -SecretValue $secure
    Write-Log "Stored secret in Key Vault. Vault=$VaultName Name=$SecretName" INFO
    return $kv.Id
  } catch {
    Write-Log "Failed to store secret in Key Vault (Vault=$VaultName Name=$SecretName): $($_.Exception.Message)" WARN
    return $null
  }
}

# ----------------------------
# 4) CREATE / CONFIGURE MESH APP (IDEMPOTENT)
# ----------------------------
# ----------------------------

$results = @()

$step = Start-Step "Create/Update Mesh app registration (idempotent)"
try {
  $meshApp = Ensure-Application $MeshAppDisplayName
  $meshSp  = Ensure-ServicePrincipalForApp -appId $meshApp.AppId -displayName $MeshAppDisplayName

  # Ensure identifierUri
  Patch-ApplicationIfChanged $meshApp.Id @{ identifierUris = @("api://$($meshApp.AppId)") } "Ensure Mesh identifierUris" | Out-Null

  # Ensure Mesh scope by value
  $meshScope = Ensure-ApiScopeByValue -appObjectId $meshApp.Id -scopeValue $MeshScopeValue -displayNameForConsent "Mesh API"
  $meshScopeIdEffective = [guid]$meshScope.Id
  $meshScopeValueEffective = $meshScope.Value

  # Ensure Mesh app roles by value
  $meshRolesEffective = Ensure-AppRolesByValue -appObjectId $meshApp.Id -desiredRoles $MeshRolesDesired
  $meshRolesEffectiveJson = $meshRolesEffective | ConvertTo-Json -Depth 10
  Write-Log "meshRolesEffective=$meshRolesEffectiveJson" TRACE
  $meshDaemonRole = $meshRolesEffective | Where-Object { $_.DisplayName -eq "Daemon" } | Select-Object -First 1
  $meshDaemonRoleId = [guid]$meshDaemonRole.Id
  Write-Log "meshDaemonRole.id=$meshDaemonRoleId" DEBUG

  Write-Log "Mesh ready | AppId=$($meshApp.AppId) | Scope=api://$($meshApp.AppId)/$meshScopeValueEffective" INFO

  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "Mesh app provisioning failed" $_
}

# Ensure Mesh role groups + assignments (idempotent)
$step = Start-Step "Create groups for Mesh roles + assign to Mesh enterprise app (idempotent)"
try {
  $meshSp = Ensure-ServicePrincipalForApp $meshApp.AppId $MeshAppDisplayName
  $meshSpRef = Get-MgServicePrincipal -ServicePrincipalId $meshSp.Id

  foreach ($r in $MeshRolesDesired) {
    $g = Ensure-Group $r.Value
    $role = $meshSpRef.AppRoles | Where-Object { $_.Value -eq $r.Value } | Select-Object -First 1
    if ($role) {
      Ensure-GroupAppRoleAssignment -groupId $g.Id -resourceSpId $meshSp.Id -appRoleId ([guid]$role.Id) -RoleValue $r.Value
    } else {
      Write-Log "Mesh role '$($r.Value)' not found on SP (unexpected)" WARN
    }
  }

  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "Mesh role group assignment failed" $_
}

# ----------------------------
# 5) CREATE / CONFIGURE SMART POWER APPS (IDEMPOTENT)

foreach ($appDef in $SmartApps) {

  $step = Start-Step "Provision Smart app: $($appDef.DisplayName) (idempotent)"
  try {
    $app = Ensure-Application $appDef.DisplayName
    $sp  = Ensure-ServicePrincipalForApp -appId $app.AppId -displayName $appDef.DisplayName

    if ($appDef.AppType -eq "Application") {
      # Ensure identifierUri
      Patch-ApplicationIfChanged $app.Id @{ identifierUris = @("api://$($app.AppId)") } "Ensure identifierUris for $($appDef.DisplayName)" | Out-Null

      # Ensure redirect uri
      $port = $AppPorts[$appDef.Key]
      if ($port) {
        $redirect = "https://$Fqdn`:$port/callback"
        Ensure-RedirectUri -appObjectId $app.Id -redirect $redirect | Out-Null
      }

      # Ensure app scope by value
      $scope = Ensure-ApiScopeByValue -appObjectId $app.Id -scopeValue $appDef.ScopeValue -displayNameForConsent $appDef.DisplayName
      $appScopeId = [guid]$scope.Id
      # Ensure OptimalGateway scope by value
      if ($appDef.Key -eq "OptimalGateway") {
        $optGwScopeIdEffective = [guid]$scope.Id
        $optGwApp = $app
        $OptGwAppDisplayName = "${NamePrefix}${appDef.Name}${EnvSuffix}"
        Write-Log "optGwScopeIdEffective=$optGwScopeIdEffective, optGwAppId=$optGwAppId" DEBUG
      }

      # Ensure app roles by value (merge with any unmanaged roles)
      $rolesEffective = Ensure-AppRolesByValue -appObjectId $app.Id -desiredRoles $appDef.Roles
      if ($appDef.Key -eq "OptimalGateway") {
        # Ensure OptimalGateway app roles by value
        $optGwRolesEffective = $rolesEffective
        $optGwRolesEffectiveJson = $optGwRolesEffective | ConvertTo-Json -Depth 10
        Write-Log "optGwRolesEffective=$optGwRolesEffectiveJson" TRACE
        $optGwDaemonRole = $optGwRolesEffective | Where-Object { $_.DisplayName -eq "Daemon" } | Select-Object -First 1
        $optGwDaemonRoleId = [guid]$optGwDaemonRole.Id
        Write-Log "optGwDaemonRoleId=$optGwDaemonRoleId" DEBUG
      }
    }

    # Ensure groups exist + assignments exist (idempotent)
    $rolesStep = Start-Step "Groups + appRole assignments for $($appDef.DisplayName)"
    $spRef = Ensure-ServicePrincipalForApp $app.AppId $appDef.DisplayName
    $spRefFull = Get-MgServicePrincipal -ServicePrincipalId $spRef.Id

    foreach ($r in $appDef.Groups) {
      $g = Ensure-Group $r.DisplayName
      $role = $spRefFull.AppRoles | Where-Object { $_.Value -eq $r.RoleAssigned } | Select-Object -First 1
      if ($role) {
        Ensure-GroupAppRoleAssignment -groupId $g.Id -resourceSpId $spRefFull.Id -appRoleId ([guid]$role.Id) -RoleValue $r.DisplayName
      } else {
        Write-Log "Role '$($r.Value)' not found on SP for '$($appDef.DisplayName)'" WARN
      }
    }
    End-Step $rolesStep $true

    # Ensure delegated permission to Mesh (requiredResourceAccess) - idempotent merge
    $permStep = Start-Step "Ensure Mesh delegated permission on $($appDef.DisplayName)"
    foreach ($p in $appDef.MeshPermissions) {
      $permissionId = if ($p.PermissionType -eq "Scope") { $meshScopeIdEffective } else { $meshDaemonRoleId }
      Ensure-RequiredResourceAccess -appObjectId $app.Id -resourceAppId $meshApp.AppId -permissionId $permissionId -permissionType $p.PermissionType | Out-Null
    }
    End-Step $permStep $true

    if (-not ([string]::IsNullOrWhiteSpace($appDef.OptimalGatewayPermissions))) {
      # Ensure delegated permission to Optimal.Gateway (requiredResourceAccess) - idempotent merge
      $gwPermStep = Start-Step "Ensure Optimal.Gateway delegated permission on $($appDef.DisplayName)"
      foreach ($p in $appDef.OptimalGatewayPermissions) {
        $permissionId = if ($p.PermissionType -eq "Scope") { $optGwScopeIdEffective } else { $optGwDaemonRoleId }
        Write-Log "permissionId=$permissionId, "
        Ensure-RequiredResourceAccess -appObjectId $app.Id -resourceAppId $optGwApp.AppId -permissionId $permissionId -permissionType $p.PermissionType | Out-Null
      }
      End-Step $gwPermStep $true
    }

    if ($appRef.AppType -eq "Application") {
      # Ensure admin consent grant (may be blocked by policy)
      $consentStep = Start-Step "Ensure admin consent (oauth2PermissionGrant) for Mesh on $($appDef.DisplayName)"
      try {
        $clientSp   = Ensure-ServicePrincipalForApp $app.AppId $appDef.DisplayName
        $resourceSp = Ensure-ServicePrincipalForApp $meshApp.AppId $MeshAppDisplayName
        Ensure-OAuth2PermissionGrant -clientSpId $clientSp.Id -resourceSpId $resourceSp.Id -scopeValue $meshScopeValueEffective
        End-Step $consentStep $true
      } catch {
        End-Step $consentStep $false "May require privileged role/policy. Continuing."
        Write-Log "Admin consent step failed or blocked by policy for $($appDef.DisplayName)." WARN
      }
      if (-not ([string]::IsNullOrWhiteSpace($appDef.OptimalGatewayPermissions))) {
        $optGwConsentStep = Start-Step "Ensure admin consent (oauth2PermissionGrant) for OptimalGateway on $($appDef.DisplayName)"
        try {
          $clientSp   = Ensure-ServicePrincipalForApp $app.AppId $appDef.DisplayName
          $resourceSp = Ensure-ServicePrincipalForApp $optGwApp.AppId $OptGwAppDisplayName
          Ensure-OAuth2PermissionGrant -clientSpId $clientSp.Id -resourceSpId $resourceSp.Id -scopeValue $optGwScopeValueEffective
          End-Step $optGwConsentStep $true
        } catch {
          End-Step $optGwConsentStep $false "May require privileged role/policy. Continuing."
          Write-Log "Admin consent step failed or blocked by policy for $($appDef.DisplayName)." WARN
        }
      }
    } else {
      # Grant the role on the resource service principal (this is the important part)
      $consentStep = Start-Step "Grant the role for Mesh on $($appDef.DisplayName)"
      try {
        Ensure-ServicePrincipalAppRoleAssignment -principalSpId $mdtSp.Id -resourceSpId $meshSp.Id -appRoleId $meshDaemonRoleId -RoleValue "Daemon"
        End-Step $consentStep $true
      } catch {
        End-Step $consentStep $false
        Write-Log "Grant role step failed or blocked by policy for $($appDef.DisplayName)." WARN
      }
      if (-not ([string]::IsNullOrWhiteSpace($appDef.OptimalGatewayPermissions))) {
        $optGwConsentStep = Start-Step "Grant the role for OptimalGateway on $($appDef.DisplayName)"
        try {
          $clientSp   = Ensure-ServicePrincipalForApp $app.AppId $appDef.DisplayName
          $resourceSp = Ensure-ServicePrincipalForApp $optGwApp.AppId $OptGwAppDisplayName
          Ensure-OAuth2PermissionGrant -clientSpId $clientSp.Id -resourceSpId $resourceSp.Id -appRoleId $optGwDaemonRoleId -RoleValue "Daemon"
          End-Step $optGwConsentStep $true
        } catch {
          End-Step $optGwConsentStep $false "May require privileged role/policy. Continuing."
          Write-Log "Admin consent step failed or blocked by policy for $($appDef.DisplayName)." WARN
        }
      }
    }

    # Ensure client secret (idempotent check by displayName) 
    $secretStep = Start-Step "Ensure client secret for $($appDef.DisplayName)"
    $secretName = "$($appDef.DisplayName)-secret"
    $kvSecretName = "$($Global:KeyVaultSecretPrefix)-$($appDef.Key)-client-secret"
    ##$storeInKeyVault = if ($Global:StoreSecretsInKeyVault -and -not [string]::IsNullOrWhiteSpace($Global:KeyVaultName)) { $true } else { $false }
    Write-Log "Calling Ensure-ClientSecret appObjectId=$app.Id, secretDisplayName=$secretName, KeyVaultName=$Global:KeyVaultName, KeyVaultSecretName=$kvSecretName"
    $secretResult = Ensure-ClientSecret -appObjectId $app.Id -secretDisplayName $secretName -KeyVaultName $Global:KeyVaultName -KeyVaultSecretName $kvSecretName #-StoreInKeyVault $storeInKeyVault -ReturnSecretText $false
    if ($secretResult.Created) {
      $detail = if ($secretResult.KeyVaultId) { "Secret stored in Key Vault" } else { "Secret created (NOT printed); store it securely now" }
      End-Step $secretStep $true $detail
    } else {
      End-Step $secretStep $true "Secret exists or skipped (cannot retrieve value)"
    }

    # Collect outputs - DO NOT include secretText
    $results += [pscustomobject]@{
      App          = $appDef.DisplayName
      TenantId     = $tenantId
      ClientId     = $app.AppId
      RedirectUri  = $redirect
      ExposedScope = if ($appDef.ScopeValue) { "api://$($app.AppId)/$($appDef.ScopeValue)" } else { "" }
      SecretName   = $secretName
      KeyVaultId   = if ($Global:StoreSecretsInKeyVault) { $secretResult.KeyVaultId } else { $secretResult.SecretText }
      MeshScope    = "api://$($meshApp.AppId)/$meshScopeValueEffective"
    }
    End-Step $step $true
  } catch {
    End-Step $step $false
    Fail-Fast "Provisioning failed for app '$($appDef.DisplayName)'" $_
  }
}

# ----------------------------
# 6) PRE-AUTHORIZE SMART APPS IN MESH (IDEMPOTENT MERGE)
# ----------------------------

$step = Start-Step "Ensure Mesh preAuthorizedApplications (idempotent)"
try {
  foreach ($appDef in $SmartApps) {
    $a = Get-ApplicationByDisplayName $appDef.DisplayName
    if ($a) {
      Ensure-PreAuthorizedApplication -meshAppObjectId $meshApp.Id -clientAppId $a.AppId -delegatedPermissionId $meshScopeIdEffective | Out-Null
    } else {
      Write-Log "Could not resolve app for pre-authorization: $($appDef.DisplayName)" WARN
    }
  }
  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "Pre-authorization in Mesh failed" $_
}

# ----------------------------
# 7) OUTPUT SUMMARY (save secrets now!)
# ----------------------------

Write-Progress -Activity "Smart Power Provisioning" -Status "Completed" -Completed

$duration = (Get-Date) - $Global:ScriptStart
Write-Log ("Provisioning completed in {0:n2}s" -f $duration.TotalSeconds) INFO
Write-Log "Log file: $($Global:LogFile)" INFO

Write-Host "=== Provisioning output - copy NEW secrets now - existing secrets cannot be retrieved ===" -ForegroundColor Cyan
$results | Format-Table App,TenantId,ClientId -AutoSize -Wrap | Out-String
$results | Format-Table App,RedirectUri,ExposedScope -AutoSize -Wrap | Out-String
$results | Format-Table App,SecretName,KeyVaultId,MeshScope -AutoSize -Wrap | Out-String

Write-Host "Mesh app:" -ForegroundColor Cyan
Write-Host "  DisplayName: $MeshAppDisplayName"
Write-Host "  ClientId:    $($meshApp.AppId)"
Write-Host "  MeshScope:   api://$($meshApp.AppId)/$meshScopeValueEffective"

Write-Host "NOTE: Client secrets are never printed to avoid leaking into console/logs/CI output." -ForegroundColor Yellow
Write-Host "      If KeyVaultId is empty, configure Key Vault settings and store secrets immediately after creation." -ForegroundColor Yellow
