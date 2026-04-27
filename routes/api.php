<?php

use App\Http\Controllers\Api\XenditWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/xendit/webhook/invoice', XenditWebhookController::class)->name('api.xendit.webhook.invoice');
