<#
Smart Power provisioning (Volue Identity) + Rich Logging + Idempotency

Aligned with internal Smart Power docs:
- /callback redirect for frontend apps
- client secret per app
- API resource + scope per app that exposes an API
- client allowed scopes cover all dependencies (Mesh, OptimalGateway, OptimalLog)
- daemon clients use client_credentials grant

Idempotent behavior:
- Re-run safe: only patches when needed, no duplicate scopes/redirects/secrets

Requires:
- VolueIdentity.Idempotent.psm1 in the same directory
- A VI admin client (client_credentials) with scope to manage clients, resources, scopes, roles
#>

# ----------------------------
# 0) LOGGING CONFIG
# ----------------------------
$Global:RunId          = [guid]::NewGuid()
$Global:LogLevel       = "DEBUG"     # TRACE, DEBUG, INFO, WARN, ERROR
$Global:WriteToFile    = $true
$Global:LogFile        = Join-Path (Get-Location) ("smartpower-vi-provisioning_{0}.log" -f $Global:RunId)
$Global:ScriptStart    = Get-Date
$Global:StepIndex      = 0
$Global:StepsTotalHint = 30

$Global:EmitSecretsToConsole = $true

# ----------------------------
# 1) CONFIG (edit these)
# ----------------------------

$NamePrefix = "energy-"
$EnvSuffix  = "-auto"
$Fqdn       = "localhost"

# Volue Identity Admin API connection
# Adjust these to match your VI deployment:
$ViAdminBaseUrl      = "https://api.identity.volue.com"
$ViTokenEndpoint     = "https://auth.identity.volue.com/connect/token"               # e.g. https://.../connect/token
$ViAdminClientId     = "259d9f97-b3ba-4c61-8612-0738e820d273_TOSA-admin-client"
$ViAdminClientSecret = "4354d1c9-8141-43db-8569-7c6b27888f85"          # keep secure - never log
$ViAdminScope        = "vi.admin.api:users"                          # scope for VI admin API access
$ViTenantId          = "259d9f97-b3ba-4c61-8612-0738e820d273"

# Base path for all tenant-scoped VI Admin API endpoints
$ViTenantBasePath = "/api/tenants/$ViTenantId"

# VI Admin API endpoint mapping (verified against https://api.identity.volue.com/swagger/v1/swagger.json).
# VI distinguishes between Applications (for roles/permissions) and OIDC Clients (for OAuth2 auth).
# Roles are application-scoped; API resource scopes are embedded in the resource body, not sub-resources.
# __ID__ and __ROLE__ are substitution tokens; resolved by Invoke-ViEndpointRequest below.
$ViEndpoints = @{
  # OIDC Clients  (/configuration/clients)
  GetClientByName    = @{ Method = "GET";    Path = "$ViTenantBasePath/configuration/clients"                    }
  CreateClient       = @{ Method = "POST";   Path = "$ViTenantBasePath/configuration/clients"                    }
  PatchClient        = @{ Method = "PATCH";  Path = "$ViTenantBasePath/configuration/clients/__ID__"             }
  GetClientById      = @{ Method = "GET";    Path = "$ViTenantBasePath/configuration/clients/__ID__"             }

  # Applications  (/configuration/applications) - separate from OIDC clients; holds roles & permissions
  GetApplications    = @{ Method = "GET";    Path = "$ViTenantBasePath/configuration/applications"               }
  CreateApplication  = @{ Method = "POST";   Path = "$ViTenantBasePath/configuration/applications"               }
  PatchApplication   = @{ Method = "PATCH";  Path = "$ViTenantBasePath/configuration/applications/__ID__"        }

  # Application Roles  (__ID__ = applicationId)
  GetAppRoles        = @{ Method = "GET";    Path = "$ViTenantBasePath/applications/__ID__/roles"                }
  CreateAppRole      = @{ Method = "POST";   Path = "$ViTenantBasePath/applications/__ID__/roles"                }
  PatchAppRole       = @{ Method = "PATCH";  Path = "$ViTenantBasePath/applications/__ID__/roles/__ROLE__"       }
  DeleteAppRole      = @{ Method = "DELETE"; Path = "$ViTenantBasePath/applications/__ID__/roles/__ROLE__"       }

  # API Resources  (module Ensure-ViApiResource uses: GetApiByName, CreateApi, PatchApi)
  # Note: scopes are embedded in the API resource body, not exposed as sub-resources.
  GetApiByName       = @{ Method = "GET";    Path = "$ViTenantBasePath/configuration/api-resources"             }
  CreateApi          = @{ Method = "POST";   Path = "$ViTenantBasePath/configuration/api-resources"             }
  PatchApi           = @{ Method = "PATCH";  Path = "$ViTenantBasePath/configuration/api-resources/__ID__"      }
}

