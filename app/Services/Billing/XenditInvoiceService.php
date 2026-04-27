<?php

namespace App\Services\Billing;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class XenditInvoiceService
{
    /**
     * @throws RequestException
     */
    public function createInvoice(User $user, Subscription $subscription): array
    {
        $secretKey = config('services.xendit.secret_key');
        $baseUrl = rtrim(config('services.xendit.base_url', 'https://api.xendit.co'), '/');

        if (empty($secretKey)) {
            throw new \RuntimeException('Xendit secret key belum dikonfigurasi.');
        }

        $amount = (int) ($subscription->monthly_amount ?: config('services.xendit.default_amount', 30000));
        $externalId = sprintf('subscription-%d-%d', $user->id, now()->timestamp);

        $payload = [
            'external_id' => $externalId,
            'amount' => $amount,
            'description' => 'Langganan Larasena 30 hari',
            'currency' => config('services.xendit.currency', 'IDR'),
            'invoice_duration' => (int) config('services.xendit.invoice_expiry_seconds', 86400),
            'customer' => [
                'given_names' => $user->name,
                'email' => $user->email,
            ],
            'success_redirect_url' => route('billing.required', ['paid' => 1]),
            'failure_redirect_url' => route('billing.required'),
            'metadata' => [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
            ],
        ];

        $response = Http::withBasicAuth($secretKey, '')
            ->acceptJson()
            ->post($baseUrl.'/v2/invoices', $payload)
            ->throw();

        return Arr::only($response->json(), [
            'id',
            'status',
            'invoice_url',
            'paid_at',
            'payment_method',
            'external_id',
            'customer',
            'payer_email',
        ]);
    }
}
