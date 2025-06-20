<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'total_points',
        'wallet_address',
        'role',
        'avatar',
        'referral_code',
        'referred_by',
        'ip_address',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function miners()
    {
        return $this->hasMany(Miner::class);
    }

    public function points()
    {
        return $this->hasMany(Point::class);
    }

    public function referredUsers()
    {
        return $this->hasMany(User::class, 'referred_by');
    }
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referralCommissions()
    {
        return $this->hasMany(ReferralCommission::class, 'referred_user_id');
    }

    public function miningSessions()
    {
        return $this->hasMany(MiningSession::class);
    }

    public function referralsMade()
    {
        return $this->hasMany(Referral::class, 'referrer_by');
    }

    public function referredBy()
    {
        return $this->hasOne(Referral::class, 'referred_user_id');
    }
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }
}
