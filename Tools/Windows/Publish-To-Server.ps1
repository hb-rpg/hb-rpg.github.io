<#
.SYNOPSIS
Builds the application and deploys it to a remote Linux server over SSH.

.DESCRIPTION
Reads its settings from the .env file at the repository root (see .env.example).
The bundle is published locally, copied to the server's home directory with scp,
then installed into the target directory with a privileged rsync. Both the
remote staging copy and the local bundle are always removed afterwards.

Every setting is validated before any destructive command runs, and each
destructive command must be confirmed by typing "I am sure". There is no bypass
switch, so the script requires an interactive terminal.

.PARAMETER Username
SSH username for the remote server. Defaults to DEPLOY_USER from .env.

.PARAMETER ServerIP
IP address or hostname of the remote server. Defaults to DEPLOY_HOST from .env.

.EXAMPLE
.\Tools\Windows\Publish-To-Server.ps1

.EXAMPLE
.\Tools\Windows\Publish-To-Server.ps1 someone-else 10.0.0.5
#>
param(
    [Parameter(Mandatory=$false, Position=0)]
    [string]$Username,

    [Parameter(Mandatory=$false, Position=1)]
    [string]$ServerIP
)

$ErrorActionPreference = "Stop"

# Settings and guards below run outside the deploy try/catch, so a failure there
# would otherwise surface as a raw PowerShell stack trace.
trap {
    Write-Host "Cannot start deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$EnvFile = Join-Path $RepoRoot ".env"
$ProjectFile = "NemoEsuriat.csproj"

# Every DEPLOY_* key the script understands. Anything else in .env is a typo,
# which would otherwise be ignored in silence and deploy somewhere unintended.
$KnownKeys = @(
    "DEPLOY_USER", "DEPLOY_HOST", "DEPLOY_REMOTE_PARENT", "DEPLOY_DIR_NAME",
    "DEPLOY_SERVICE_NAME", "DEPLOY_WEB_SERVICE", "DEPLOY_OWNER"
)

# Directories that must never be the deployment target, however .env is mangled.
$CriticalRemotePaths = @(
    "/", "/bin", "/boot", "/dev", "/etc", "/home", "/lib", "/lib64", "/media",
    "/mnt", "/opt", "/proc", "/root", "/run", "/sbin", "/srv", "/sys", "/tmp", "/usr", "/var"
)

# =============================================================================
# Settings
# =============================================================================

function Read-EnvFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "No .env file found at $Path. Copy .env.example to .env and fill it in."
    }

    $settings = @{}
    $lineNumber = 0

    foreach ($line in Get-Content -LiteralPath $Path) {
        $lineNumber++

        # A UTF-8 BOM would otherwise become part of the first key name.
        $trimmed = $line.Trim().TrimStart([char]0xFEFF).Trim()
        if ($trimmed -eq "" -or $trimmed.StartsWith("#")) { continue }

        $separator = $trimmed.IndexOf("=")
        if ($separator -lt 1) {
            Write-Warning "${Path}:${lineNumber}: ignoring line with no '=': $trimmed"
            continue
        }

        $key = $trimmed.Substring(0, $separator).Trim()
        $value = $trimmed.Substring($separator + 1).Trim().Trim('"', "'")

        # Shell-style "export KEY=value" is a common habit; accept it rather
        # than silently parsing the key as "export KEY".
        if ($key -match '^export\s+(.+)$') { $key = $Matches[1].Trim() }

        # A surviving quote could break out of the single-quoted bash strings
        # built for the remote script. Refuse rather than sanitise.
        if ($value -match "['`"]") {
            throw "${Path}:${lineNumber}: $key contains a quote character, which is not allowed."
        }

        if ($settings.ContainsKey($key)) {
            Write-Warning "${Path}:${lineNumber}: $key is defined more than once; using the last value."
        }

        $settings[$key] = $value
    }

    foreach ($key in $settings.Keys) {
        if ($KnownKeys -notcontains $key) {
            Write-Warning "$Path defines unknown key '$key' (ignored). Known keys: $($KnownKeys -join ', ')"
        }
    }

    return $settings
}

function Get-Setting {
    param(
        [hashtable]$Settings,
        [string]$Key,
        [string]$Override,
        [string]$Default,
        [string]$Pattern,
        [string]$Requirement
    )

    $value = $null
    $source = $null

    if ($Override) {
        $value = $Override
        $source = "the command line"
    }
    elseif ($Settings.ContainsKey($Key) -and $Settings[$Key]) {
        $value = $Settings[$Key]
        $source = $EnvFile
    }
    else {
        if ($Settings.ContainsKey($Key)) {
            Write-Warning "$Key is present but empty in $EnvFile."
        }
        if (-not $Default) {
            throw "$Key is not set in $EnvFile and was not supplied on the command line."
        }
        Write-Warning "$Key not set; falling back to the default '$Default'."
        $value = $Default
        $source = "the built-in default"
    }

    if ($Pattern -and ($value -notmatch $Pattern)) {
        throw "$Key = '$value' (from $source) is not valid. $Requirement"
    }

    return $value
}

