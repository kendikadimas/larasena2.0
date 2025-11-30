# Setup Google OAuth Login

## 1. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan **Google+ API**

## 2. Buat OAuth 2.0 Credentials

1. Pergi ke **APIs & Services** > **Credentials**
2. Klik **Create Credentials** > **OAuth client ID**
3. Pilih **Web application**
4. Isi form:
   - **Name**: Larasena App
   - **Authorized JavaScript origins**: 
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
   - **Authorized redirect URIs**:
     - `http://localhost:8000/auth/google/callback`
     - `http://127.0.0.1:8000/auth/google/callback`
5. Klik **Create**
6. Copy **Client ID** dan **Client Secret**

## 3. Konfigurasi .env

Tambahkan ke file `.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## 4. Test Login

1. Jalankan server: `php artisan serve`
2. Buka halaman login
3. Klik tombol "Masuk dengan Google"
4. Pilih akun Google
5. User akan otomatis terdaftar dengan:
   - Role: General
   - Badge: Community
   - Email verified: Yes
   - Password: Random (tidak digunakan untuk OAuth)

## Fitur Google OAuth

✅ Auto-create user jika belum terdaftar
✅ Auto-login jika user sudah ada
✅ Email otomatis terverifikasi
✅ Badge community untuk user baru
✅ Profile photo dari Google Avatar
✅ Redirect ke dashboard sesuai role

## Production Setup

Untuk production, tambahkan domain production ke:
- Authorized JavaScript origins
- Authorized redirect URIs

Contoh:
```
https://yourdomain.com
https://yourdomain.com/auth/google/callback
```
