<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionIsActive
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('features.billing_subscription', true)) {
            return $next($request);
        }

        $user = $request->user();

        if (!$user || $user->role === 'Admin') {
            return $next($request);
        }

        if ($request->routeIs([
            'billing.*',
            'logout',
            'profile.edit',
            'profile.update',
            'profile.destroy',
            'konveksi.profile.edit',
            'konveksi.profile.update',
            'konveksi.profile.deleteDocumentation',
        ])) {
            return $next($request);
        }

        $subscription = $user->subscription ?: Subscription::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'status' => 'payment_required',
                'monthly_amount' => (int) config('services.xendit.default_amount', 30000),
            ]
        );

        if ($subscription->isTrialActive() || $subscription->isSubscriptionActive()) {
            return $next($request);
        }

        if ($subscription->status !== 'payment_required') {
            $subscription->update(['status' => 'payment_required']);
        }

        return $next($request);
    }
}
