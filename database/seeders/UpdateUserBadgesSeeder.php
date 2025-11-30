<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateUserBadgesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update all existing users with default badge based on role
        User::whereNull('badge')->orWhere('badge', '')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $badge = match($user->role) {
                    'Convection' => 'boutique',
                    default => 'community',
                };
                
                $user->update(['badge' => $badge]);
            }
        });

        $this->command->info('User badges updated successfully!');
    }
}
