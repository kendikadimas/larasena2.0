<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_course_id')->constrained('training_courses')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('content')->nullable(); // Konten teks/instruksi
            $table->string('video_url')->nullable(); // URL video tutorial
            $table->enum('type', ['theory', 'practice', 'quiz'])->default('theory');
            $table->json('canvas_data')->nullable(); // Data untuk canvas exercise (tools, motifs, instructions)
            $table->integer('duration')->default(15); // Durasi dalam menit
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_lessons');
    }
};
