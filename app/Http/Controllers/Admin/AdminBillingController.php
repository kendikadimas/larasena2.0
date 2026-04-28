<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminBillingController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $statusFilter = $request->input('status', 'all');

        $query = User::where('role', '!=', 'Admin')
            ->with('subscription')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });

        // Filter by subscription status
        if ($statusFilter && $statusFilter !== 'all') {
            if ($statusFilter === 'none') {
                $query->doesntHave('subscription');
            } else {
                $query->whereHas('subscription', function ($q) use ($statusFilter) {
                    $q->where('status', $statusFilter);
                });
            }
        }

        $users = $query->latest()->paginate(20)->withQueryString();

        // Stats
        $stats = [
            'active'   => Subscription::where('status', 'active')
                ->where('subscription_ends_at', '>', now())
                ->count(),
            'trial'    => Subscription::where('status', 'trial')
                ->where('trial_ends_at', '>', now())
                ->count(),
            'expired'  => Subscription::where('status', 'payment_required')->count(),
            'no_sub'   => User::where('role', '!=', 'Admin')->doesntHave('subscription')->count(),
        ];

        return Inertia::render('Admin/Billing/Index', [
            'users'   => $users,
            'stats'   => $stats,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
        ]);
    }

    public function updateSubscription(Request $request, User $user)
    {
        abort_if($user->role === 'Admin', 422, 'Admin tidak membutuhkan status langganan.');

        $validated = $request->validate([
            'status'                => ['required', Rule::in(['trial', 'active', 'payment_required'])],
            'trial_ends_at'         => ['nullable', 'date'],
            'subscription_ends_at'  => ['nullable', 'date'],
            'updated_reason'        => ['nullable', 'string', 'max:500'],
        ]);

        $now = now();

        $subscription = Subscription::firstOrCreate(
            ['user_id' => $user->id],
            ['monthly_amount' => (int) config('services.xendit.default_amount', 30000)]
        );

        $status = $validated['status'];

        $payload = [
            'status'              => $status,
            'updated_by_admin_id' => $request->user()->id,
            'updated_reason'      => $validated['updated_reason'] ?? 'Diatur manual oleh admin',
        ];

        if ($status === 'trial') {
            $payload['trial_started_at']        = $subscription->trial_started_at ?: $now;
            $payload['trial_ends_at']            = $validated['trial_ends_at'] ?? $now->copy()->addDays(3);
            $payload['subscription_started_at']  = null;
            $payload['subscription_ends_at']     = null;
            $payload['paid_at']                  = null;
        }

        if ($status === 'active') {
            $payload['subscription_started_at'] = $subscription->subscription_started_at ?: $now;
            $payload['subscription_ends_at']    = $validated['subscription_ends_at'] ?? $now->copy()->addDays(30);
            $payload['paid_at']                 = $subscription->paid_at ?: $now;
        }

        if ($status === 'payment_required') {
            $payload['trial_ends_at']           = $validated['trial_ends_at'] ?? $subscription->trial_ends_at;
            $payload['subscription_ends_at']    = $validated['subscription_ends_at'] ?? $subscription->subscription_ends_at;
        }

        $subscription->update($payload);

        return back()->with('success', "Status langganan {$user->name} berhasil diperbarui menjadi {$status}.");
    }
}