$EnvSettings = Read-EnvFile -Path $EnvFile

$Username = Get-Setting $EnvSettings "DEPLOY_USER" -Override $Username `
    -Pattern '^[A-Za-z0-9._-]+$' -Requirement "Expected a plain Unix username."

$ServerIP = Get-Setting $EnvSettings "DEPLOY_HOST" -Override $ServerIP `
    -Pattern '^[A-Za-z0-9._:\[\]-]+$' -Requirement "Expected a hostname or IP address."

$DirName = Get-Setting $EnvSettings "DEPLOY_DIR_NAME" -Default "Heartbreaker" `
    -Pattern '^[A-Za-z0-9._-]+$' -Requirement "Expected a single directory name with no path separators."

$RemoteParent = Get-Setting $EnvSettings "DEPLOY_REMOTE_PARENT" -Default "/var/www" `
    -Pattern '^/[A-Za-z0-9._/-]*$' -Requirement "Expected an absolute Unix path."

$ServiceName = Get-Setting $EnvSettings "DEPLOY_SERVICE_NAME" -Default $DirName `
    -Pattern '^[A-Za-z0-9._@-]+$' -Requirement "Expected a systemd unit name."

$WebService = Get-Setting $EnvSettings "DEPLOY_WEB_SERVICE" -Default "apache2" `
    -Pattern '^[A-Za-z0-9._@-]+$' -Requirement "Expected a systemd unit name."

