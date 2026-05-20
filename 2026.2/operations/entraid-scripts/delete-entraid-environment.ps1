# ----------------------------
# CONFIG
# ----------------------------
$NamePrefix = "energy-" # filter apps to delete
$EnvSuffix  = "-auto"   # filter apps to delete
#$dryRun = $true         # change to $false to actually delete
$dryRun = $false         # change to $false to actually delete

# ----------------------------
# CONNECT TO GRAPH
# ----------------------------
Connect-MgGraph -Scopes "Application.ReadWrite.All" #, "Directory.ReadWrite.All"

Write-Host "Starting cleanup. Prefix filter: $NamePrefix Suffix filter: $EnvSuffix"
Write-Host "DryRun: $dryRun"
Write-Host ""

# ----------------------------
# GET APPLICATIONS
# ----------------------------
$applications = Get-MgApplication -All |
    Where-Object { $_.DisplayName -like "$NamePrefix*$EnvSuffix" }

Write-Host "Found $($applications.Count) applications to delete"
Write-Host ""

# ----------------------------
# CLEANUP LOOP
# ----------------------------
foreach ($app in $applications) {

    Write-Host "----------------------------------------"
    Write-Host "Processing app: $($app.DisplayName)" -ForegroundColor Yellow
    Write-Host "AppId:  $($app.AppId)"
    Write-Host "ObjId:  $($app.Id)"

    # ----------------------------
    # 1. FIND SERVICE PRINCIPAL(S)
    # ----------------------------
    $servicePrincipals = Get-MgServicePrincipal -Filter "appId eq '$($app.AppId)'"

    foreach ($sp in $servicePrincipals) {

        Write-Host "  Found Service Principal: $($sp.DisplayName)" -ForegroundColor Yellow
        Write-Host "  SP ObjId: $($sp.Id)"

        if ($dryRun) {
            Write-Host "  DRY RUN: Would delete Service Principal"
        }
        else {
            try {
                Remove-MgServicePrincipal -ServicePrincipalId $sp.Id -Confirm:$false
                Write-Host "  Deleted Service Principal" -ForegroundColor Green
            }
            catch {
                Write-Warning "  Failed to delete Service Principal: $($sp.DisplayName)"
                Write-Warning "  Reason: $($_.Exception.Message)"
            }
        }
    }

    # ----------------------------
    # 2. DELETE APPLICATION
    # ----------------------------
    if ($dryRun) {
        Write-Host "  DRY RUN: Would delete Application"
    }
    else {
        try {
            Remove-MgApplication -ApplicationId $app.Id -Confirm:$false
            Write-Host "  Deleted Application" -ForegroundColor Green
        }
        catch {
            Write-Warning "  Failed to delete Application: $($app.DisplayName)"
            Write-Warning "  Reason: $($_.Exception.Message)"
        }
    }
}

Write-Host ""
Write-Host "Cleanup completed"
