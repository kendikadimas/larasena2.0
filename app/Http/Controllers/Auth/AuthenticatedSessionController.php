<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if ($user && $user->role !== 'Admin') {
            $subscription = Subscription::query()->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'status' => 'payment_required',
                    'monthly_amount' => (int) config('services.xendit.default_amount', 30000),
                ]
            );

            if (!$subscription->first_login_at) {
                $now = now();
                $subscription->update([
                    'first_login_at' => $now,
                    'trial_started_at' => $now,
                    'trial_ends_at' => $now->copy()->addDays(3),
                    'status' => 'trial',
                    'monthly_amount' => (int) config('services.xendit.default_amount', 30000),
                ]);
            }
        }
        
        // ✅ Redirect berdasarkan role dengan route name yang benar
        return match ($user->role) {
            'Admin' => redirect()->intended(route('admin.dashboard')),
            'Convection' => redirect()->intended(route('konveksi.dashboard')),
            'General' => redirect()->intended(route('dashboard')),
            default => redirect()->intended(route('dashboard')),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}