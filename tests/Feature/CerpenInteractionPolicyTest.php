<?php

use App\Models\Bookmark;
use App\Models\Cerpen;
use App\Models\Comments;
use App\Models\Likes;
use App\Models\User;
use Illuminate\Support\Str;

function makeCerpen(User $owner, string $status = 'draft'): Cerpen
{
    return Cerpen::query()->create([
        'user_id' => $owner->id,
        'title' => fake()->sentence(4),
        'slug' => Str::slug(fake()->unique()->sentence(3)),
        'content' => fake()->paragraphs(2, true),
        'status' => $status,
    ]);
}

test('non owner cannot like bookmark or comment a draft cerpen', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $draftCerpen = makeCerpen($owner, 'draft');

    $this->actingAs($otherUser)
        ->post(route('cerpen.like.toggle', $draftCerpen->id))
        ->assertNotFound();

    $this->actingAs($otherUser)
        ->post(route('cerpen.bookmark.toggle', $draftCerpen->id))
        ->assertNotFound();

    $this->actingAs($otherUser)
        ->post(route('cerpen.comments.store', $draftCerpen->id), [
            'content' => 'Komentar ini seharusnya ditolak.',
        ])
        ->assertNotFound();

    expect(Likes::query()->where('cerpen_id', $draftCerpen->id)->count())->toBe(0)
        ->and(Bookmark::query()->where('cerpen_id', $draftCerpen->id)->count())->toBe(0)
        ->and(Comments::query()->where('cerpen_id', $draftCerpen->id)->count())->toBe(0);
});

test('owner can like bookmark and comment their own draft cerpen', function () {
    $owner = User::factory()->create();
    $draftCerpen = makeCerpen($owner, 'draft');

    $this->actingAs($owner)
        ->post(route('cerpen.like.toggle', $draftCerpen->id))
        ->assertRedirect();

    $this->actingAs($owner)
        ->post(route('cerpen.bookmark.toggle', $draftCerpen->id))
        ->assertRedirect();

    $this->actingAs($owner)
        ->post(route('cerpen.comments.store', $draftCerpen->id), [
            'content' => 'Saya pemilik cerpen ini.',
        ])
        ->assertRedirect();

    expect(Likes::query()->where('user_id', $owner->id)->where('cerpen_id', $draftCerpen->id)->exists())->toBeTrue()
        ->and(Bookmark::query()->where('user_id', $owner->id)->where('cerpen_id', $draftCerpen->id)->exists())->toBeTrue()
        ->and(Comments::query()->where('user_id', $owner->id)->where('cerpen_id', $draftCerpen->id)->exists())->toBeTrue();
});

test('authenticated users can interact with published cerpen', function () {
    $owner = User::factory()->create();
    $reader = User::factory()->create();
    $publishedCerpen = makeCerpen($owner, 'published');

    $this->actingAs($reader)
        ->post(route('cerpen.like.toggle', $publishedCerpen->id))
        ->assertRedirect();

    $this->actingAs($reader)
        ->post(route('cerpen.bookmark.toggle', $publishedCerpen->id))
        ->assertRedirect();

    $this->actingAs($reader)
        ->post(route('cerpen.comments.store', $publishedCerpen->id), [
            'content' => 'Cerpennya bagus, lanjutkan!',
        ])
        ->assertRedirect();

    expect(Likes::query()->where('user_id', $reader->id)->where('cerpen_id', $publishedCerpen->id)->exists())->toBeTrue()
        ->and(Bookmark::query()->where('user_id', $reader->id)->where('cerpen_id', $publishedCerpen->id)->exists())->toBeTrue()
        ->and(Comments::query()->where('user_id', $reader->id)->where('cerpen_id', $publishedCerpen->id)->exists())->toBeTrue();
});

test('non owner cannot delete comment on draft cerpen even if comment exists', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $draftCerpen = makeCerpen($owner, 'draft');

    $comment = Comments::query()->create([
        'user_id' => $otherUser->id,
        'cerpen_id' => $draftCerpen->id,
        'content' => 'Komentar legacy pada draft.',
    ]);

    $this->actingAs($otherUser)
        ->delete(route('cerpen.comments.destroy', [
            'cerpen' => $draftCerpen->id,
            'comment' => $comment->id,
        ]))
        ->assertNotFound();

    expect(Comments::query()->whereKey($comment->id)->exists())->toBeTrue();
});
