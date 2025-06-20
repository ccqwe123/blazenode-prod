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
        Schema::create('early_accesses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('wallet_address')->unique();
            $table->boolean('followed')->default(false);
            $table->boolean('liked')->default(false);
            $table->boolean('retweeted')->default(false);
            $table->boolean('discord')->default(false);
            $table->boolean('telegram')->default(false);
            $table->boolean('google')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index('wallet_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('early_accesses');
    }
};
