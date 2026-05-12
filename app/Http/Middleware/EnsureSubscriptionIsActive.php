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

        $subscription = $user->subscription;

        // Jika belum punya subscription sama sekali (user lama sebelum fitur trial),
        // berikan trial 15 hari dihitung dari kapan akun dibuat.
        if (!$subscription) {
            $trialStart = $user->created_at;
            $trialEnd   = $trialStart->copy()->addDays(15);

            $subscription = Subscription::create([
                'user_id'          => $user->id,
                'status'           => $trialEnd->isFuture() ? 'trial' : 'payment_required',
                'trial_started_at' => $trialStart,
                'trial_ends_at'    => $trialEnd,
                'monthly_amount'   => (int) config('services.xendit.default_amount', 30000),
            ]);
        }

        if ($subscription->isTrialActive() || $subscription->isSubscriptionActive()) {
            return $next($request);
        }

        // Trial atau subscription sudah habis — tandai payment_required
        if ($subscription->status !== 'payment_required') {
            $subscription->update(['status' => 'payment_required']);
        }

        return redirect()
            ->route('billing.required')
            ->with('error', 'Langganan kamu sudah berakhir. Silakan lanjutkan pembayaran untuk mengakses fitur ini.');
    }
}