# Mesh API resource name and scope
$MeshApiResourceName = "${NamePrefix}mesh${EnvSuffix}"
$MeshScopeValue      = "Mesh.Grpc"

# Smart Power app definitions (mirrors the Entra ID script config)
# Type definitions:
#   AppType       - Application (OIDC auth code) or Daemon (client_credentials)
#   PermissionType - Scope or Role (consumed from the target API resource)
$SmartApps = @(
  @{
    Key        = "OptimalLog"
    ClientId   = ("${NamePrefix}optimal-log${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "OptimalLogAdmin";  Description = "Full access including delete and config"   },
      @{ Name = "OptimalLogEditor"; Description = "Read + create/update (no delete)"          },
      @{ Name = "OptimalLogViewer"; Description = "Read only access (GET endpoints only)"     }
    )
    ScopeValue = "Optimal.Log"
    # OptimalLog itself has no upstream dependencies in this config
  },
  @{
    Key        = "OptimalGateway"
    ClientId   = ("${NamePrefix}optimal-gateway${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code", "client_credentials")
    RequirePkce = $true
    Roles = @(
      @{ Name = "OptimalGwAdmin";          Description = "Full access including delete and config"              },
      @{ Name = "OptimalGwEditor";         Description = "Read + create/update (no delete)"                     },
      @{ Name = "OptimalGwViewer";         Description = "Read only access (GET endpoints only)"                },
      @{ Name = "OptimalGwServiceAccount"; Description = "Machine/daemon clients for background jobs/interface" }
    )
    ScopeValue = "Optimal.Gateway"
    MeshPermissions = @(
      @{ PermissionType = "Scope" },
      @{ PermissionType = "Role"  }
    )
    OptimalLogPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "AssetManager"
    ClientId   = ("${NamePrefix}asset-manager${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "AssetManagerRead";   Description = "Asset Manager read access"       },
      @{ Name = "AssetManagerWrite";  Description = "Asset Manager modify access"     },
      @{ Name = "AssetManagerDelete"; Description = "Asset Manager add/delete access" }
    )
    ScopeValue     = "AssetManager"
    Authentication = @(
      @{ Type = "Single-page"; Address = "https://$Fqdn`:1234/callback" }
    )
    MeshPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "AvailabilityPlanner"
    ClientId   = ("${NamePrefix}availability-planner${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "AvailabilityRead";  Description = "Availability Planner read access"   },
      @{ Name = "AvailabilityWrite"; Description = "Availability Planner modify access" },
      @{ Name = "AvailabilityAdmin"; Description = "Availability Planner admin access"  }
    )
    ScopeValue     = "AvailabilityPlanner"
    Authentication = @(
      @{ Type = "Single-page"; Address = "https://$Fqdn`:1235/callback" }
    )
    MeshPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "MeshConfigurator"
    ClientId   = ("${NamePrefix}mesh-configurator${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "MeshConfiguratorRead";  Description = "Mesh Configurator read access"   },
      @{ Name = "MeshConfiguratorWrite"; Description = "Mesh Configurator modify access" }
    )
    ScopeValue     = "MeshConfigurator"
    Authentication = @(
      @{ Type = "Single-page"; Address = "https://$Fqdn`:1236/callback" }
    )
    MeshPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "Nimbus"
    ClientId   = ("${NamePrefix}nimbus${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "NimbusRead";  Description = "Nimbus read access"   },
      @{ Name = "NimbusWrite"; Description = "Nimbus modify access" }
    )
    ScopeValue     = "Nimbus"
    Authentication = @(
      @{ Type = "Desktop"; Address = "http://localhost" }
    )
    MeshPermissions = @(
      @{ PermissionType = "Scope" }
    )
    OptimalGatewayPermissions = @(
      @{ PermissionType = "Scope" }
    )
    OptimalLogPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "MarginalCost"
    ClientId   = ("${NamePrefix}marginal-cost${EnvSuffix}")
    AppType    = "Application"
    GrantTypes = @("authorization_code")
    RequirePkce = $true
    Roles = @(
      @{ Name = "MarginalCostRead";  Description = "Marginal Cost read access"   },
      @{ Name = "MarginalCostWrite"; Description = "Marginal Cost modify access" }
    )
    ScopeValue = "MarginalCost"
    MeshPermissions = @(
      @{ PermissionType = "Scope" }
    )
  },
  @{
    Key        = "MeshDataTransfer"
    ClientId   = ("${NamePrefix}mesh-data-transfer${EnvSuffix}")
    AppType    = "Daemon"
    GrantTypes = @("client_credentials")
    RequirePkce = $false
    MeshPermissions = @(
      @{ PermissionType = "Role" }
    )
  }
)

