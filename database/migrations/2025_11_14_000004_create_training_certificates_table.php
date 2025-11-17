<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_course_id')->constrained('training_courses')->onDelete('cascade');
            $table->string('certificate_number')->unique(); // Nomor sertifikat unik
            $table->timestamp('issued_at');
            $table->timestamps();
            
            $table->unique(['user_id', 'training_course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_certificates');
    }
};
