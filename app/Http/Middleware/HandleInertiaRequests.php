<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $userData = null;
        if ($user) {
            $isNew = false;
            try {
                if ($user->created_at) {
                    $isNew = $user->created_at->diffInDays(now()) < 7;
                }
            } catch (\Throwable $e) {
                $isNew = false;
            }

            $userData = array_merge($user->toArray(), ['is_new' => $isNew]);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
        ];
    }
}
