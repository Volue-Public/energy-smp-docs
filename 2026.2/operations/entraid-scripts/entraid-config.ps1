<#
Shared Entra ID configuration for Smart Power scripts.
Dot-sourced by validate-entraid-environment.ps1 and report-entraid-settings.ps1.

Edit this file to change environment, app names, or permissions.
#>

# ----------------------------
# ENVIRONMENT (edit these)
# ----------------------------

$NamePrefix = "energy-"
$EnvSuffix  = "-auto"  # set "" if you don't want environment suffix

$Fqdn = "*.voluead.volue.com"

# Microsoft Graph constants (well-known, stable across all tenants)
$MicrosoftGraphAppId   = "00000003-0000-0000-c000-000000000000"
$GraphUserReadScopeId  = [guid]"e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read delegated

# Scope "values" (strings). Script reuses existing scope IDs if these exist.
$MeshScopeValue = "Mesh.Grpc"

# Owners assigned to every app registration and enterprise application
$OwnerEmails = @(
  "john-inge.fjellvikas@volue.com",
  "tore.forbregd@volue.com",
  "stale.deraas@volue.com"
)

# ----------------------------
# MESH APP
# ----------------------------

# Type definitions:
#   MemberType     - role member type:          User, Application
#   ObjectType     - access group type:         Group, ServicePrincipal
#   PermissionType - API permission type:       Scope, Role
#   AppType        - application type:          Application, Daemon
#   Type           - Authentication entry type: Single-page, Desktop

$MeshRolesDesired = @(
  @{ DisplayName="ModelReader";     Value="ModelReader";     MemberType="User";        Description="Mesh model read access"            },
  @{ DisplayName="ModelWriter";     Value="ModelWriter";     MemberType="User";        Description="Mesh model write access"           },
  @{ DisplayName="TimeSeriesReader";Value="TimeSeriesReader";MemberType="User";        Description="Mesh time series read access"      },
  @{ DisplayName="TimeSeriesWriter";Value="TimeSeriesWriter";MemberType="User";        Description="Mesh time series write access"     },
  @{ DisplayName="Daemon";          Value="Daemon";          MemberType="Application"; Description="Mesh daemon access"                }
)

$MeshGroupsDesired = @(
  @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="ModelWriter"      },
  @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="TimeSeriesWriter" },
  @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="ModelWriter"      },
  @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="TimeSeriesWriter" },
  @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="ModelReader"      },
  @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="TimeSeriesReader" }
)

# ----------------------------
# SMART POWER APPS
# ----------------------------

