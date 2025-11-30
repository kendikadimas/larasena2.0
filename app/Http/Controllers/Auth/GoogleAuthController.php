<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Konveksi;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user exists
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                // User exists, just login
                Auth::login($user);
                
                // Redirect based on role
                if ($user->role === 'Convection') {
                    return redirect()->route('konveksi.dashboard');
                }
                
                return redirect()->route('dashboard');
            } else {
                // User not found, redirect to register with Google data
                return redirect()->route('register')->with([
                    'info' => 'Silakan daftarkan akun terlebih dahulu untuk melanjutkan.',
                    'google_name' => $googleUser->getName(),
                    'google_email' => $googleUser->getEmail(),
                    'google_avatar' => $googleUser->getAvatar(),
                ]);
            }
            
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal login dengan Google. Silakan coba lagi.');
        }
    }
}
