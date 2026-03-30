<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name'];

    public function cerpens()
    {
        return $this->belongsToMany(Cerpen::class, 'tag_cerpens', 'tag_id', 'cerpen_id');
    }
}
