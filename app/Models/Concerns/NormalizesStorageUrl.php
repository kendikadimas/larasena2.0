<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Storage;

trait NormalizesStorageUrl
{
    protected function normalizeStorageUrl(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        // Bypass Storage::url() untuk aset hardcoded di public/images/
        if (str_starts_with(ltrim($value, '/'), 'images/')) {
            return asset(ltrim($value, '/'));
        }

        $cleanValue = str_replace(['storage/', '/storage/'], '', $value);
        $cleanValue = ltrim($cleanValue, '/');

        return Storage::url($cleanValue);
    }
}
