# validate-entraid-environment.ps1

Idempotent provisioning script for Entra ID (Azure AD) app registrations used by the Smart Power suite. Uses Microsoft Graph REST API. Safe to re-run — it only patches what has changed.

## Prerequisites

- PowerShell 7+ (or Windows PowerShell 5.1)
- `Microsoft.Graph` module (installed automatically if missing)
- `Az.KeyVault` module (optional — only required if Key Vault secret storage is enabled)
- Graph permissions: `Application.ReadWrite.All` (delegated, via interactive login)
- The user running the script must have the Entra ID role **Application Administrator** or **Global Administrator**

## What the script does

The script provisions a fixed set of Entra ID app registrations for the Smart Power suite. It runs sequentially through these sections:

### Section 0 — Logging config

Initialises a run-scoped GUID, log level, and optional log file. Every Graph operation is logged with timestamp, level, and run ID.

### Section 1 — Config

Dot-sources `entraid-config.ps1` from the same directory. All environment-specific settings (`$SmartApps`, `$MeshRolesDesired`, `$OwnerEmails`, naming prefixes, etc.) live there. **`entraid-config.ps1` is the only file that normally needs editing.** It is also shared with `report-entraid-settings.ps1`.

### Section 2 — Logging helpers

Defines `Write-Log`, `Start-Step`, `End-Step`, and `Fail-Fast`. Provides colour-coded console output and structured file logging. `Fail-Fast` rethrows on unrecoverable errors.

### Section 3 — Connect to Graph

Installs `Microsoft.Graph` if absent and calls `Connect-MgGraph` with scope `Application.ReadWrite.All`. Captures `TenantId` from the session context.

### Section 4 — Idempotent helper functions

Defines all reusable Graph operations:

| Function | Purpose |
| --- | --- |
| `Get-ApplicationByDisplayName` | Look up an app registration by display name (returns `$null` if not found) |
| `Get-ServicePrincipalByDisplayName` | Look up a service principal by display name (returns `$null` if not found) |
| `Ensure-Application` | Create or look up app registration by display name |
| `Ensure-ServicePrincipalForApp` | Create or look up enterprise app (SP); sets the `WindowsAzureActiveDirectoryIntegratedApp` tag so the SP appears under "Enterprise Applications" in the Azure portal |
| `Patch-ApplicationIfChanged` | PATCH app registration only when JSON diff shows a change |
| `Ensure-ApiScopeByValue` | Create or reuse an `oauth2PermissionScope` (API scope) |
| `Ensure-AppRolesByValue` | Merge desired `appRoles` without removing unmanaged ones |
| `Ensure-RequiredResourceAccess` | Add a delegated (`Scope`) or application (`Role`) permission to the app manifest |
| `Ensure-PreAuthorizedApplication` | Add a client app to `preAuthorizedApplications` on a resource API |
| `Ensure-RedirectUri` | Add a redirect URI (SPA or Desktop/public-client) if not already present |
| `Ensure-OAuth2PermissionGrant` | Grant admin consent for a delegated permission (`AllPrincipals`) |
| `Ensure-GroupAppRoleAssignment` | Assign a security group to an app role on a service principal |
| `Ensure-ServicePrincipalAppRoleAssignment` | Assign an application (daemon SP) to an app role on a service principal |
| `Ensure-Group` | Create or look up a security group by display name (mail-disabled, security-enabled; nickname derived from the display name) |
| `Ensure-ClientSecret` | Create a password credential if one with the given display name does not exist |
| `Store-SecretInKeyVault` | Store a secret value in Azure Key Vault (optional). Backed by `Ensure-AzKeyVaultModule`, which no-ops with a warning if `Az.KeyVault` isn't installed |
| `Ensure-OptionalClaims` | Set `optionalClaims` on an app registration (Mesh: empty; others: `aud` with `use_guid` in `accessToken`) |
| `Ensure-ApiRequestedAccessTokenVersion` | Set `api.requestedAccessTokenVersion` on an app registration (defaults to `null`) |
| `Ensure-Owners` | Idempotently add users from `$OwnerEmails` as owners on both the app registration and the enterprise app |

### Section 5 — Provision the Mesh app

Creates or updates the `energy-mesh-<env>` app registration:

- Sets `identifierUris` to `api://<appId>`
- Creates the `Mesh.Grpc` API scope (or reuses the existing one)
- Sets optional claims (empty for Mesh)
- Sets `api.requestedAccessTokenVersion` to `null`
- Creates all Mesh app roles (`ModelReader`, `ModelWriter`, `TimeSeriesReader`, `TimeSeriesWriter`, `Daemon`)
- Adds Microsoft Graph `User.Read` delegated permission
- Assigns owners from `$OwnerEmails` to the app registration and enterprise app
- Ensures security groups for each Mesh role exist and are assigned to the Mesh enterprise app

