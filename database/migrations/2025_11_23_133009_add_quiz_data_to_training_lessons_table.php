<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_lessons', function (Blueprint $table) {
            $table->json('quiz_data')->nullable()->after('canvas_data');
        });
    }

    public function down(): void
    {
        Schema::table('training_lessons', function (Blueprint $table) {
            $table->dropColumn('quiz_data');
        });
    }
};
