<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Konveksi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
                // User not found, create new user automatically
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(uniqid()), // Random password since they use Google OAuth
                    'role' => 'General', // Default role for Google users
                    'badge' => 'community', // Default badge for General users
                    'email_verified_at' => now(), // Auto-verify since Google already verified
                ]);

                // Login the new user
                Auth::login($newUser);
                
                return redirect()->route('dashboard')->with('success', 'Akun berhasil dibuat dengan Google!');
            }
            
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal login dengan Google. Silakan coba lagi.');
        }
    }
}
