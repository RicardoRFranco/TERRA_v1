# PowerShell script to set up development environment

# Get the absolute path to the project root
$ProjectRoot = $PSScriptRoot | Split-Path -Parent
Write-Host "Setting up development environment for TERRA App at: $ProjectRoot" -ForegroundColor Green

# Create virtual environment for Python backend
Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
$BackendPath = Join-Path -Path $ProjectRoot -ChildPath "backend"
Push-Location $BackendPath
python -m venv venv
if ($?) {
    if (Test-Path .\venv\Scripts\Activate.ps1) {
        . .\venv\Scripts\Activate.ps1
        pip install -r requirements.txt
    } else {
        Write-Host "Virtual environment created but activation script not found." -ForegroundColor Yellow
    }
} else {
    Write-Host "Failed to create Python virtual environment. Make sure Python is installed." -ForegroundColor Red
}
Pop-Location

# Initialize database
Write-Host "Initializing database..." -ForegroundColor Cyan
Push-Location $ProjectRoot
docker-compose up -d db
if ($?) {
    Write-Host "Database container started. Waiting for it to initialize..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5  # Wait for database to be ready
} else {
    Write-Host "Failed to start database container. Make sure Docker is running." -ForegroundColor Red
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
Push-Location $BackendPath
python -c "from app.db.models.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
if (-not $?) {
    Write-Host "Failed to run migrations. Check your Python installation and backend code." -ForegroundColor Red
}
Pop-Location

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
$FrontendPath = Join-Path -Path $ProjectRoot -ChildPath "frontend"
Push-Location $FrontendPath
if (Test-Path package.json) {
    npm install
    if (-not $?) {
        Write-Host "Failed to install frontend dependencies. Check your Node.js installation." -ForegroundColor Red
    }
} else {
    Write-Host "package.json not found in $FrontendPath. Make sure you have created all required files." -ForegroundColor Red
}
Pop-Location

Write-Host "Development environment setup completed!" -ForegroundColor Green
Write-Host "You can now start the application with 'docker-compose up' from the project root." -ForegroundColor Cyan