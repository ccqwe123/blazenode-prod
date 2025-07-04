<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyCheckIn extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'check_in_date'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
