<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first general user
        $user = User::where('role', 'General')->first();

        if (!$user) {
            $this->command->warn('No General user found. Please create a user first.');
            return;
        }

        $badges = [
            [
                'badge_key' => 'first_design',
                'badge_name' => 'Desain Pertama',
                'badge_icon' => 'star',
                'meta' => ['description' => 'Membuat desain motif batik pertama']
            ],
            [
                'badge_key' => 'first_publish',
                'badge_name' => 'Publisher Pemula',
                'badge_icon' => 'award',
                'meta' => ['description' => 'Mempublikasikan motif pertama ke galeri']
            ],
            [
                'badge_key' => 'popular_creator',
                'badge_name' => 'Kreator Populer',
                'badge_icon' => 'heart',
                'meta' => ['description' => 'Mendapat 50+ likes pada motif']
            ],
            [
                'badge_key' => 'design_master',
                'badge_name' => 'Master Desain',
                'badge_icon' => 'trophy',
                'meta' => ['description' => 'Membuat 10+ desain motif batik']
            ],
            [
                'badge_key' => 'early_adopter',
                'badge_name' => 'Early Adopter',
                'badge_icon' => 'zap',
                'meta' => ['description' => 'Pengguna awal Larasena']
            ]
        ];

        foreach ($badges as $badge) {
            UserBadge::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'badge_key' => $badge['badge_key']
                ],
                [
                    'badge_name' => $badge['badge_name'],
                    'badge_icon' => $badge['badge_icon'],
                    'meta' => $badge['meta'],
                    'awarded_at' => now()->subDays(rand(1, 30))
                ]
            );
        }

        $this->command->info('Sample badges created for user: ' . $user->name);
    }
}