$Global:StepsTotalHint = 8 + ($SmartApps.Count * 6)

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
    [ValidateSet("TRACE","DEBUG","INFO","WARN","ERROR")] [string]$Level = "INFO",
    [switch]$Sensitive,
    [switch]$RevealSensitiveInConsole
  )

  $Lvl  = _LevelRank $Level
  $GLvl = _LevelRank $Global:LogLevel
  if ($Lvl -lt $GLvl) { return }

  $ts                 = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
  $safeMessageFile    = if ($Sensitive) { "***REDACTED***" } else { $Message }
  $safeMessageConsole = if ($Sensitive -and -not $RevealSensitiveInConsole) { "***REDACTED***" } else { $Message }
  $lineFile    = "[{0}][{1}][RunId:{2}] {3}" -f $ts, $Level, $Global:RunId, $safeMessageFile
  $lineConsole = "[{0}][{1}][RunId:{2}] {3}" -f $ts, $Level, $Global:RunId, $safeMessageConsole

  switch ($Level) {
    "ERROR" { Write-Host $lineConsole -ForegroundColor Red    }
    "WARN"  { Write-Host $lineConsole -ForegroundColor Yellow }
    "DEBUG" { Write-Host $lineConsole -ForegroundColor DarkGray }
    "TRACE" { Write-Host $lineConsole -ForegroundColor Blue   }
    default { Write-Host $lineConsole }
  }

  if ($Global:WriteToFile) { Add-Content -Path $Global:LogFile -Value $lineFile }
}

function Start-Step {
  param(
    [Parameter(Mandatory)] [string]$Name,
    [int]$PercentComplete = -1
  )
  $Global:StepIndex++
  $pct = if ($PercentComplete -ge 0) { $PercentComplete } else {
    [math]::Min(100, [math]::Round(($Global:StepIndex / [double]$Global:StepsTotalHint) * 100))
  }
  Write-Progress -Activity "Smart Power VI Provisioning" -Status $Name -PercentComplete $pct
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
  $suffix  = if ($Details) { " | $Details" } else { "" }
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
  Write-Progress -Activity "Smart Power VI Provisioning" -Status "Failed" -Completed
  throw $ErrorRecord
}

# ----------------------------
# 3) IMPORT MODULE + AUTHENTICATE + CONNECT
# ----------------------------

Write-Log "VI Provisioning started. LogFile=$($Global:LogFile), LogLevel=$($Global:LogLevel)" INFO
Write-Log "RunId=$($Global:RunId)" INFO
Write-Log "Config: MeshApi=$MeshApiResourceName, Apps=$($SmartApps.ClientId -join ', ')" DEBUG