$SmartApps = @(
  @{
    Key="OptimalLog"
    DisplayName=("${NamePrefix}optimal-log${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="OptimalLogAdmin";  Value="OptimalLogAdmin";  MemberType="User";        Description="Full access including delete and config"    },
      @{ DisplayName="OptimalLogEditor"; Value="OptimalLogEditor"; MemberType="User";        Description="Read + create/update (no delete)"           },
      @{ DisplayName="OptimalLogViewer"; Value="OptimalLogViewer"; MemberType="User";        Description="Read only access (GET endpoints only)"      },
      @{ DisplayName="Daemon";           Value="Daemon";           MemberType="Application"; Description="Mesh daemon access"                         }
    )
    Groups=@(
      @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="OptimalLogAdmin"  },
      @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="OptimalLogEditor" },
      @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="OptimalLogViewer" }
    )
    ScopeValue="Optimal.Log"
  },
  @{
    Key="OptimalGateway"
    DisplayName=("${NamePrefix}optimal-gateway${EnvSuffix}")
    AppType="Application"
    Roles=@(
      @{ DisplayName="OptimalGwAdmin";          Value="OptimalGwAdmin";          MemberType="User";        Description="Full access including delete and config"                             },
      @{ DisplayName="OptimalGwEditor";         Value="OptimalGwEditor";         MemberType="User";        Description="Read + create/update (no delete)"                                    },
      @{ DisplayName="OptimalGwViewer";         Value="OptimalGwViewer";         MemberType="User";        Description="Read only access (GET endpoints only)"                               },
      @{ DisplayName="OptimalGwServiceAccount"; Value="OptimalGwServiceAccount"; MemberType="Application"; Description="Machine/daemon clients, used for background jobs or interface"      },
      @{ DisplayName="Daemon";                  Value="Daemon";                  MemberType="Application"; Description="Mesh daemon access"                                                  }
    )
    Groups=@(
      @{ DisplayName="HteDelete"; ObjectType="Group"; RoleAssigned="OptimalGwAdmin"  },
      @{ DisplayName="HteWrite";  ObjectType="Group"; RoleAssigned="OptimalGwEditor" },
      @{ DisplayName="HteRead";   ObjectType="Group"; RoleAssigned="OptimalGwViewer" }
    )
    ScopeValue="Optimal.Gateway"
    MeshPermissions=@(
      @{ PermissionType="Scope" },
      @{ PermissionType="Role"  }
    )
    OptimalLogPermissions=@(
      @{ PermissionType="Scope" }
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
    ScopeValue="AssetManager"
    Authentication=@(
      @{ Type="Single-page"; Address="https://$Fqdn`:18051/callback" }
    )
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
    ScopeValue="AvailabilityPlanner"
    Authentication=@(
      @{ Type="Single-page"; Address="https://$Fqdn`:18053/callback" }
    )
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
    ScopeValue="MeshConfigurator"
    Authentication=@(
      @{ Type="Single-page"; Address="https://$Fqdn`:18055/callback" }
    )
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
    ScopeValue="Nimbus"
    Authentication=@(
      @{ Type="Desktop"; Address="http://localhost" },
      @{ Type="Desktop"; Address="ms-appx-web://Microsoft.AAD.BrokerPlugin/{clientId}" }
    )
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
    OptimalGatewayPermissions=@(
      @{ PermissionType="Scope" }
    )
    OptimalLogPermissions=@(
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
    ScopeValue="MarginalCost"
    MeshPermissions=@(
      @{ PermissionType="Scope" }
    )
  },
  @{
    Key="MeshDataTransfer"
    DisplayName=("${NamePrefix}mesh-data-transfer${EnvSuffix}")
    AppType="Daemon"
    MeshPermissions=@(
      @{ PermissionType="Role" }
    )
  },
  @{
    Key="AutomationFrameworkApi"
    DisplayName=("${NamePrefix}automation-framework-api${EnvSuffix}")
    AppType="Application"
    ScopeValue="af-api"
    Roles=@(
      @{ DisplayName="ServiceAccount"; Value="ServiceAccount"; MemberType="Application"; Description="AF ServiceAccount"  },
      @{ DisplayName="Viewer";         Value="Viewer";         MemberType="User";        Description="AF Viewer role"     },
      @{ DisplayName="Modeler";        Value="Modeler";        MemberType="User";        Description="AF Modeler"         },
      @{ DisplayName="Admin";          Value="Admin";          MemberType="User";        Description="Admin"              },
      @{ DisplayName="Operator";       Value="Operator";       MemberType="User";        Description="AF Operator"        }
    )
    Groups=@(
      @{ DisplayName="ENERGY-AF-DEV-ADM";             ObjectType="Group";            RoleAssigned="Admin"          },
      @{ DisplayName="automation-framework-services"; ObjectType="ServicePrincipal"; RoleAssigned="ServiceAccount" }
    )
    MeshPermissions=@(
      @{ PermissionType="Role" }
    )
  },
  @{
    Key="AutomationFrameworkServices"
    DisplayName=("${NamePrefix}automation-framework-services${EnvSuffix}")
    AppType="Application"
    OptimalGatewayPermissions=@(
      @{ PermissionType="Role" }
    )
    OptimalLogPermissions=@(
      @{ PermissionType="Role" }
    )
    AFPermissions=@(
      @{ PermissionType="Role" }
    )
  },
  @{
    Key="AutomationFrameworkUI"
    DisplayName=("${NamePrefix}automation-framework-ui${EnvSuffix}")
    AppType="Application"
    AFPermissions=@(
      @{ PermissionType="Role" }
    )
  }
)

$MeshAppDisplayName = "${NamePrefix}mesh${EnvSuffix}"
