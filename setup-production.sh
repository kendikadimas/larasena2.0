#!/bin/bash
# Run this script on your production server to set up scripts
# Usage: bash setup-production.sh

echo "🔧 Setting up Larasena production scripts..."
echo ""

# Make scripts executable
chmod +x deploy.sh
chmod +x fix-google-oauth.sh

echo "✅ Scripts are now executable"
echo ""
echo "Available commands:"
echo "  - bash deploy.sh          : Full deployment"
echo "  - bash fix-google-oauth.sh : Fix Google OAuth config"
echo ""
echo "📖 Documentation files available:"
echo "  - FIX_GOOGLE_OAUTH_ERROR.md"
echo "  - GOOGLE_OAUTH_SETUP.md"
echo "  - DEPLOYMENT_CHECKLIST.md"
echo "  - CHEATSHEET.md"
echo ""