$step = Start-Step "Import VolueIdentity module + authenticate to VI Admin API"
try {
  $modulePath = Join-Path $PSScriptRoot "VolueIdentity.Idempotent.psm1"
  if (-not (Test-Path $modulePath)) {
    throw "Module not found at '$modulePath'. Ensure VolueIdentity.Idempotent.psm1 is in the same directory."
  }
  Import-Module $modulePath -Force
  Write-Log "Module imported from $modulePath" DEBUG

  Write-Log "Authenticating to VI: $ViTokenEndpoint (clientId=$ViAdminClientId scope=$ViAdminScope)" INFO
  $tokenResponse = Invoke-RestMethod -Method POST -Uri $ViTokenEndpoint `
    -ContentType "application/x-www-form-urlencoded" `
    -Body @{
      grant_type    = "client_credentials"
      client_id     = $ViAdminClientId
      client_secret = $ViAdminClientSecret
      scope         = $ViAdminScope
    }
  $viToken = $tokenResponse.access_token
  if ([string]::IsNullOrWhiteSpace($viToken)) { throw "Token response did not contain an access_token." }
  Write-Log "VI authentication successful." INFO

  Set-ViContext -BaseUrl $ViAdminBaseUrl -Token $viToken -Endpoints $ViEndpoints
  Set-ViLogger -Logger {
    param($level, $msg, $sensitive)
    Write-Log -Message $msg -Level $level -Sensitive:$sensitive
  }

  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "VI authentication or module import failed" $_
}

# ----------------------------
# 4) LOCAL HELPERS
# Uses Invoke-ViRequest (exported by module) directly against configured endpoint paths.
# VI distinguishes Applications (roles/permissions entity) from OIDC Clients (OAuth2 auth).
# ----------------------------

function Invoke-ViEndpointRequest {
  param(
    [Parameter(Mandatory)][string]$EndpointKey,
    [hashtable]$Tokens = @{},
    [object]$Body = $null
  )

  $ep = $ViEndpoints[$EndpointKey]
  if (-not $ep) { throw "Endpoint '$EndpointKey' not defined in `$ViEndpoints." }

  $path = $ep.Path
  foreach ($k in $Tokens.Keys) {
    $path = $path -replace ("__{0}__" -f [regex]::Escape($k)), [string]$Tokens[$k]
  }

  $query = $null
  if ($ep.Query) {
    $query = @{}
    foreach ($k in $ep.Query.Keys) {
      $v = [string]$ep.Query[$k]
      foreach ($tk in $Tokens.Keys) { $v = $v -replace ("__{0}__" -f [regex]::Escape($tk)), [string]$Tokens[$tk] }
      $query[$k] = $v
    }
  }

  Invoke-ViRequest -Method $ep.Method -Path $path -Query $query -Body $Body
}

