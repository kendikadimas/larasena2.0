#!/bin/bash

# Quick Fix for Google OAuth Configuration
# Usage: bash fix-google-oauth.sh

set -e

echo "🔧 Google OAuth Configuration Fix"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    exit 1
fi

# Display current configuration
echo "Current Google OAuth Configuration:"
echo "-----------------------------------"
grep "GOOGLE_" .env || echo "No Google OAuth variables found"
echo ""

# Check if variables are set
HAS_CLIENT_ID=$(grep -c "^GOOGLE_CLIENT_ID=.*.apps.googleusercontent.com" .env || echo "0")
HAS_CLIENT_SECRET=$(grep -c "^GOOGLE_CLIENT_SECRET=GOCSPX-" .env || echo "0")
HAS_REDIRECT=$(grep -c "^GOOGLE_REDIRECT_URI=https://" .env || echo "0")

if [ "$HAS_CLIENT_ID" -eq "0" ]; then
    print_error "GOOGLE_CLIENT_ID is not properly configured"
    echo ""
    print_info "To fix this:"
    echo "  1. Go to https://console.cloud.google.com/apis/credentials"
    echo "  2. Create OAuth 2.0 Client ID (Web application)"
    echo "  3. Add authorized redirect URI:"
    echo "     https://yourdomain.com/auth/google/callback"
    echo "  4. Copy the Client ID (ends with .apps.googleusercontent.com)"
    echo "  5. Add to .env: GOOGLE_CLIENT_ID=your_client_id"
    echo ""
fi

if [ "$HAS_CLIENT_SECRET" -eq "0" ]; then
    print_error "GOOGLE_CLIENT_SECRET is not properly configured"
    echo ""
    print_info "To fix this:"
    echo "  1. From the same OAuth 2.0 Client in Google Cloud Console"
    echo "  2. Copy the Client Secret (starts with GOCSPX-)"
    echo "  3. Add to .env: GOOGLE_CLIENT_SECRET=your_client_secret"
    echo ""
fi

if [ "$HAS_REDIRECT" -eq "0" ]; then
    print_error "GOOGLE_REDIRECT_URI is not using HTTPS"
    echo ""
    print_info "To fix this:"
    echo "  1. Make sure your site uses HTTPS"
    echo "  2. Set in .env: GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback"
    echo ""
fi

# If all configured, proceed with cache clear
if [ "$HAS_CLIENT_ID" -eq "1" ] && [ "$HAS_CLIENT_SECRET" -eq "1" ] && [ "$HAS_REDIRECT" -eq "1" ]; then
    print_success "All Google OAuth variables are configured!"
    echo ""
    print_info "Clearing configuration cache..."
    
    php artisan config:clear
    php artisan cache:clear
    php artisan config:cache
    
    print_success "Cache cleared and recached"
    echo ""
    
    print_info "Restarting PHP-FPM..."
    if systemctl is-active --quiet php8.2-fpm; then
        sudo systemctl restart php8.2-fpm
        print_success "PHP-FPM 8.2 restarted"
    elif systemctl is-active --quiet php8.1-fpm; then
        sudo systemctl restart php8.1-fpm
        print_success "PHP-FPM 8.1 restarted"
    else
        print_warning "Could not find PHP-FPM service. Please restart it manually."
    fi
    
    echo ""
    print_success "✅ Google OAuth configuration has been refreshed!"
    echo ""
    print_info "Test your login at: https://yourdomain.com/login"
    
else
    print_warning "Please configure missing variables in .env file first"
    echo ""
    print_info "After updating .env, run this script again to apply changes"
fi

echo ""
print_info "For detailed setup guide, see: GOOGLE_OAUTH_SETUP.md"
