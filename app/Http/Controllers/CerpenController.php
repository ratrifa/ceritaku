<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Cerpen;
use App\Models\Comments;
use App\Models\Likes;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CerpenController extends Controller
{
    public function home(Request $request)
    {
        $userId = $request->user()->id;
        $q = trim((string) $request->query('q', ''));

        $cerpenQuery = Cerpen::query()
            ->where('status', 'published')
            ->with(['user:id,name,username'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => fn ($query) => $query->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn ($query) => $query->where('user_id', $userId),
            ]);

        if ($q !== '') {
            $cerpenQuery->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhereHas('tags', fn ($tagQuery) => $tagQuery->where('name', 'like', "%{$q}%"))
                    ->orWhereHas('user', function ($userQuery) use ($q) {
                        $userQuery->where('name', 'like', "%{$q}%")
                            ->orWhere('username', 'like', "%{$q}%");
                    });
            });
        }

        $cerpens = $cerpenQuery
            ->latest()
            ->paginate(9)
            ->withQueryString();

        $users = collect();
        $tags = collect();

        if ($q !== '') {
            $users = User::query()
                ->select(['id', 'name', 'username', 'bio', 'avatar'])
                ->where(function ($query) use ($q) {
                    $query->where('name', 'like', "%{$q}%")
                        ->orWhere('username', 'like', "%{$q}%");
                })
                ->withCount([
                    'followers',
                    'cerpens as published_stories_count' => fn ($storiesQuery) => $storiesQuery->where('status', 'published'),
                ])
                ->limit(6)
                ->get();

            $tags = Tag::query()
                ->select(['id', 'name'])
                ->where('name', 'like', "%{$q}%")
                ->withCount([
                    'cerpens as published_stories_count' => fn ($storiesQuery) => $storiesQuery->where('status', 'published'),
                ])
                ->orderByDesc('published_stories_count')
                ->limit(12)
                ->get();
        }

        return Inertia::render('home', [
            'cerpens' => $cerpens,
            'users' => $users,
            'tags' => $tags,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }

    public function readingList(Request $request)
    {
        $userId = $request->user()->id;
        $sort = (string) $request->query('sort', 'newest');

        if (! in_array($sort, ['newest', 'oldest', 'most-liked'], true)) {
            $sort = 'newest';
        }

        $cerpenQuery = Cerpen::query()
            ->join('bookmarks as user_bookmarks', function ($join) use ($userId) {
                $join->on('user_bookmarks.cerpen_id', '=', 'cerpens.id')
                    ->where('user_bookmarks.user_id', '=', $userId);
            })
            ->where(function ($query) use ($userId) {
                $query->where('cerpens.status', 'published')
                    ->orWhere('cerpens.user_id', $userId);
            })
            ->select('cerpens.*', 'user_bookmarks.created_at as bookmarked_at')
            ->with(['user:id,name,username'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->withExists([
                'likes as is_liked' => fn ($query) => $query->where('user_id', $userId),
                'bookmarks as is_bookmarked' => fn ($query) => $query->where('user_id', $userId),
            ]);

        if ($sort === 'oldest') {
            $cerpenQuery->orderBy('user_bookmarks.created_at', 'asc');
        } elseif ($sort === 'most-liked') {
            $cerpenQuery->orderByDesc('likes_count')->orderByDesc('user_bookmarks.created_at');
        } else {
            $cerpenQuery->orderByDesc('user_bookmarks.created_at');
        }

        $cerpens = $cerpenQuery
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('reading-list', [
            'cerpens' => $cerpens,
            'filters' => [
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cerpens = Cerpen::query()
            ->where('user_id', $request->user()->id)
            ->with('tags:id,name')
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->latest()
            ->get(['id', 'title', 'slug', 'content', 'status', 'created_at']);

        return Inertia::render('cerpen/index', [
            'cerpens' => $cerpens,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:20'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'tags' => ['nullable', 'string', 'max:255'],
        ]);

        $slug = $this->generateUniqueSlug($validated['title']);

        $cerpen = Cerpen::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $validated['content'],
            'status' => $validated['status'],
        ]);

        $this->syncTags($cerpen, $validated['tags'] ?? null);

        return redirect()
            ->route('cerpen.index')
            ->with('success', 'Cerpen berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cerpen = Cerpen::query()
            ->where('slug', $id)
            ->with(['user:id,name,username', 'tags:id,name'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->firstOrFail();

        if (! Gate::allows('view', $cerpen)) {
            abort(404);
        }

        $user = request()->user();

        if ($cerpen->status === 'published') {
            $cerpen->increment('views_count');
            $cerpen->refresh();
        }

        $comments = Comments::query()
            ->where('cerpen_id', $cerpen->id)
            ->whereNull('parent_id')
            ->with([
                'user:id,name,username',
                'replies' => fn ($query) => $query
                    ->with('user:id,name,username')
                    ->latest(),
            ])
            ->latest()
            ->get();

        $isLiked = Likes::query()
            ->where('cerpen_id', $cerpen->id)
            ->when($user, fn ($query) => $query->where('user_id', $user->id), fn ($query) => $query->whereRaw('1 = 0'))
            ->exists();

        $isBookmarked = Bookmark::query()
            ->where('cerpen_id', $cerpen->id)
            ->when($user, fn ($query) => $query->where('user_id', $user->id), fn ($query) => $query->whereRaw('1 = 0'))
            ->exists();

        return Inertia::render('cerpen/show', [
            'cerpen' => $cerpen,
            'comments' => $comments,
            'isLiked' => $isLiked,
            'isBookmarked' => $isBookmarked,
            'canManage' => $user ? Gate::allows('update', $cerpen) : false,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cerpen $cerpen)
    {
        $this->authorize('update', $cerpen);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:20'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'tags' => ['nullable', 'string', 'max:255'],
        ]);

        $cerpen->update([
            'title' => $validated['title'],
            'slug' => $this->generateUniqueSlug($validated['title'], $cerpen->id),
            'content' => $validated['content'],
            'status' => $validated['status'],
        ]);

        $this->syncTags($cerpen, $validated['tags'] ?? null);

        return redirect()
            ->route('cerpen.index')
            ->with('success', 'Cerpen berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cerpen = Cerpen::query()->findOrFail($id);
        $this->authorize('delete', $cerpen);

        $cerpen->delete();

        return redirect()
            ->route('cerpen.index')
            ->with('success', 'Cerpen berhasil dihapus.');
    }

    public function toggleLike(Request $request, Cerpen $cerpen)
    {
        $this->ensureCanInteractWithCerpen($request, $cerpen);

        $like = Likes::query()
            ->where('user_id', $request->user()->id)
            ->where('cerpen_id', $cerpen->id)
            ->first();

        if ($like) {
            $like->delete();
        } else {
            Likes::query()->create([
                'user_id' => $request->user()->id,
                'cerpen_id' => $cerpen->id,
            ]);
        }

        return back();
    }

    public function toggleBookmark(Request $request, Cerpen $cerpen)
    {
        $this->ensureCanInteractWithCerpen($request, $cerpen);

        $bookmark = Bookmark::query()
            ->where('user_id', $request->user()->id)
            ->where('cerpen_id', $cerpen->id)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
        } else {
            Bookmark::query()->create([
                'user_id' => $request->user()->id,
                'cerpen_id' => $cerpen->id,
            ]);
        }

        return back();
    }

    public function storeComment(Request $request, Cerpen $cerpen)
    {
        $this->ensureCanInteractWithCerpen($request, $cerpen);

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:2', 'max:2000'],
            'parent_id' => ['nullable', 'integer', Rule::exists('comments', 'id')],
        ]);

        if (! empty($validated['parent_id'])) {
            $isParentInSameCerpen = Comments::query()
                ->where('id', $validated['parent_id'])
                ->where('cerpen_id', $cerpen->id)
                ->exists();

            if (! $isParentInSameCerpen) {
                return back()->withErrors(['content' => 'Komentar induk tidak valid.']);
            }
        }

        Comments::query()->create([
            'user_id' => $request->user()->id,
            'cerpen_id' => $cerpen->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    public function destroyComment(Request $request, Cerpen $cerpen, Comments $comment)
    {
        $this->ensureCanInteractWithCerpen($request, $cerpen);

        if ($comment->cerpen_id !== $cerpen->id) {
            abort(404);
        }

        $this->authorize('delete', $comment);

        $comment->delete();

        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    private function generateUniqueSlug(string $title, ?int $exceptId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : 'cerpen';
        $counter = 2;

        while (
            Cerpen::query()
                ->where('slug', $slug)
                ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
                ->exists()
        ) {
            $slug = ($baseSlug !== '' ? $baseSlug : 'cerpen').'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function syncTags(Cerpen $cerpen, ?string $rawTags): void
    {
        if ($rawTags === null || trim($rawTags) === '') {
            $cerpen->tags()->sync([]);

            return;
        }

        $names = collect(explode(',', $rawTags))
            ->map(fn (string $tag) => trim(Str::lower($tag)))
            ->filter()
            ->unique()
            ->take(8)
            ->values();

        $tagIds = $names->map(function (string $name) {
            return Tag::query()->firstOrCreate(['name' => $name])->id;
        });

        $cerpen->tags()->sync($tagIds->all());
    }

    private function ensureCanInteractWithCerpen(Request $request, Cerpen $cerpen): void
    {
        if (! Gate::forUser($request->user())->allows('view', $cerpen)) {
            abort(404);
        }
    }
}