function Ensure-ViFullClient {
  param(
    [Parameter(Mandatory)][string]$ClientId,
    [string[]]$GrantTypes          = @("authorization_code"),
    [bool]$RequirePkce             = $true,
    [bool]$AllowOfflineAccess      = $false,
    [string[]]$RedirectUris        = @(),
    [string[]]$AllowedScopes       = @(),
    [string[]]$AllowedCorsOrigins  = @(),
    [string]$AllowedTenantId      = $null
  )

  $desired = [pscustomobject]@{
    name               = $ClientId
    clientId           = $ClientId
    grantTypes         = @($GrantTypes | Select-Object -Unique)
    requirePkce        = $RequirePkce
    allowOfflineAccess = $AllowOfflineAccess
    redirectUris       = @($RedirectUris       | Where-Object { $_ } | Select-Object -Unique)
    allowedScopes      = @($AllowedScopes      | Where-Object { $_ } | Select-Object -Unique)
    allowedCorsOrigins = @($AllowedCorsOrigins | Where-Object { $_ } | Select-Object -Unique)
    allowedTenantId    = $AllowedTenantId
    protocol           = "oidc"
  }

  # Attempt to find existing client by name
  $existing = $null
  try {
    $res = Invoke-ViEndpointRequest -EndpointKey "GetClientByName" -Tokens @{ NAME = $ClientId }
    if ($res) {
      if ($res.items)                              { $existing = $res.items | Where-Object { $_.name -eq $ClientId -or $_.clientId -eq $ClientId } | Select-Object -First 1 }
      elseif ($res -is [System.Collections.IEnumerable] -and -not ($res -is [string])) {
                                                    $existing = $res | Where-Object { $_.name -eq $ClientId -or $_.clientId -eq $ClientId } | Select-Object -First 1 }
      elseif ($res.name -eq $ClientId -or $res.clientId -eq $ClientId) { $existing = $res }
    }
  } catch {
    Write-Log "Could not query existing client '$ClientId' -> will create. ($($_.Exception.Message))" DEBUG
  }

  if (-not $existing) {
    Write-Log "Creating VI client '$ClientId'" INFO
    $created = Invoke-ViEndpointRequest -EndpointKey "CreateClient" -Body $desired
    Write-Log "Created VI client '$ClientId' Id=$($created.id)" INFO
    return $created
  }

  $existingId = $existing.id
  Write-Log "VI client '$ClientId' exists (Id=$existingId) -> checking for updates" DEBUG

  # Compare key mutable fields; PUT full object if anything changed
  $changed = $false
  foreach ($prop in @("grantTypes","requirePkce","allowOfflineAccess","redirectUris","allowedScopes","allowedCorsOrigins")) {
    $curJson = $existing.$prop | ConvertTo-Json -Depth 10 -Compress
    $desJson = $desired.$prop  | ConvertTo-Json -Depth 10 -Compress
    if ($curJson -ne $desJson) {
      Write-Log "Client '$ClientId' field '$prop' changed -> will update" DEBUG
      $changed = $true
      break
    }
  }

  if (-not $changed) {
    Write-Log "VI client '$ClientId' already matches desired state -> skip" DEBUG
    return $existing
  }

  Write-Log "Updating VI client '$ClientId' (Id=$existingId)" INFO
  $null = Invoke-ViEndpointRequest -EndpointKey "PatchClient" -Tokens @{ ID = $existingId } -Body $desired

  # Re-fetch to return the updated state
  $res2 = Invoke-ViEndpointRequest -EndpointKey "GetClientByName" -Tokens @{ NAME = $ClientId }
  if ($res2.items) { return ($res2.items | Where-Object { $_.name -eq $ClientId -or $_.clientId -eq $ClientId } | Select-Object -First 1) }
  return $res2
}

function Ensure-ViApplication {
  param(
    [Parameter(Mandatory)][string]$Name,
    [string]$Description = $null
  )

  $all = Invoke-ViEndpointRequest -EndpointKey "GetApplications"
  $existing = $null
  if ($all.items)                                                                               { $existing = $all.items | Where-Object { $_.name -eq $Name } | Select-Object -First 1 }
  elseif ($all -is [System.Collections.IEnumerable] -and -not ($all -is [string]))             { $existing = $all       | Where-Object { $_.name -eq $Name } | Select-Object -First 1 }

  if (-not $existing) {
    Write-Log "Creating VI application '$Name'" INFO
    $created = Invoke-ViEndpointRequest -EndpointKey "CreateApplication" -Body ([pscustomobject]@{ name = $Name; description = $Description })
    Write-Log "Created VI application '$Name' Id=$($created.id)" INFO
    return $created
  }

  Write-Log "VI application '$Name' exists (Id=$($existing.id)) -> skip" DEBUG
  return $existing
}

