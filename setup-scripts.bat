@echo off
REM Windows batch script to set execute permissions on deployment scripts
REM This is for development reference only - actual permission setting happens on Linux server

echo.
echo ====================================
echo  Larasena Deployment Scripts Setup
echo ====================================
echo.
echo This is a reference script for Windows development.
echo.
echo On your Linux production server, run these commands:
echo.
echo chmod +x deploy.sh
echo chmod +x fix-google-oauth.sh
echo.
echo Then you can run:
echo   bash deploy.sh
echo   bash fix-google-oauth.sh
echo.
echo ====================================
echo  Files Created:
echo ====================================
echo.
echo [Documentation]
echo   - FIX_GOOGLE_OAUTH_ERROR.md (Main error fix guide)
echo   - GOOGLE_OAUTH_SETUP.md (Complete OAuth setup)
echo   - DEPLOYMENT_CHECKLIST.md (Full deployment guide)
echo   - CHEATSHEET.md (Quick commands reference)
echo   - .env.example (Environment template)
echo.
echo [Scripts]
echo   - deploy.sh (Automated deployment)
echo   - fix-google-oauth.sh (Fix OAuth config)
echo.
echo ====================================
echo  Quick Solution for Google OAuth Error
echo ====================================
echo.
echo Error: "Missing required parameter: client_id"
echo.
echo SSH to your server and run:
echo.
echo   cd /var/www/larasena2.0
echo   nano .env
echo.
echo Add these lines (replace with your actual values):
echo.
echo   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
echo   GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret
echo   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
echo.
echo Save and run:
echo.
echo   php artisan config:clear
echo   php artisan cache:clear
echo   php artisan config:cache
echo   sudo systemctl restart php8.2-fpm
echo   sudo systemctl restart nginx
echo.
echo Or use the automated fix script:
echo.
echo   bash fix-google-oauth.sh
echo.
echo ====================================
echo.
echo See FIX_GOOGLE_OAUTH_ERROR.md for complete guide!
echo.
pause
