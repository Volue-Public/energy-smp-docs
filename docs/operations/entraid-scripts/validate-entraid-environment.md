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
Defines the Mesh app display name, all Smart Power application definitions (`$SmartApps`), and Mesh roles/groups. **This is the only section that normally needs editing.**

### Section 2 — Logging helpers
Defines `Write-Log`, `Start-Step`, `End-Step`, and `Fail-Fast`. Provides colour-coded console output and structured file logging. `Fail-Fast` rethrows on unrecoverable errors.

### Section 3 — Connect to Graph
Installs `Microsoft.Graph` if absent and calls `Connect-MgGraph` with scope `Application.ReadWrite.All`. Captures `TenantId` from the session context.

### Section 4 — Idempotent helper functions
Defines all reusable Graph operations:

| Function | Purpose |
|---|---|
| `Ensure-Application` | Create or look up app registration by display name |
| `Ensure-ServicePrincipalForApp` | Create or look up enterprise app (SP) for an app registration |
| `Patch-ApplicationIfChanged` | PATCH app registration only when JSON diff shows a change |
| `Ensure-ApiScopeByValue` | Create or reuse an `oauth2PermissionScope` (API scope) |
| `Ensure-AppRolesByValue` | Merge desired `appRoles` without removing unmanaged ones |
| `Ensure-RequiredResourceAccess` | Add a delegated (`Scope`) or application (`Role`) permission to the app manifest |
| `Ensure-PreAuthorizedApplication` | Add a client app to `preAuthorizedApplications` on a resource API |
| `Ensure-RedirectUri` | Add a redirect URI (SPA or Desktop/public-client) if not already present |
| `Ensure-OAuth2PermissionGrant` | Grant admin consent for a delegated permission (`AllPrincipals`) |
| `Ensure-GroupAppRoleAssignment` | Assign a security group to an app role on a service principal |
| `Ensure-ServicePrincipalAppRoleAssignment` | Assign an application (daemon SP) to an app role on a service principal |
| `Ensure-ClientSecret` | Create a password credential if one with the given display name does not exist |
| `Store-SecretInKeyVault` | Store a secret value in Azure Key Vault (optional) |

### Section 5 — Provision the Mesh app
Creates or updates the `energy-mesh-<env>` app registration:
- Sets `identifierUris` to `api://<appId>`
- Creates the `Mesh.Grpc` API scope (or reuses the existing one)
- Creates all Mesh app roles (`ModelReader`, `ModelWriter`, `TimeSeriesReader`, `TimeSeriesWriter`, `Daemon`)
- Ensures security groups for each Mesh role exist and are assigned to the Mesh enterprise app

### Section 6 — Provision each Smart Power app
Iterates `$SmartApps`. For each app:

1. Creates or looks up the app registration and its service principal
2. **Application apps only:**
   - Sets `identifierUris`
   - Creates any redirect URIs defined in `Authentication` (SPA or Desktop)
   - Creates or reuses the app's API scope (`ScopeValue`)
   - Creates or merges app roles (`Roles`)
3. Creates security groups and assigns them to app roles (`Groups`)
4. Adds `requiredResourceAccess` entries for Mesh, OptimalGateway, and/or OptimalLog as configured
5. Grants admin consent (`oauth2PermissionGrant`, `AllPrincipals`) for each API dependency
6. Creates a client secret if one does not already exist (optionally stores it in Key Vault)
7. Collects results (ClientId, ExposedScope, SecretName, etc.) for the output summary

### Section 7 — Pre-authorize apps in Mesh
Adds every Smart Power app as a pre-authorized client in the Mesh API (`preAuthorizedApplications`). This means users of those apps are not prompted for consent when acquiring a Mesh token.

### Section 8 — Pre-authorize apps in OptimalGateway and OptimalLog
For every app that declares `OptimalGatewayPermissions` or `OptimalLogPermissions`, adds it as a pre-authorized client in the respective API. Skips apps that do not declare the attribute.

### Section 9 — Output summary
Prints a summary table of all provisioned apps with their Client IDs, exposed scopes, secret names, and Key Vault IDs. Secrets are never printed unless `$Global:EmitSecretsToConsole` is explicitly enabled.

---

## Configuration reference

### Global settings

```powershell
$Global:LogLevel              = "DEBUG"     # TRACE | DEBUG | INFO | WARN | ERROR
$Global:WriteToFile           = $true       # Write log to file alongside script
$Global:EmitSecretsToConsole  = $true       # Return secret text from Ensure-ClientSecret
$Global:StoreSecretsInKeyVault = $false     # Store new secrets in Azure Key Vault
$Global:KeyVaultName          = "kv-smartpower-auto"
$Global:KeyVaultSecretPrefix  = "smartpower"
```

### Naming conventions

```powershell
$NamePrefix = "energy-"    # Prepended to every app display name
$EnvSuffix  = "-auto"      # Appended to every app display name. Set "" for no suffix.
$Fqdn       = "localhost"  # Used when building redirect URIs
```

An app with `Key="AssetManager"` and `DisplayName=("${NamePrefix}asset-manager${EnvSuffix}")` resolves to `energy-asset-manager-auto`.

### `$SmartApps` — the main config array

Each element defines one app registration. The attributes control what the script provisions for that app.

#### Required attributes

