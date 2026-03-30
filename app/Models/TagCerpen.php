<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TagCerpen extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'cerpen_id',
        'tag_id',
    ];
}