### Section 6 — Provision each Smart Power app

Iterates `$SmartApps`. For each app:

1. Creates or looks up the app registration and its service principal
2. **Application apps only:**
   - Sets `identifierUris`
   - Creates any redirect URIs defined in `Authentication` (SPA or Desktop). Addresses may use the `{clientId}` placeholder, which is expanded to the app's Client ID at run time
   - Creates or reuses the app's API scope (`ScopeValue`)
   - Creates or merges app roles (`Roles`)
   - Sets optional claims (`aud` with `use_guid` in `accessToken`)
   - Sets `api.requestedAccessTokenVersion` to `null`
3. Assigns owners from `$OwnerEmails` to the app registration and enterprise app
4. Creates security groups and assigns them to app roles (`Groups`)
5. Adds `requiredResourceAccess` entries for Mesh, OptimalGateway, OptimalLog, Nimbus, and/or AutomationFrameworkApi as configured
6. Adds Microsoft Graph `User.Read` delegated permission
7. Grants admin consent (`oauth2PermissionGrant`, `AllPrincipals`) for each API dependency
8. Creates a client secret if one does not already exist (optionally stores it in Key Vault)
9. Collects results (ClientId, ExposedScope, SecretName, etc.) for the output summary

### Section 7 — Pre-authorize apps in Mesh

Adds every Smart Power app as a pre-authorized client in the Mesh API (`preAuthorizedApplications`). This means users of those apps are not prompted for consent when acquiring a Mesh token.

### Section 8 — Pre-authorize apps in OptimalGateway and OptimalLog

For every app that declares `OptimalGatewayPermissions` or `OptimalLogPermissions`, adds it as a pre-authorized client in the respective API. Skips apps that do not declare the attribute.

### Section 9 — Pre-authorize apps in AutomationFrameworkApi

For every app that declares `AFPermissions`, adds it as a pre-authorized client in the AutomationFrameworkApi API (`$afApp` / `$afScopeIdEffective`, captured when the `AutomationFrameworkApi` entry is processed in Section 6). Skips apps that do not declare the attribute.

### Section 10 — Output summary

Prints a summary table of all provisioned apps with their Client IDs, exposed scopes, secret names, and Key Vault IDs. Secrets are never printed unless `$Global:EmitSecretsToConsole` is explicitly enabled.

---

## Configuration reference

All variables in this section live in **`entraid-config.ps1`**, except the global logging/secret settings which remain in `validate-entraid-environment.ps1`.

### Global settings

```powershell
$Global:LogLevel              = "INFO"      # TRACE | DEBUG | INFO | WARN | ERROR
$Global:WriteToFile           = $true       # Write log to file alongside script
$Global:EmitSecretsToConsole  = $true       # Return secret text from Ensure-ClientSecret
$Global:StoreSecretsInKeyVault = $false     # Store new secrets in Azure Key Vault
$Global:KeyVaultName          = "kv-smartpower-auto"
$Global:KeyVaultSecretPrefix  = "smartpower"
```

The log file itself is not configured by name — it's derived as `smartpower-provisioning_<RunId>.log` in the current working directory, where `<RunId>` is a fresh GUID generated per run (`$Global:RunId`).

### Naming conventions

```powershell
$NamePrefix = "energy-"                # Prepended to every app display name
$EnvSuffix  = "-auto"                  # Appended to every app display name. Set "" for no suffix.
$Fqdn       = "*.voluead.volue.com"    # Used when building redirect URIs
```

An app with `Key="AssetManager"` and `DisplayName=("${NamePrefix}asset-manager${EnvSuffix}")` resolves to `energy-asset-manager-auto`.

### Microsoft Graph constants

These are well-known, tenant-independent IDs defined in section 1:

```powershell
$MicrosoftGraphAppId  = "00000003-0000-0000-c000-000000000000"
$GraphUserReadScopeId = [guid]"e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read delegated
```

Every app registration (Mesh and all SmartApps) receives a `requiredResourceAccess` entry for `User.Read` against Microsoft Graph.

### Owners

```powershell
$OwnerEmails = @(
  "user1@contoso.com",
  "user2@contoso.com"
)
```

Every user in this list is added as an owner of every app registration and its corresponding enterprise application. Users not found in the directory are logged as a warning and skipped. The operation is idempotent — existing owner assignments are not duplicated.

### `$SmartApps` — the main config array

Each element defines one app registration. The attributes control what the script provisions for that app.

#### Required attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `Key` | string | Internal identifier used by the script to capture variables for OptimalGateway (`Key="OptimalGateway"`), OptimalLog (`Key="OptimalLog"`), Nimbus (`Key="Nimbus"`), and AutomationFrameworkApi (`Key="AutomationFrameworkApi"`) |
| `DisplayName` | string | Entra ID display name of the app registration |
| `AppType` | `"Application"` \| `"Daemon"` | Controls which provisioning branch is used (see below) |

