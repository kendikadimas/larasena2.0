<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Motif;
use App\Models\Design;
use App\Models\PublishedMotif;
use App\Models\Production;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'general_users' => User::where('role', 'General')->count(),
            'convection_users' => User::where('role', 'Convection')->count(),
            'total_motifs' => Motif::count(),
            'total_canvas_elements' => Motif::count(),
            'total_gallery_published' => PublishedMotif::approved()->count(),
            'pending_moderation' => PublishedMotif::pending()->count(),
            'total_designs' => Design::count(),
            'total_transactions' => Production::count(),
            'total_revenue' => (float) Production::where('payment_status', 'paid')->sum('total_price') ?: 0,
            'production_revenue' => (float) Production::where('payment_status', 'paid')->sum('total_price') ?: 0,
            'subscription_revenue' => (float) Subscription::where('status', 'active')->sum('monthly_amount') ?: 0,
            'mrr' => (float) Subscription::where('status', 'active')->where('subscription_ends_at', '>', now())->sum('monthly_amount') ?: 0,
            'pending_transactions' => Production::where('payment_status', 'pending')->count(),
            // Billing stats
            'billing_active'  => Subscription::where('status', 'active')->where('subscription_ends_at', '>', now())->count(),
            'billing_trial'   => Subscription::where('status', 'trial')->where('trial_ends_at', '>', now())->count(),
            'billing_expired' => Subscription::where('status', 'payment_required')->count(),
            'billing_no_sub'  => User::where('role', '!=', 'Admin')->doesntHave('subscription')->count(),
        ];

        $recent_users = User::where('role', '!=', 'Admin')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        $recent_transactions = Production::with(['customer:id,name,email', 'product:id,name'])
            ->latest()
            ->take(5)
            ->get();

        
        $revenueTrend = Production::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_price) as total')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function($item) {
                return [
                    'date' => date('d M', strtotime($item->date)),
                    'total' => (float) $item->total,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_users' => $recent_users,
            'recent_transactions' => $recent_transactions,
            'revenueTrend' => $revenueTrend,
        ]);
    }
}