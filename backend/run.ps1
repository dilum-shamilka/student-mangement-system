# Helper script to run Spring Boot Backend without requiring manual Maven installation

$BackendDir = $PSScriptRoot
Set-Location $BackendDir

# Check if Maven is available globally
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "Found global Maven (mvn). Launching Spring Boot..." -ForegroundColor Green
    mvn spring-boot:run
    exit
}

# Download portable Maven if not already downloaded
$MavenVersion = "3.9.6"
$M2Dir = "$env:USERPROFILE\.m2\portable-mvn"
$MavenHome = "$M2Dir\apache-maven-$MavenVersion"
$MavenZip = "$M2Dir\apache-maven-$MavenVersion-bin.zip"

if (-not (Test-Path "$MavenHome\bin\mvn.cmd")) {
    Write-Host "Maven not found in PATH. Downloading standalone Maven $MavenVersion..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $M2Dir | Out-Null
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip" -OutFile $MavenZip
    Write-Host "Extracting Maven binaries..." -ForegroundColor Yellow
    Expand-Archive -Path $MavenZip -DestinationPath $M2Dir -Force
}

Write-Host "Launching Spring Boot Backend with Maven..." -ForegroundColor Green
& "$MavenHome\bin\mvn.cmd" spring-boot:run