#### Optional attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `ScopeValue` | string | Value of the `oauth2PermissionScope` to expose on this app's API (e.g. `"Optimal.Log"`). Required for `Application` apps that other apps call. |
| `Roles` | array of role objects | App roles to create on this app registration. |
| `Groups` | array of group objects | Security groups to create and assign to roles. |
| `Authentication` | array of auth objects | Redirect URIs (SPA or Desktop) to register. Addresses may use the `{clientId}` placeholder. |
| `MeshPermissions` | array of permission objects | Grants this app access to the Mesh API. |
| `OptimalGatewayPermissions` | array of permission objects | Grants this app access to the OptimalGateway API. Also causes the app to be pre-authorized in OptimalGateway. |
| `OptimalLogPermissions` | array of permission objects | Grants this app access to the OptimalLog API. Also causes the app to be pre-authorized in OptimalLog. |
| `NimbusPermissions` | array of permission objects | Grants this app access to the Nimbus API. Currently only declared on the Nimbus app entry itself — see [Known issues](#known-issues). Does not cause pre-authorization. |
| `AFPermissions` | array of permission objects | Grants this app access to the AutomationFrameworkApi API. Also causes the app to be pre-authorized in AutomationFrameworkApi (Section 9). |

---

### `AppType` — Application vs Daemon

#### `AppType = "Application"` (interactive, user-facing)

Provisions the full set:

- `identifierUris`, redirect URIs, API scope, app roles, security group assignments
- `optionalClaims` — `aud` with `use_guid` in `accessToken`; `idToken` and `saml2Token` empty
- `api.requestedAccessTokenVersion = null`
- `requiredResourceAccess` entries for Microsoft Graph `User.Read` and each API permission attribute
- `oauth2PermissionGrant` (delegated, `AllPrincipals`) for admin consent

#### `AppType = "Daemon"` (background service, no user sign-in)

Skips `identifierUris`, redirect URIs, API scope, and user-facing app roles.

- Assigns the `Daemon` app role on resource service principals via `appRoleAssignment` (application permission, not delegated)

Both types receive owner assignments from `$OwnerEmails`.

---

### Role objects (`Roles`)

```powershell
@{ DisplayName="OptimalLogAdmin"; Value="OptimalLogAdmin"; MemberType="User"; Description="..." }
```

| Field | Legal values | Description |
| --- | --- | --- |
| `DisplayName` | string | Human-readable label in Entra ID |
| `Value` | string | Claim value returned in tokens |
| `MemberType` | `"User"` \| `"Application"` | `User` for human sign-in roles; `Application` for daemon/service roles |
| `Description` | string | Shown in admin consent UI |

---

### Group objects (`Groups`)

```powershell
@{ DisplayName="HteWrite";                      ObjectType="Group";            RoleAssigned="OptimalLogEditor" }
@{ DisplayName="automation-framework-services"; ObjectType="ServicePrincipal"; RoleAssigned="ServiceAccount"  }
```

| Field | Legal values | Description |
| --- | --- | --- |
| `DisplayName` | string | Display name of the principal to assign |
| `ObjectType` | `"Group"` \| `"ServicePrincipal"` | `Group` — security group is created if missing, then assigned. `ServicePrincipal` — an existing SP is looked up by display name and assigned; it is never created automatically. A warning is logged and the entry is skipped if the SP is not found. |
| `RoleAssigned` | string | Must match a `Value` in the app's `Roles` array |

---

### Authentication objects (`Authentication`)

```powershell
@{ Type="Single-page"; Address="https://$Fqdn:1234/callback" }
@{ Type="Desktop";     Address="ms-appx-web://Microsoft.AAD.BrokerPlugin/{clientId}" }
```

| Field | Legal values | Description |
| --- | --- | --- |
| `Type` | `"Single-page"` \| `"Desktop"` | `Single-page` → stored in `spa.redirectUris`; `Desktop` → stored in `publicClient.redirectUris` |
| `Address` | URI string | The redirect URI to register. Use `{clientId}` as a placeholder for the app's Client ID — it is expanded at run time. |

Multiple entries are supported, each with its own `Type`.

---

### Permission objects (`MeshPermissions`, `OptimalGatewayPermissions`, `OptimalLogPermissions`, `NimbusPermissions`, `AFPermissions`)

```powershell
@{ PermissionType="Scope" }
```

| Field | Legal values | Description |
| --- | --- | --- |
| `PermissionType` | `"Scope"` \| `"Role"` | `Scope` = delegated permission (API scope); `Role` = application permission (app role) |

Multiple entries can be listed to request both a `Scope` and a `Role` in the same API.

---

### Currently configured apps

Reflects the entries in `$SmartApps` (plus the Mesh app) as of this writing:

| Key | AppType | ScopeValue | Notes |
| --- | --- | --- | --- |
| *(Mesh)* | — | `Mesh.Grpc` | Roles: ModelReader, ModelWriter, TimeSeriesReader, TimeSeriesWriter, Daemon |
| `OptimalLog` | Application | `Optimal.Log` | Roles: OptimalLogAdmin/Editor/Viewer, Daemon |
| `OptimalGateway` | Application | `Optimal.Gateway` | Requires Mesh (`Scope`+`Role`) and OptimalLog (`Scope`) |
| `AssetManager` | Application | `AssetManager` | SPA redirect on `:18051`; requires Mesh `Scope` |
| `AvailabilityPlanner` | Application | `AvailabilityPlanner` | SPA redirect on `:18053`; requires Mesh `Scope` |
| `MeshConfigurator` | Application | `MeshConfigurator` | SPA redirect on `:18055`; requires Mesh `Scope` |
| `Nimbus` | Application | `Nimbus` | Desktop redirects (`localhost`, broker plugin); requires Mesh, OptimalGateway, OptimalLog `Scope`. Also declares `NimbusPermissions`, but that's a no-op today — no other app requests access to Nimbus, and the self-referential grant to itself is explicitly skipped |
| `MarginalCost` | Application | `MarginalCost` | Requires Mesh `Scope` |
| `MeshDataTransfer` | Daemon | — | Requires Mesh `Role` (Daemon) |
| `AutomationFrameworkApi` | Application | `af-api` | Roles: ServiceAccount, Viewer, Modeler, Admin, Operator; requires Mesh `Role`; declares `AFPermissions` (`Scope`) — the `requiredResourceAccess`, admin-consent, and pre-authorization self-entries are all correctly skipped for its own entry |
| `AutomationFrameworkServices` | Application | — | Requires Mesh, OptimalGateway, OptimalLog, and AutomationFrameworkApi (all `Scope`) via `AFPermissions` |

---

## Known issues

None currently known. This section documents quirks in the script/config as they're found — check back here before relying on undocumented behavior or copying a pattern for a new app.

---

## Adding a new app

1. Add an entry to `$SmartApps` in **`entraid-config.ps1`**.
2. Set `Key`, `DisplayName`, and `AppType`.
3. Add `ScopeValue` if the app exposes its own API.
4. Add `Roles` and `Groups` for RBAC.
5. Add `Authentication` if users sign in (SPA or Desktop redirect URIs).
6. Add any of `MeshPermissions`, `OptimalGatewayPermissions`, `OptimalLogPermissions` to wire up API access (see [Known issues](#known-issues) if you're tempted to model this on `NimbusPermissions` or `AFPermissions` — both have bugs today).

Re-run `validate-entraid-environment.ps1`. It will create only what is missing and skip everything that already exists.

## Adding a new API dependency

If a new shared API is introduced (similar to OptimalGateway or OptimalLog):

1. Add a new permissions attribute on the apps that need access (e.g. `NewApiPermissions`).
2. In Section 6, add a block similar to the `AFPermissions` block to call `Ensure-RequiredResourceAccess` and `Ensure-OAuth2PermissionGrant` — double-check every reference uses *your new API's* captured `$xxxApp` / `$xxxScopeIdEffective` variables, not a copy-pasted one (this is a common source of bugs when following the existing blocks as a template).
3. Add pre-authorization either by extending Section 8's filter, or by adding a new dedicated section like Section 9 (`AFPermissions` → AutomationFrameworkApi) if you'd rather keep it separate.
4. Ensure the new API app is defined in `$SmartApps` with `Key` set so its scope ID and app object can be captured in the Section 6 loop.

## Idempotency

Every helper function follows a read → compare → patch-only-if-changed pattern:

- App registrations, service principals, and security groups are created only if not found by display name. Existing service principals missing the `WindowsAzureActiveDirectoryIntegratedApp` tag have it patched in without recreating the SP.
- API scopes and app roles are merged: existing items are reused (IDs are preserved), new items are appended.
- `requiredResourceAccess` and `preAuthorizedApplications` entries are appended only when not already present.
- `oauth2PermissionGrant` scope strings are extended (not replaced) when a grant already exists.
- `optionalClaims` and `requestedAccessTokenVersion` are patched only when the current value differs.
- Client secrets are skipped when a credential with the same display name already exists (Graph does not return existing secret values).
- Owner assignments are checked against the current owner list before each `POST` — no duplicates are created.

Re-running the script against an already-provisioned environment produces only `DEBUG`-level skip messages and no Graph PATCH calls.
