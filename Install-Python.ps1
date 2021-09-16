[CmdletBinding()] Param(
    $pythonVersion = "3.6.2"
    $pythonUrl = "https://www.python.org/ftp/python/$pythonVersion/python-$pythonVersion.exe"
    $pythonDownloadPath = 'C:\Tools\python-$pythonVersion.exe'
    $pythonInstallDir = "C:\Tools\Python$pythonVersion"
)

(New-Object Net.WebClient).DownloadFile($pythonUrl, $pythonDownloadPath)
& $pythonDownloadPath /quiet InstallAllUsers=1 PrependPath=1 Include_test=0 TargetDir=$pythonInstallDir
if ($LASTEXITCODE -ne 0) {
    throw "The python installer at '$pythonDownloadPath' exited with error code '$LASTEXITCODE'"
}
# Set the PATH environment variable for the entire machine (that is, for all users) to include the Python install dir
[Environment]::SetEnvironmentVariable("PATH", "${env:path};${pythonInstallDir}", "Machine")
