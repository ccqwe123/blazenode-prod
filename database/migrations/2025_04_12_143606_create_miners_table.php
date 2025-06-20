<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('miners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('node_id', 60)->unique();
            $table->string('ip_address')->nullable()->unique();
            $table->integer('level')->default(1);
            $table->decimal('mining_speed', 8, 2);
            $table->timestamp('mining_started_at')->nullable();
            $table->timestamp('mining_ends_at')->nullable();
            $table->boolean('is_mining')->default(false);
            $table->boolean('is_active')->default(false);
            $table->boolean('is_free')->default(false);
            $table->decimal('earned_points', 18, 8)->default(0);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('miners');
    }
};
