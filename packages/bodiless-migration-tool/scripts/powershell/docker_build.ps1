$script_dir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$app_dir=Split-Path (Split-Path $script_dir -Parent) -Parent
Set-Location -Path $app_dir

Invoke-Expression "docker build -t flattening_tool ."