| Attribute | Type | Description |
|---|---|---|
| `Key` | string | Internal identifier used by the script to capture variables for OptimalGateway (`Key="OptimalGateway"`) and OptimalLog (`Key="OptimalLog"`) |
| `DisplayName` | string | Entra ID display name of the app registration |
| `AppType` | `"Application"` \| `"Daemon"` | Controls which provisioning branch is used (see below) |

#### Optional attributes

| Attribute | Type | Description |
|---|---|---|
| `ScopeValue` | string | Value of the `oauth2PermissionScope` to expose on this app's API (e.g. `"Optimal.Log"`). Required for `Application` apps that other apps call. |
| `Roles` | array of role objects | App roles to create on this app registration. |
| `Groups` | array of group objects | Security groups to create and assign to roles. |
| `Authentication` | array of auth objects | Redirect URIs (SPA or Desktop) to register. |
| `MeshPermissions` | array of permission objects | Grants this app access to the Mesh API. |
| `OptimalGatewayPermissions` | array of permission objects | Grants this app access to the OptimalGateway API. Also causes the app to be pre-authorized in OptimalGateway. |
| `OptimalLogPermissions` | array of permission objects | Grants this app access to the OptimalLog API. Also causes the app to be pre-authorized in OptimalLog. |

---

### `AppType` — Application vs Daemon

#### `AppType = "Application"` (interactive, user-facing)
Provisions the full set:
- `identifierUris`, redirect URIs, API scope, app roles, security group assignments
- `requiredResourceAccess` entries for each API permission attribute
- `oauth2PermissionGrant` (delegated, `AllPrincipals`) for admin consent

#### `AppType = "Daemon"` (background service, no user sign-in)
Skips `identifierUris`, redirect URIs, API scope, and user-facing app roles.
- Assigns the `Daemon` app role on resource service principals via `appRoleAssignment` (application permission, not delegated)

---

### Role objects (`Roles`)

```powershell
@{ DisplayName="OptimalLogAdmin"; Value="OptimalLogAdmin"; MemberType="User"; Description="..." }
```

| Field | Legal values | Description |
|---|---|---|
| `DisplayName` | string | Human-readable label in Entra ID |
| `Value` | string | Claim value returned in tokens |
| `MemberType` | `"User"` \| `"Application"` | `User` for human sign-in roles; `Application` for daemon/service roles |
| `Description` | string | Shown in admin consent UI |

---

### Group objects (`Groups`)

```powershell
@{ DisplayName="HteWrite"; ObjectType="Group"; RoleAssigned="OptimalLogEditor" }
```

| Field | Legal values | Description |
|---|---|---|
| `DisplayName` | string | Display name of the security group (created if missing) |
| `ObjectType` | `"Group"` | Always `"Group"` |
| `RoleAssigned` | string | Must match a `Value` in the app's `Roles` array |

---

### Authentication objects (`Authentication`)

```powershell
@{ Type="Single-page"; Address="https://$Fqdn:1234/callback" }
```

| Field | Legal values | Description |
|---|---|---|
| `Type` | `"Single-page"` \| `"Desktop"` | `Single-page` → stored in `spa.redirectUris`; `Desktop` → stored in `publicClient.redirectUris` |
| `Address` | URI string | The redirect URI to register |

Multiple entries are supported, each with its own `Type`.

---

### Permission objects (`MeshPermissions`, `OptimalGatewayPermissions`, `OptimalLogPermissions`)

```powershell
@{ PermissionType="Scope" }
```

| Field | Legal values | Description |
|---|---|---|
| `PermissionType` | `"Scope"` \| `"Role"` | `Scope` = delegated permission (API scope); `Role` = application permission (app role) |

Multiple entries can be listed to request both a `Scope` and a `Role` in the same API.

---

## Adding a new app

1. Add an entry to `$SmartApps` in Section 1.
2. Set `Key`, `DisplayName`, and `AppType`.
3. Add `ScopeValue` if the app exposes its own API.
4. Add `Roles` and `Groups` for RBAC.
5. Add `Authentication` if users sign in (SPA or Desktop redirect URIs).
6. Add any of `MeshPermissions`, `OptimalGatewayPermissions`, `OptimalLogPermissions` to wire up API access.

Re-run the script. It will create only what is missing and skip everything that already exists.

## Adding a new API dependency

If a new shared API is introduced (similar to OptimalGateway or OptimalLog):

1. Add a new permissions attribute on the apps that need access (e.g. `NewApiPermissions`).
2. In Section 6, add a block similar to the `OptimalLogPermissions` block to call `Ensure-RequiredResourceAccess` and `Ensure-OAuth2PermissionGrant`.
3. In Section 8, extend the filter and add a call to `Ensure-PreAuthorizedApplication` on the new API app.
4. Ensure the new API app is defined in `$SmartApps` with `Key` set so its scope ID and app object can be captured in the Section 6 loop.

## Idempotency

Every helper function follows a read → compare → patch-only-if-changed pattern:

- App registrations, service principals, and security groups are created only if not found by display name.
- API scopes and app roles are merged: existing items are reused (IDs are preserved), new items are appended.
- `requiredResourceAccess` and `preAuthorizedApplications` entries are appended only when not already present.
- `oauth2PermissionGrant` scope strings are extended (not replaced) when a grant already exists.
- Client secrets are skipped when a credential with the same display name already exists (Graph does not return existing secret values).

Re-running the script against an already-provisioned environment produces only `DEBUG`-level skip messages and no Graph PATCH calls.