<?php

namespace App\Policies;

use App\Models\Comments;
use App\Models\User;

class CommentsPolicy
{
    public function delete(User $user, Comments $comment): bool
    {
        return $user->id === $comment->user_id;
    }
}
