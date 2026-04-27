<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'trial_started_at',
        'trial_ends_at',
        'first_login_at',
        'subscription_started_at',
        'subscription_ends_at',
        'monthly_amount',
        'xendit_invoice_id',
        'xendit_customer_id',
        'invoice_url',
        'paid_at',
        'last_payment_channel',
        'updated_by_admin_id',
        'updated_reason',
    ];

    protected function casts(): array
    {
        return [
            'trial_started_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'first_login_at' => 'datetime',
            'subscription_started_at' => 'datetime',
            'subscription_ends_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function updatedByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_admin_id');
    }

    public function isTrialActive(): bool
    {
        return $this->status === 'trial' && $this->trial_ends_at?->isFuture();
    }

    public function isSubscriptionActive(): bool
    {
        return $this->status === 'active' && $this->subscription_ends_at?->isFuture();
    }

    public function isPaymentRequired(): bool
    {
        return !$this->isTrialActive() && !$this->isSubscriptionActive();
    }

    public function toSnapshot(): array
    {
        return [
            'plan_status' => $this->status,
            'is_trial' => $this->isTrialActive(),
            'trial_ends_at' => optional($this->trial_ends_at)?->toIso8601String(),
            'subscription_ends_at' => optional($this->subscription_ends_at)?->toIso8601String(),
            'payment_required' => $this->isPaymentRequired(),
            'invoice_url' => $this->invoice_url,
            'monthly_amount' => $this->monthly_amount,
        ];
    }
}
