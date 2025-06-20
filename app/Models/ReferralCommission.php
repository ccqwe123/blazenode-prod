<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferralCommission extends Model
{
    use HasFactory;
    protected $fillable = ['referrer_by', 'miner_id', 'referred_user_id','date','commission'];
    protected $casts = [
        'commission' => 'decimal:8',
    ];
    protected $hidden = ['created_at', 'updated_at'];
    protected $table = 'referral_commissions';

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_by');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    public function miner()
    {
        return $this->belongsTo(Miner::class);
    }
}
