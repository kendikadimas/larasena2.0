<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class XenditWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $callbackToken = $request->header('x-callback-token');
        $expectedToken = config('services.xendit.callback_token');

        if (!$expectedToken || !hash_equals($expectedToken, (string) $callbackToken)) {
            return response()->json(['message' => 'Invalid callback token.'], 403);
        }

        $invoiceId = (string) $request->input('id');
        $status = strtoupper((string) $request->input('status'));

        if (!$invoiceId || !$status) {
            return response()->json(['message' => 'Invalid payload.'], 422);
        }

        DB::transaction(function () use ($request, $invoiceId, $status): void {
            $subscription = Subscription::query()
                ->where('xendit_invoice_id', $invoiceId)
                ->lockForUpdate()
                ->first();

            if (!$subscription) {
                return;
            }

            $paidAt = $request->input('paid_at') ? Carbon::parse($request->input('paid_at')) : now();
            $existingStatus = $subscription->status;
            $paymentMethod = (string) ($request->input('payment_method') ?: $request->input('payment_channel') ?: 'xendit');

            if (in_array($status, ['PAID', 'SETTLED'], true)) {
                if ($existingStatus === 'active' && $subscription->paid_at?->equalTo($paidAt)) {
                    return;
                }

                $subscription->update([
                    'status' => 'active',
                    'subscription_started_at' => $paidAt,
                    'subscription_ends_at' => $paidAt->copy()->addDays(30),
                    'paid_at' => $paidAt,
                    'last_payment_channel' => $paymentMethod,
                    'invoice_url' => $request->input('invoice_url', $subscription->invoice_url),
                ]);

                return;
            }

            if (in_array($status, ['EXPIRED', 'FAILED'], true)) {
                $subscription->update([
                    'status' => 'payment_required',
                    'last_payment_channel' => $paymentMethod,
                ]);
            }
        });

        return response()->json(['ok' => true]);
    }
}
