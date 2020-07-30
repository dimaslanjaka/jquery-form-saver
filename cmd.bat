@echo OFF
setlocal DISABLEDELAYEDEXPANSION
cd /d %~dp0

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

IF "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
  set processor=x64
  set architecture=win64
  set python_url="https://www.python.org/ftp/python/2.7.18/python-2.7.18.amd64.msi"
) ELSE (
  set processor=x86
  set architecture=win32
  set python_url="https://www.python.org/ftp/python/2.7.18/python-2.7.18.msi"
)
SET EXTEND=%~dp0node_modules\.bin
set DIR=%~dp0

IF EXIST "%~dp0vendor\bin" (SET EXTEND=%EXTEND%;%~dp0vendor\bin)
IF EXIST "%~dp0libs\bin" (SET EXTEND=%EXTEND%;%~dp0libs\bin)
IF EXIST "%~dp0libs\bin\composer" (SET EXTEND=%EXTEND%;%~dp0libs\bin\composer)
IF EXIST "%~dp0libs\bin\syncjs\bin" (SET EXTEND=%EXTEND%;%~dp0libs\bin\syncjs\bin)
IF EXIST "%~dp0libs\bin\php-cs-fixer" (SET EXTEND=%EXTEND%;%~dp0libs\bin\php-cs-fixer)

rem cygwin detector
IF NOT EXIST "C:\Cygwin\bin" (
  IF NOT EXIST "D:\cygwin64\bin" (
    IF NOT EXIST "D:\cygwin\bin" (
        IF EXIST "E:\cygwin\bin" (SET EXTEND=%EXTEND%;E:\cygwin\bin)
    ) ELSE (SET EXTEND=%EXTEND%;D:\cygwin\bin)
  ) ELSE (SET EXTEND=%EXTEND%;D:\cygwin64\bin)
) ELSE (SET EXTEND=%EXTEND%;C:\Cygwin\bin)

IF NOT EXIST "C:\Python27" (
  powershell.exe -Command "(New-Object Net.WebClient).DownloadFile('%python_url%', 'python.msi')"
  echo "please install %DIR%python.msi"
  pause
)
IF EXIST "C:\Python27" (
  set PYTHON=C:\Python27
  set PYTHONPATH=C:\Python27
  setx PYTHON C:\Python27\python.exe /m
)

SET PATH=%PATH%;%EXTEND%
set python_posix=%PYTHON:\=/%/python.exe
set npm_config_devdir=%~dp0/tmp/.gyp
set VCINSTALLDIR=C:\Program Files (x86)\MSBuild
rem npm config set python %PYTHON:\=/%/python.exe

GOTO BEGIN

:BEGIN
echo Select Terminal:
echo 1 - CMD
echo 2 - POWERSHELL
echo 3 - PING
echo 4 - (universal-framework) Re-build Compiler 
echo 5 - Travis Log Clear
echo 6 - Install NodeJS Components
echo 7 - Delete Git Commit Histories
choice /n /c:1234567 /M "Choose an option: "
GOTO LABEL-%ERRORLEVEL%

:LABEL-1 CMD
  cls
  cmd.exe /k "@echo ON & setlocal DISABLEDELAYEDEXPANSION & npm config set python %PYTHON:\=/%/python.exe"
  goto END

:LABEL-2 POWERSHELL
  cls
  rem Start powershell.exe -noexit -ExecutionPolicy Bypass -File "%~dp0cmd.ps1" -Command "npm config set python %PYTHON:\=/%/python.exe Set-Location -literalPath '%~dp0';"
  Start powershell.exe -noexit -ExecutionPolicy Bypass -Command "npm config set python %PYTHON:\=/%/python.exe Set-Location -literalPath '%~dp0';"
  goto END

:LABEL-3 PING
  cls
  set /p domainhost="Enter Host: "
  IF %domainhost%=="" (set domainhost=google.com)
  cmd.exe /k "@echo OFF & ping %domainhost% -t"
  goto END

:LABEL-4 Rebuild
  IF EXIST "%~dp0tsconfig.build.json" (
    cmd.exe /k "@echo OFF & cls & tsc -p tsconfig.build.json & tsc -p tsconfig.precompiler.json & tsc -p tsconfig.compiler.json"
  )
  goto END

:LABEL-5 TravisLog
  @echo OFF
  setlocal EnableDelayedExpansion
  set /p LoopCount="How many log: "
  for /L %%A in (1,1,%LoopCount%) do (
      travis logs %%A --delete --force
  )
  pause
  goto END

:LABEL-6 additional
  cmd.exe /k "@echo OFF & cls & npm install -g node-gyp & npm install -g socket.io & npm install -g node-sass@latest --unsafe-perm=true --allow-root"
  goto END

:LABEL-7 Commit
  set /p commit="Commit Message: "
  IF commit=="" (
    echo "Commit message cannot be empty"
  ) ELSE (
    cmd.exe /k "@echo OFF & cls & git checkout --orphan latest_branch & git add -A & git commit -am \"%commit%\" & git branch -D master & git branch -m master & git push -f origin master"
  )
:END
rem pause
