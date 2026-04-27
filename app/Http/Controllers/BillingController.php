<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\Billing\XenditInvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    private function roleHomeRoute(string $role): string
    {
        return match ($role) {
            'Convection' => 'konveksi.dashboard',
            'Admin' => 'admin.dashboard',
            default => 'dashboard',
        };
    }

    public function required(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user && $user->role !== 'Admin', 403);

        $subscription = $user->subscription;

        return Inertia::render('Billing/Required', [
            'subscription' => $subscription?->toSnapshot(),
            'message' => session('success') ?: session('error'),
        ]);
    }

    public function createInvoice(Request $request, XenditInvoiceService $xenditInvoiceService): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user && $user->role !== 'Admin', 403);

        $subscription = Subscription::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'status' => 'payment_required',
                'monthly_amount' => (int) config('services.xendit.default_amount', 30000),
            ]
        );

        if ($subscription->isTrialActive() || $subscription->isSubscriptionActive()) {
            return back()->with('success', 'Langganan kamu masih aktif.');
        }

        try {
            $invoice = $xenditInvoiceService->createInvoice($user, $subscription);

            $subscription->update([
                'status' => 'payment_required',
                'xendit_invoice_id' => $invoice['id'] ?? $subscription->xendit_invoice_id,
                'xendit_customer_id' => data_get($invoice, 'customer.reference_id') ?: $subscription->xendit_customer_id,
                'invoice_url' => $invoice['invoice_url'] ?? $subscription->invoice_url,
            ]);

            return back()->with('success', 'Invoice berhasil dibuat.');
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'Gagal membuat invoice, silakan coba lagi.');
        }
    }

    public function payNow(Request $request, XenditInvoiceService $xenditInvoiceService): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user && $user->role !== 'Admin', 403);

        $subscription = Subscription::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'status' => 'payment_required',
                'monthly_amount' => (int) config('services.xendit.default_amount', 30000),
            ]
        );

        if ($subscription->isTrialActive() || $subscription->isSubscriptionActive()) {
            return redirect()->route($this->roleHomeRoute($user->role));
        }

        if (!empty($subscription->invoice_url)) {
            return redirect()->away($subscription->invoice_url);
        }

        try {
            $invoice = $xenditInvoiceService->createInvoice($user, $subscription);

            $subscription->update([
                'status' => 'payment_required',
                'xendit_invoice_id' => $invoice['id'] ?? $subscription->xendit_invoice_id,
                'xendit_customer_id' => data_get($invoice, 'customer.reference_id') ?: $subscription->xendit_customer_id,
                'invoice_url' => $invoice['invoice_url'] ?? $subscription->invoice_url,
            ]);

            if (!empty($invoice['invoice_url'])) {
                return redirect()->away($invoice['invoice_url']);
            }

            return back()->with('error', 'Invoice berhasil dibuat namun URL pembayaran tidak tersedia.');
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'Gagal membuka metode pembayaran, silakan coba lagi.');
        }
    }

    public function status(Request $request)
    {
        $user = $request->user();

        abort_unless($user && $user->role !== 'Admin', 403);

        $subscription = $user->subscription;

        return response()->json([
            'ok' => true,
            'subscription' => $subscription?->toSnapshot(),
        ]);
    }
}
