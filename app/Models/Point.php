<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'miner_id', 'points','date'];
    protected $casts = [
        'points' => 'decimal:8',
    ];
    protected $hidden = ['created_at', 'updated_at'];
    protected $table = 'points';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function miner()
    {
        return $this->belongsTo(Miner::class);
    }
}
