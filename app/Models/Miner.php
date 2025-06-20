<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Miner extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'mining_started_at',
        'mining_ends_at',
        'name',
        'node_id',
        'level',
        'mining_speed',
        'ip_address',
        'is_free',
        'is_mining',
        'is_active',
        'earned_points',
        'last_updated_at',
    ];
    protected $casts = [
        'mining_started_at' => 'datetime',
        'mining_ends_at' => 'datetime',
    ];
    protected $hidden = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function points()
    {
        return $this->hasMany(Point::class);
    }

    public function getIsMiningAttribute(): bool
    {
        return $this->mining_ends_at && now()->lt($this->mining_ends_at);
    }
    public function miningSessions()
    {
        return $this->hasMany(MiningSession::class);
    }
}
