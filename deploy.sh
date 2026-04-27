#!/bin/bash

# Larasena Production Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Starting Larasena Deployment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Copying .env.example to .env..."
    cp .env.example .env
    print_warning "Please edit .env file with your production configuration!"
    print_warning "Don't forget to set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET!"
    exit 1
fi

# Check required environment variables
print_info "Checking environment variables..."

if ! grep -q "GOOGLE_CLIENT_ID=.*\.apps\.googleusercontent\.com" .env; then
    print_warning "GOOGLE_CLIENT_ID not properly configured in .env"
    print_info "Please set your Google OAuth credentials. See GOOGLE_OAUTH_SETUP.md"
fi

if ! grep -q "GOOGLE_CLIENT_SECRET=GOCSPX-" .env; then
    print_warning "GOOGLE_CLIENT_SECRET not properly configured in .env"
fi

# Pull latest code
print_info "Pulling latest code from repository..."
git pull origin main
print_success "Code updated"

# Install/Update Composer dependencies
print_info "Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction
print_success "Composer dependencies installed"

# Install/Update NPM dependencies
print_info "Installing NPM dependencies..."
npm install --production
print_success "NPM dependencies installed"

# Build frontend assets
print_info "Building frontend assets..."
npm run build
print_success "Frontend assets built"

# Run database migrations
print_info "Running database migrations..."
php artisan migrate --force
print_success "Database migrations completed"

# Clear all caches
print_info "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
print_success "Caches cleared"

# Cache configuration
print_info "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
print_success "Configuration cached"

# Create storage link if not exists
if [ ! -L public/storage ]; then
    print_info "Creating storage symlink..."
    php artisan storage:link
    print_success "Storage symlink created"
fi

# Set proper permissions
print_info "Setting proper permissions..."
chmod -R 755 storage bootstrap/cache
print_success "Permissions set"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_info "Setting ownership to www-data..."
    chown -R www-data:www-data storage bootstrap/cache
    print_success "Ownership set"
fi

# Restart PHP-FPM if available
if systemctl is-active --quiet php8.2-fpm; then
    print_info "Restarting PHP-FPM..."
    systemctl restart php8.2-fpm
    print_success "PHP-FPM restarted"
elif systemctl is-active --quiet php8.1-fpm; then
    print_info "Restarting PHP-FPM..."
    systemctl restart php8.1-fpm
    print_success "PHP-FPM restarted"
fi

# Restart queue workers if exists
if systemctl is-active --quiet larasena-worker; then
    print_info "Restarting queue workers..."
    systemctl restart larasena-worker
    print_success "Queue workers restarted"
fi

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Test the application: https://yourdomain.com"
echo "  2. Test Google login functionality"
echo "  3. Check logs: tail -f storage/logs/laravel.log"
echo ""
print_warning "If Google login doesn't work, check GOOGLE_OAUTH_SETUP.md"
