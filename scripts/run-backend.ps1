$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$maven = Join-Path $root "tools\apache-maven-3.9.6\bin\mvn.cmd"
Set-Location (Join-Path $root "backend")
& $maven spring-boot:run "-Dspring-boot.run.profiles=dev"