$Owner = Get-Setting $EnvSettings "DEPLOY_OWNER" -Default "www-data:www-data" `
    -Pattern '^[A-Za-z0-9._-]+(:[A-Za-z0-9._-]+)?$' -Requirement "Expected 'user' or 'user:group'."

# The character classes above admit no quote, space, '$', backtick or ';', so
# interpolating these values into the remote bash script is safe by construction.

# =============================================================================
# Guards - everything here runs before the first destructive command
# =============================================================================

if ($DirName -eq "." -or $DirName -eq "..") {
    throw "DEPLOY_DIR_NAME = '$DirName' would resolve to a parent directory."
}

$RemoteParent = $RemoteParent.TrimEnd("/")
$RemoteTarget = "$RemoteParent/$DirName"

$segments = @($RemoteTarget.Trim("/").Split("/") | Where-Object { $_ -ne "" })
if ($segments -contains "..") {
    throw "Remote target '$RemoteTarget' contains a '..' segment."
}
if ($segments.Count -lt 2) {
    throw "Remote target '$RemoteTarget' is too shallow; refusing to deploy above a second-level directory."
}
if ($CriticalRemotePaths -contains $RemoteTarget) {
    throw "Remote target '$RemoteTarget' is a system directory; refusing to deploy there."
}

# Resolve the local bundle path and require it to sit strictly inside the repo,
# so that 'Remove-Item -Recurse -Force' can never escape upwards.
$LocalDir = [System.IO.Path]::GetFullPath((Join-Path $RepoRoot $DirName))
$RepoRootFull = [System.IO.Path]::GetFullPath($RepoRoot).TrimEnd('\')
if ($LocalDir.TrimEnd('\') -eq $RepoRootFull) {
    throw "The local bundle path resolves to the repository root ($RepoRootFull); refusing to delete it."
}
if (-not $LocalDir.StartsWith($RepoRootFull + '\')) {
    throw "The local bundle path '$LocalDir' is outside the repository root ($RepoRootFull)."
}

# Fail before the first delete if the toolchain or the project is missing.
foreach ($tool in @("dotnet", "ssh", "scp")) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "Required command '$tool' was not found on PATH."
    }
}
if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $ProjectFile))) {
    throw "Could not find $ProjectFile in $RepoRoot. Is this script still in Tools\Windows?"
}

# Every destructive step needs a typed confirmation, so bail out now rather
# than after sitting through a full release build.
if ([Console]::IsInputRedirected) {
    throw "This script requires an interactive terminal: every destructive step must be confirmed by hand."
}

$Target = "$Username@$ServerIP"
$RemoteRmCommand = "rm -rf ~/'$DirName'"

# =============================================================================
# Confirmation
# =============================================================================

function Confirm-Dangerous {
    param(
        [string]$Action,
        [string[]]$Commands,
        [string]$Consequence
    )

    if ([Console]::IsInputRedirected) {
        throw "Cannot confirm '$Action': stdin is redirected. This script requires an interactive terminal."
    }

    Write-Host ""
    Write-Host "  !! DANGEROUS: $Action" -ForegroundColor Yellow
    foreach ($command in $Commands) {
        Write-Host "       $command" -ForegroundColor Gray
    }
    Write-Host "     $Consequence" -ForegroundColor Yellow

    # -ne is case-insensitive, so "i am sure" is accepted too.
    $answer = (Read-Host "     Type 'I am sure' to continue").Trim()
    if ($answer -ne "I am sure") {
        throw "Aborted at: $Action"
    }
}

# =============================================================================
# Deploy
# =============================================================================

$RemoteStaged = $false

# Run from the repo root so scp gets a relative source path: it would read the
# drive letter in an absolute "C:\..." path as a remote host.
Push-Location $RepoRoot

try {
    # --- 1. Build the deployment bundle ---
    Write-Host "--- 1. Building and publishing application ---"

    if (Test-Path -LiteralPath $LocalDir) {
        Confirm-Dangerous -Action "Delete the previous local bundle" `
            -Commands @("Remove-Item -LiteralPath '$LocalDir' -Recurse -Force") `
            -Consequence "This permanently deletes that directory and everything under it."
        Remove-Item -LiteralPath $LocalDir -Recurse -Force
    }

    Write-Host "Publishing .NET backend to $LocalDir..."
    # Name the project explicitly: --output is rejected when dotnet resolves the .sln.
    dotnet publish $ProjectFile --configuration Release --output ".\$DirName"
    if ($LASTEXITCODE -ne 0) {
        throw "dotnet publish failed (exit code $LASTEXITCODE)."
    }

    # --- 2. Upload to the server's home directory ---
    Write-Host "--- 2. Uploading $DirName to ${Target}:~/ ---"

    # scp merges into an existing directory, so clear any stale staging copy
    # first to make sure we upload exactly what we just built.
    Confirm-Dangerous -Action "Clear the remote staging directory" `
        -Commands @("ssh $Target `"$RemoteRmCommand`"") `
        -Consequence "This permanently deletes ~/$DirName in $Username's home directory on $ServerIP."
    ssh $Target $RemoteRmCommand
    if ($LASTEXITCODE -ne 0) {
        throw "Could not reach $Target over SSH (exit code $LASTEXITCODE)."
    }

    $RemoteStaged = $true
    scp -r ".\$DirName" "${Target}:~/"
    if ($LASTEXITCODE -ne 0) {
        throw "scp failed (exit code $LASTEXITCODE)."
    }

    # --- 3. Install into the target directory ---
    Write-Host "--- 3. Installing to ${ServerIP}:$RemoteTarget ---"

    # rsync must run under sudo: the login user cannot write into $RemoteParent.
    # A single `ssh -t` session means sudo only prompts for a password once.
    $RemoteScript = @"
set -e
sudo mkdir -p '$RemoteTarget'
sudo rsync -a --delete "`$HOME/$DirName/" '$RemoteTarget/'
sudo chown -R '$Owner' '$RemoteTarget'
sudo systemctl restart '$ServiceName'
sudo systemctl restart '$WebService'
"@

    # PowerShell here-strings use CRLF; bash would choke on the stray carriage returns.
    $RemoteScript = $RemoteScript -replace "`r`n", "`n"

    Confirm-Dangerous -Action "Install to $RemoteTarget on $ServerIP (as root)" `
        -Commands ($RemoteScript -split "`n" | Where-Object { $_ -ne "" }) `
        -Consequence "'rsync --delete' makes $RemoteTarget an exact copy of the bundle: anything else in there is deleted. The services above are then restarted."
    ssh -t $Target $RemoteScript
    if ($LASTEXITCODE -ne 0) {
        throw "Remote deployment failed (exit code $LASTEXITCODE). If rsync succeeded but a later step did not, $RemoteTarget may need 'sudo chown -R $Owner $RemoteTarget' and a service restart by hand."
    }

    Write-Host "Deployment successful! Files are now at ${ServerIP}:$RemoteTarget" -ForegroundColor Green
}
catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    $Failed = $true
}
finally {
    # --- 4. Cleanup ---
    # Each step is isolated so that a cleanup failure never masks the real error.
    Write-Host "--- 4. Cleaning up ---"

    if ($RemoteStaged) {
        try {
            Confirm-Dangerous -Action "Remove the remote staging copy" `
                -Commands @("ssh $Target `"$RemoteRmCommand`"") `
                -Consequence "This permanently deletes ~/$DirName in $Username's home directory on $ServerIP."
            ssh $Target $RemoteRmCommand
            if ($LASTEXITCODE -ne 0) { throw "ssh exited with code $LASTEXITCODE." }
        }
        catch {
            Write-Warning "Remote staging copy NOT removed: $($_.Exception.Message)"
            Write-Warning "  To clean up manually: ssh $Target `"$RemoteRmCommand`""
        }
    }

    if (Test-Path -LiteralPath $LocalDir) {
        try {
            Confirm-Dangerous -Action "Remove the local bundle" `
                -Commands @("Remove-Item -LiteralPath '$LocalDir' -Recurse -Force") `
                -Consequence "This permanently deletes that directory and everything under it."
            Remove-Item -LiteralPath $LocalDir -Recurse -Force
        }
        catch {
            Write-Warning "Local bundle NOT removed: $($_.Exception.Message)"
            Write-Warning "  To clean up manually: Remove-Item -LiteralPath '$LocalDir' -Recurse -Force"
        }
    }

    Pop-Location

    if ($Failed) { exit 1 }
}
