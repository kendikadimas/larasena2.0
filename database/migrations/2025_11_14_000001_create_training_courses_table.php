<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('level', ['dasar', 'menengah', 'lanjutan']);
            $table->string('thumbnail')->nullable();
            $table->integer('duration_minutes')->default(0); // Durasi estimasi dalam menit
            $table->integer('total_lessons')->default(0);
            $table->boolean('is_published')->default(false);
            $table->integer('order')->default(0); // Urutan tampilan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_courses');
    }
};
