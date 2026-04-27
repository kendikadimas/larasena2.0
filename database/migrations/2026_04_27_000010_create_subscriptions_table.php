<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->string('status')->default('payment_required');
            $table->timestamp('trial_started_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('first_login_at')->nullable();
            $table->timestamp('subscription_started_at')->nullable();
            $table->timestamp('subscription_ends_at')->nullable();
            $table->unsignedInteger('monthly_amount')->default(30000);

            $table->string('xendit_invoice_id')->nullable();
            $table->string('xendit_customer_id')->nullable();
            $table->string('invoice_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('last_payment_channel')->nullable();

            $table->foreignId('updated_by_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('updated_reason')->nullable();
            $table->timestamps();

            $table->index(['status', 'subscription_ends_at']);
            $table->index(['status', 'trial_ends_at']);
            $table->index('xendit_invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
