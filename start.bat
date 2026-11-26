@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Replay

echo.
echo   Replay - starting...
echo   ---------------------

REM load settings from .env (skip comment lines)
if exist .env (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do set "%%a=%%b"
)

REM check Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo   [X] Node.js is not installed.
  echo       Install it from https://nodejs.org  then run again.
  pause
  exit /b 1
)

REM make sure we have an API key
set "HASKEY=1"
if "!ANTHROPIC_API_KEY!"=="" if "!OPENAI_API_KEY!"=="" set "HASKEY=0"
echo !ANTHROPIC_API_KEY! | find "xxxx" >nul && set "HASKEY=0"

if "!HASKEY!"=="0" (
  echo.
  echo   First time only: paste your Anthropic API key ^(starts with sk-ant-^)
  echo   Get it from https://console.anthropic.com/  -^> Settings -^> API Keys
  set /p "KEY=  key: "
  >>.env echo ANTHROPIC_API_KEY=!KEY!
  set "ANTHROPIC_API_KEY=!KEY!"
  set /p "PW=  optional site password (press Enter to skip): "
  if not "!PW!"=="" (
    >>.env echo APP_PASSWORD=!PW!
    set "APP_PASSWORD=!PW!"
  )
  echo   [OK] saved to .env
)

if "!PORT!"=="" set "PORT=8787"
echo   [OK] opening http://localhost:!PORT!
echo   (close this window to stop the server)
echo.
start "" http://localhost:!PORT!
node server\server.js
pause
