<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cerpen extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'cover_image',
        'status',
    ];

    // RELATIONSHIPS

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comments::class);
    }

    public function likes()
    {
        return $this->hasMany(Likes::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
