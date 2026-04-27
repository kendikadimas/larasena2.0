<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');
        
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($role && $role !== 'all', function ($query, $role) {
                $query->where('role', $role);
            })
            ->with('subscription')
            ->withCount('designs')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_users' => User::count(),
            'general_users' => User::where('role', 'General')->count(),
            'convection_users' => User::where('role', 'Convection')->count(),
            'admin_users' => User::where('role', 'Admin')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in(['General', 'Convection', 'Admin'])],
        ]);

        // Auto-set badge based on role
        $badge = match($validated['role']) {
            'Convection' => 'boutique',
            default => 'community',
        };

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'badge' => $badge,
        ]);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in(['General', 'Convection', 'Admin'])],
        ]);

        // Auto-set badge when role changes
        $badge = match($validated['role']) {
            'Convection' => 'boutique',
            'Admin' => $user->badge ?? 'community',
            default => 'community',
        };

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'badge' => $badge,
        ]);

        if ($validated['password']) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        return back()->with('success', 'User berhasil diperbarui.');
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['General', 'Convection', 'Admin'])],
        ]);

        // Auto-set badge when role changes
        $badge = match($validated['role']) {
            'Convection' => 'boutique',
            'Admin' => $user->badge ?? 'community', // Keep current badge for admin
            default => 'community',
        };

        $user->update([
            'role' => $validated['role'],
            'badge' => $badge,
        ]);

        return back()->with('success', 'Role dan badge user berhasil diperbarui.');
    }

    /**
     * Update user badge
     */
    public function updateBadge(Request $request, User $user)
    {
        $validated = $request->validate([
            'badge' => 'required|in:community,boutique,artisan'
        ]);

        $user->update([
            'badge' => $validated['badge']
        ]);

        return back()->with('success', 'Badge user berhasil diupdate!');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        if ($user->role === 'Admin' && User::where('role', 'Admin')->count() <= 1) {
            return back()->with('error', 'Tidak dapat menghapus admin terakhir.');
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }

    public function updateSubscriptionTesting(Request $request, User $user)
    {
        abort_if($user->role === 'Admin', 422, 'Admin tidak membutuhkan status langganan.');

        $validated = $request->validate([
            'status' => ['required', Rule::in(['trial', 'active', 'payment_required'])],
            'trial_ends_at' => ['nullable', 'date'],
            'subscription_ends_at' => ['nullable', 'date'],
            'updated_reason' => ['nullable', 'string', 'max:255'],
        ]);

        $now = now();

        $subscription = Subscription::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['monthly_amount' => (int) config('services.xendit.default_amount', 30000)]
        );

        $status = $validated['status'];

        $payload = [
            'status' => $status,
            'updated_by_admin_id' => $request->user()->id,
            'updated_reason' => $validated['updated_reason'] ?? 'Manual override untuk testing',
        ];

        if ($status === 'trial') {
            $payload['trial_started_at'] = $subscription->trial_started_at ?: $now;
            $payload['trial_ends_at'] = $validated['trial_ends_at'] ?? $now->copy()->addDays(3);
            $payload['subscription_started_at'] = null;
            $payload['subscription_ends_at'] = null;
            $payload['paid_at'] = null;
        }

        if ($status === 'active') {
            $payload['subscription_started_at'] = $subscription->subscription_started_at ?: $now;
            $payload['subscription_ends_at'] = $validated['subscription_ends_at'] ?? $now->copy()->addDays(30);
            $payload['paid_at'] = $now;
        }

        if ($status === 'payment_required') {
            $payload['trial_ends_at'] = $validated['trial_ends_at'] ?? $subscription->trial_ends_at;
            $payload['subscription_ends_at'] = $validated['subscription_ends_at'] ?? $subscription->subscription_ends_at;
        }

        $subscription->update($payload);

        return back()->with('success', 'Status langganan user berhasil diperbarui.');
    }
}