<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('motif_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('published_motif_id')->constrained('published_motifs')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'published_motif_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('motif_likes');
    }
};
