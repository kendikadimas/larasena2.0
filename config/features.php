<?php

return [
    // Toggle temporary availability of training-related routes and navigation.
    'training' => env('FEATURE_TRAINING', false),

    // Enable subscription trial + billing enforcement rollout.
    'billing_subscription' => env('FEATURE_BILLING_SUBSCRIPTION', true),
];
