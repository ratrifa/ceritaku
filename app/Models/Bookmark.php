<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = ['user_id', 'cerpen_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cerpen()
    {
        return $this->belongsTo(Cerpen::class, 'cerpen_id');
    }
}
