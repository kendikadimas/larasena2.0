<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('badge_key');
            $table->string('badge_name');
            $table->string('badge_icon')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('awarded_at');
            $table->timestamps();

            $table->unique(['user_id', 'badge_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_badges');
    }
};