function Ensure-ViApplicationRole {
  param(
    [Parameter(Mandatory)][string]$ApplicationId,
    [Parameter(Mandatory)][string]$RoleName,
    [string]$Description = $null
  )

  $all = Invoke-ViEndpointRequest -EndpointKey "GetAppRoles" -Tokens @{ ID = $ApplicationId }
  $existing = $null
  if ($all.items)                                                                               { $existing = $all.items | Where-Object { $_.name -eq $RoleName } | Select-Object -First 1 }
  elseif ($all -is [System.Collections.IEnumerable] -and -not ($all -is [string]))             { $existing = $all       | Where-Object { $_.name -eq $RoleName } | Select-Object -First 1 }

  if ($existing) {
    Write-Log "VI role '$RoleName' already exists on application $ApplicationId -> skip" DEBUG
    return $existing
  }

  Write-Log "Creating VI role '$RoleName' on application $ApplicationId" INFO
  return Invoke-ViEndpointRequest -EndpointKey "CreateAppRole" -Tokens @{ ID = $ApplicationId } `
    -Body ([pscustomobject]@{ name = $RoleName; description = $Description })
}

# ----------------------------
# 5) CREATE / CONFIGURE MESH API RESOURCE (IDEMPOTENT)
# ----------------------------

$step = Start-Step "Create/update Mesh API resource (idempotent)"
try {
  # In VI, scopes are embedded in the API resource body — there are no separate scope sub-endpoints.
  # Ensure-ViApiResource (module) sends: { name, audience }. Add 'scopes' to the PATCH body if your
  # VI deployment requires it explicitly; otherwise configure the scope in the VI admin portal.
  $meshApi   = Ensure-ViApiResource -Name $MeshApiResourceName -Audience $MeshApiResourceName
  $meshApiId = $meshApi.id
  Write-Log "Mesh API resource ready. Id=$meshApiId Name=$MeshApiResourceName Scope=$MeshScopeValue" INFO

  End-Step $step $true
} catch {
  End-Step $step $false
  Fail-Fast "Mesh API resource provisioning failed" $_
}

# ----------------------------
# 6) CREATE / CONFIGURE SMART POWER APP CLIENTS (IDEMPOTENT)
# ----------------------------

# Build scope value map so apps can look up their dependency scopes by key
$scopeMap = @{}
$scopeMap["Mesh"] = $MeshScopeValue
foreach ($appDef in $SmartApps) {
  if ($appDef.ScopeValue) { $scopeMap[$appDef.Key] = $appDef.ScopeValue }
}

$results = @()

foreach ($appDef in $SmartApps) {

  $step = Start-Step "Provision VI client: $($appDef.ClientId) (idempotent)"
  try {

    # --- Build allowed scopes list for this client ---
    $allowedScopes = [System.Collections.Generic.List[string]]::new()

    if ($appDef.AppType -eq "Application") {
      $allowedScopes.Add("openid")
      $allowedScopes.Add("profile")
    }

    if ($appDef.ScopeValue) { $allowedScopes.Add($appDef.ScopeValue) }

    if ($appDef.MeshPermissions) {
      foreach ($p in $appDef.MeshPermissions) {
        if ($p.PermissionType -eq "Scope") { $allowedScopes.Add($MeshScopeValue) }
      }
    }
    if ($appDef.OptimalGatewayPermissions) {
      foreach ($p in $appDef.OptimalGatewayPermissions) {
        if ($p.PermissionType -eq "Scope" -and $scopeMap["OptimalGateway"]) { $allowedScopes.Add($scopeMap["OptimalGateway"]) }
      }
    }
    if ($appDef.OptimalLogPermissions) {
      foreach ($p in $appDef.OptimalLogPermissions) {
        if ($p.PermissionType -eq "Scope" -and $scopeMap["OptimalLog"]) { $allowedScopes.Add($scopeMap["OptimalLog"]) }
      }
    }

    $allowedScopesArr = @($allowedScopes | Select-Object -Unique)

    # --- Build redirect URIs + CORS origins ---
    $redirectUris = @()
    $corsOrigins  = @()
    if ($appDef.Authentication) {
      foreach ($auth in $appDef.Authentication) {
        $redirectUris += $auth.Address
        if ($auth.Type -eq "Single-page") {
          $uri          = [System.Uri]$auth.Address
          $corsOrigins += "$($uri.Scheme)://$($uri.Authority)"
        }
      }
    }

    # --- Ensure VI Application entity (holds roles; separate from the OIDC client) ---
    $appEntityStep = Start-Step "Ensure VI application entity: $($appDef.ClientId)"
    $viApp   = Ensure-ViApplication -Name $appDef.ClientId -Description $appDef.ClientId
    $viAppId = $viApp.id
    Write-Log "VI application ready. Name=$($appDef.ClientId) Id=$viAppId" INFO
    End-Step $appEntityStep $true

    # --- Ensure app roles on the Application entity (idempotent) ---
    if ($appDef.Roles) {
      $rolesStep = Start-Step "Ensure VI roles for $($appDef.ClientId)"
      foreach ($role in $appDef.Roles) {
        Ensure-ViApplicationRole -ApplicationId $viAppId -RoleName $role.Name -Description $role.Description | Out-Null
      }
      End-Step $rolesStep $true
    }

    # --- Ensure API resource for apps that expose their own scope ---
    if ($appDef.ScopeValue) {
      $apiStep = Start-Step "Ensure VI API resource: $($appDef.ScopeValue)"
      # Scopes are part of the API resource body in VI — no separate scope sub-resources.
      $appApi  = Ensure-ViApiResource -Name $appDef.ClientId -Audience $appDef.ClientId
      Write-Log "API resource ready. Name=$($appDef.ClientId) Scope=$($appDef.ScopeValue) Id=$($appApi.id)" INFO
      End-Step $apiStep $true
    }

    # --- Ensure OIDC Client ---
    $clientStep = Start-Step "Ensure VI OIDC client: $($appDef.ClientId)"
    $viClient   = Ensure-ViFullClient `
      -ClientId           $appDef.ClientId `
      -GrantTypes         $appDef.GrantTypes `
      -RequirePkce        $appDef.RequirePkce `
      -AllowOfflineAccess $false `
      -RedirectUris       $redirectUris `
      -AllowedScopes      $allowedScopesArr `
      -AllowedCorsOrigins $corsOrigins `
      -AllowedTenantId    $ViTenantId
    $viClientId = $viClient.id
    Write-Log "VI OIDC client ready. ClientId=$($appDef.ClientId) Id=$viClientId AllowedScopes=$($allowedScopesArr -join ',')" INFO
    End-Step $clientStep $true

    # --- Ensure client secret (idempotent via state file) ---
    $secretStep   = Start-Step "Ensure VI client secret for $($appDef.ClientId)"
    $secretName   = "$($appDef.ClientId)-secret"
    $secretResult = Ensure-ViClientSecret -ClientId $viClientId -SecretDisplayName $secretName
    $secretDetail = if ($secretResult.Created) { "Secret created - store it securely now" } else { "Secret already exists (value not retrievable)" }
    End-Step $secretStep $true $secretDetail

    $results += [pscustomobject]@{
      App           = $appDef.ClientId
      ViClientId    = $viClientId
      GrantTypes    = ($appDef.GrantTypes -join ", ")
      AllowedScopes = ($allowedScopesArr -join ", ")
      RedirectUris  = ($redirectUris -join ", ")
      ExposedScope  = $appDef.ScopeValue
      SecretName    = $secretName
      SecretCreated = $secretResult.Created
    }

    End-Step $step $true
  } catch {
    End-Step $step $false
    Fail-Fast "Provisioning failed for VI client '$($appDef.ClientId)'" $_
  }
}

# ----------------------------
# 7) OUTPUT SUMMARY
# ----------------------------

Write-Progress -Activity "Smart Power VI Provisioning" -Status "Completed" -Completed

$duration = (Get-Date) - $Global:ScriptStart
Write-Log ("Provisioning completed in {0:n2}s" -f $duration.TotalSeconds) INFO
Write-Log "Log file: $($Global:LogFile)" INFO

Write-Host "=== Provisioning output - copy NEW secrets now - existing secrets cannot be retrieved ===" -ForegroundColor Cyan
$results | Format-Table App,ViClientId,ExposedScope -AutoSize -Wrap
$results | Format-Table App,GrantTypes,AllowedScopes -AutoSize -Wrap
$results | Format-Table App,RedirectUris -AutoSize -Wrap
$results | Format-Table App,SecretName,SecretCreated -AutoSize -Wrap

Write-Host "Mesh API Resource:" -ForegroundColor Cyan
Write-Host "  Name:  $MeshApiResourceName"
Write-Host "  Scope: $MeshScopeValue"

Write-Host "NOTE: Client secret values are tracked only in .vi-provisioning-state.json (current directory)." -ForegroundColor Yellow
Write-Host "      Actual secret text is never printed. If lost, use -ForceRotate with Ensure-ViClientSecret." -ForegroundColor Yellow
