$script_dir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$app_dir = Split-Path (Split-Path $script_dir -Parent) -Parent
Set-Location -Path $app_dir

New-item -ItemTyp Directory -Force -Path $work_dir/app
$tool_dir = "/home/pptruser/flattening_tool"

$cmd = "docker run -it"
$cmd = -join(${cmd}, " --cap-add=SYS_ADMIN")
$cmd = -join(${cmd}, " -v ${app_dir}\settings.json:${tool_dir}/settings.json")
$cmd = -join(${cmd}, " -v ${app_dir}\conf:${tool_dir}/conf")
$cmd = -join(${cmd}, " -v ${app_dir}\app:${tool_dir}/app")
$cmd = -join(${cmd}, " -p 8005:8005")
$cmd = -join(${cmd}, " -p 9000:9000")
$cmd = -join(${cmd}, " --name flattening_tool")
$cmd = -join(${cmd}, " --entrypoint /bin/bash flattening_tool")

Invoke-Expression "& ${cmd}"
