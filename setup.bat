@echo off
echo ========================================================
echo Team Task Manager - Quick Setup Script
echo ========================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install it from https://nodejs.org/ and try again.
    pause
    exit /b
)

:: Check for Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Git is not installed. You may not be able to deploy.
    echo You can install it from https://git-scm.com/downloads
)

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b
)

echo.
echo [2/3] Setting up the database...
if not exist ".env" (
    echo [ERROR] .env file is missing! Please create one with DATABASE_URL and JWT_SECRET before running this script.
    pause
    exit /b
)

call npx prisma generate
call npx prisma db push
call node prisma/seed.js
if %errorlevel% neq 0 (
    echo [ERROR] Database setup failed. Check your .env file and PostgreSQL connection.
    pause
    exit /b
)

echo.
echo [3/3] Starting the development server...
echo The app will be available at http://localhost:3000
echo.
call npm run dev
