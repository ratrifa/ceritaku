<?php

namespace App\Http\Controllers;

use App\Models\Cerpen;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(Request $request, string $username): Response
    {
        $profileUser = Cache::remember("public-profile:{$username}", now()->addMinutes(5), function () use ($username) {
            return User::query()
                ->select(['id', 'name', 'username', 'bio', 'avatar', 'created_at'])
                ->where('username', $username)
                ->withCount([
                    'followers',
                    'following',
                    'cerpens as published_stories_count' => fn ($query) => $query->where('status', 'published'),
                ])
                ->withSum([
                    'cerpens as total_views_count' => fn ($query) => $query->where('status', 'published'),
                ], 'views_count')
                ->firstOrFail();
        });

        $stories = Cerpen::query()
            ->select(['id', 'user_id', 'title', 'slug', 'content', 'created_at', 'views_count'])
            ->where('user_id', $profileUser->id)
            ->where('status', 'published')
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(8)
            ->withQueryString();

        $topStories = Cerpen::query()
            ->select(['id', 'title', 'slug', 'views_count'])
            ->where('user_id', $profileUser->id)
            ->where('status', 'published')
            ->withCount('likes')
            ->orderByDesc('likes_count')
            ->orderByDesc('views_count')
            ->limit(3)
            ->get();

        $authUser = $request->user();
        $isFollowing = false;

        if ($authUser && $authUser->id !== $profileUser->id) {
            $isFollowing = $authUser->following()
                ->where('following_id', $profileUser->id)
                ->exists();
        }

        return Inertia::render('users/show', [
            'profileUser' => $profileUser,
            'stories' => $stories,
            'topStories' => $topStories,
            'isFollowing' => $isFollowing,
        ]);
    }

    public function toggleFollow(Request $request, User $user): RedirectResponse|JsonResponse
    {
        $authUser = $request->user();

        if ($authUser->id === $user->id) {
            abort(422, 'You cannot follow yourself.');
        }

        $existing = $authUser->following()
            ->where('following_id', $user->id)
            ->exists();

        if ($existing) {
            $authUser->following()->detach($user->id);
            $isFollowing = false;
        } else {
            $authUser->following()->syncWithoutDetaching([$user->id]);
            $isFollowing = true;
        }

        Cache::forget("public-profile:{$user->username}");

        if ($request->expectsJson()) {
            return response()->json([
                'is_following' => $isFollowing,
                'followers_count' => $user->followers()->count(),
            ]);
        }

        return back()->with('success', $isFollowing ? 'Berhasil follow user.' : 'Berhasil unfollow user.');
    }
}
