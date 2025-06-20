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
        Schema::create('referral_commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_by')->constrained('users')->onDelete('cascade'); // The one who gets paid
            $table->foreignId('referred_user_id')->constrained('users')->onDelete('cascade'); // The miner
            $table->foreignId('miner_id')->nullable()->constrained()->onDelete('set null'); // Optional
            $table->decimal('commission', 18, 8);
            $table->date('date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_commissions');
    }
};
