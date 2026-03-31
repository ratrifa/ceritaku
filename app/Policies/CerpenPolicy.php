<?php

namespace App\Policies;

use App\Models\Cerpen;
use App\Models\User;

class CerpenPolicy
{
    public function view(?User $user, Cerpen $cerpen): bool
    {
        if ($cerpen->status === 'published') {
            return true;
        }

        return $user?->id === $cerpen->user_id;
    }

    public function update(User $user, Cerpen $cerpen): bool
    {
        return $user->id === $cerpen->user_id;
    }

    public function delete(User $user, Cerpen $cerpen): bool
    {
        return $user->id === $cerpen->user_id;
    }
}
