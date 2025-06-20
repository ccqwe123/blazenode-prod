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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->nullable()->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('wallet_address')->unique()->nullable();
            $table->text('avatar')->nullable();
            $table->enum('role', ['user', 'god','commission'])->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->decimal('total_points', 18, 8)->default(0);
            $table->string('referral_code', 6)->nullable()->unique();
            $table->foreignId('referred_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('completed_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
