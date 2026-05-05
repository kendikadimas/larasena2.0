<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Konveksi;
use App\Models\Subscription;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in(['General', 'Convection'])],
        ]);

        // Set badge berdasarkan role
        $badge = match($request->role) {
            'Convection' => 'boutique',
            default => 'community',
        };

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'badge' => $badge,
        ]);

        event(new Registered($user));
        Auth::login($user);

        // ── Buat free trial 15 hari untuk user baru ──
        Subscription::create([
            'user_id'          => $user->id,
            'status'           => 'trial',
            'trial_started_at' => now(),
            'trial_ends_at'    => now()->addDays(15),
            'monthly_amount'   => (int) config('services.xendit.default_amount', 30000),
        ]);

        // ── Redirect ke route yang benar ──
        if ($user->role === 'Convection') {
            Konveksi::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name'        => $user->name,
                    'description' => 'Belum ada deskripsi.',
                    'location'    => 'Belum diatur',
                    'no_telp'     => '-',
                    'rating'      => 0,
                    'is_verified' => false,
                ]
            );

            return redirect()->route('konveksi.dashboard');
        }

        return redirect()->route('dashboard');
    }
}
