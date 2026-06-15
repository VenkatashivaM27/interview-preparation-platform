@echo off
set "ROOT=%~dp0"

where code >nul 2>nul
if errorlevel 1 (
  echo Visual Studio Code command line tool "code" was not found.
  echo Open InterviewPreparationPlatform.code-workspace manually from Visual Studio Code.
  pause
  exit /b 1
)

code "%ROOT%InterviewPreparationPlatform.code-workspace"
