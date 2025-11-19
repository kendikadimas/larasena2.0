<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_course_id')->constrained('training_courses')->onDelete('cascade');
            $table->foreignId('training_lesson_id')->constrained('training_lessons')->onDelete('cascade');
            $table->json('canvas_work')->nullable(); // Menyimpan hasil kerja canvas user
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'training_lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_progress');
    }
};
