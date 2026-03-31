<?php

namespace Database\Seeders;

use App\Models\Bookmark;
use App\Models\Cerpen;
use App\Models\Comments;
use App\Models\Follow;
use App\Models\Likes;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    /**
     * Seed the application's database with lively demo content.
     */
    public function run(): void
    {
        $users = $this->seedUsers();
        $tags = $this->seedTags();
        $publishedCerpens = $this->seedCerpens($users, $tags);

        $this->seedFollows($users);
        $this->seedLikesAndBookmarks($users, $publishedCerpens);
        $this->seedComments($users, $publishedCerpens);
    }

    private function seedUsers(): Collection
    {
        $profiles = [
            ['name' => 'Test User', 'username' => 'testuser', 'email' => 'test@example.com'],
            ['name' => 'Alya Pratama', 'username' => 'alyawrites', 'email' => 'alya@example.com'],
            ['name' => 'Raka Mahesa', 'username' => 'rakacerita', 'email' => 'raka@example.com'],
            ['name' => 'Nara Putri', 'username' => 'narapen', 'email' => 'nara@example.com'],
            ['name' => 'Fajar Aditya', 'username' => 'fajarpena', 'email' => 'fajar@example.com'],
            ['name' => 'Kei Aruna', 'username' => 'keiaruna', 'email' => 'kei@example.com'],
            ['name' => 'Bima Langit', 'username' => 'bimalangit', 'email' => 'bima@example.com'],
            ['name' => 'Sinta Laras', 'username' => 'sintalaras', 'email' => 'sinta@example.com'],
        ];

        return collect($profiles)->map(function (array $profile) {
            return User::query()->updateOrCreate(
                ['email' => $profile['email']],
                [
                    'name' => $profile['name'],
                    'username' => $profile['username'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        });
    }

    private function seedTags(): Collection
    {
        $tagNames = [
            'romance',
            'drama',
            'slice-of-life',
            'fantasy',
            'misteri',
            'horor',
            'persahabatan',
            'keluarga',
            'komedi',
            'inspirasi',
        ];

        return collect($tagNames)->map(fn (string $name) => Tag::query()->firstOrCreate(['name' => $name]));
    }

    private function seedCerpens(Collection $users, Collection $tags): Collection
    {
        $publishedCerpens = collect();
        $storiesPerUser = 10;

        foreach ($users as $user) {
            for ($index = 1; $index <= $storiesPerUser; $index++) {
                $isDraft = $index > 8;
                $status = $isDraft ? 'draft' : 'published';
                $slug = Str::slug("{$user->username}-cerpen-{$index}");
                $title = $this->makeTitle($user->name, $index, $isDraft);

                $cerpen = Cerpen::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'user_id' => $user->id,
                        'title' => $title,
                        'content' => $this->makeBody($user->name, $index),
                        'status' => $status,
                        'views_count' => $isDraft ? 0 : fake()->numberBetween(24, 260),
                    ]
                );

                $pickedTagIds = $tags
                    ->shuffle()
                    ->take(fake()->numberBetween(2, 4))
                    ->pluck('id')
                    ->all();

                $cerpen->tags()->sync($pickedTagIds);

                if (! $isDraft) {
                    $publishedCerpens->push($cerpen);
                }
            }
        }

        return $publishedCerpens;
    }

    private function seedFollows(Collection $users): void
    {
        $count = $users->count();

        foreach ($users as $index => $user) {
            $firstTarget = $users[($index + 1) % $count];
            $secondTarget = $users[($index + 2) % $count];

            foreach ([$firstTarget, $secondTarget] as $target) {
                if ($user->id === $target->id) {
                    continue;
                }

                Follow::query()->firstOrCreate([
                    'follower_id' => $user->id,
                    'following_id' => $target->id,
                ]);
            }
        }
    }

    private function seedLikesAndBookmarks(Collection $users, Collection $publishedCerpens): void
    {
        foreach ($publishedCerpens as $cerpen) {
            foreach ($users as $user) {
                if ($user->id === $cerpen->user_id) {
                    continue;
                }

                if (fake()->boolean(48)) {
                    Likes::query()->firstOrCreate([
                        'user_id' => $user->id,
                        'cerpen_id' => $cerpen->id,
                    ]);
                }

                if (fake()->boolean(28)) {
                    Bookmark::query()->firstOrCreate([
                        'user_id' => $user->id,
                        'cerpen_id' => $cerpen->id,
                    ]);
                }
            }
        }
    }

    private function seedComments(Collection $users, Collection $publishedCerpens): void
    {
        $commentBodies = [
            'Aku suka cara kamu membangun suasana di cerita ini.',
            'Plot twist-nya dapet banget, bikin penasaran.',
            'Bahasanya ringan tapi tetap ngena.',
            'Karakternya kerasa hidup, lanjutkan ya!',
            'Ending-nya bikin mikir lama setelah baca.',
        ];

        foreach ($publishedCerpens as $cerpen) {
            $commenters = $users
                ->where('id', '!=', $cerpen->user_id)
                ->shuffle()
                ->take(fake()->numberBetween(2, 5))
                ->values();

            foreach ($commenters as $i => $commenter) {
                $content = $commentBodies[$i % count($commentBodies)];

                $comment = Comments::query()->firstOrCreate([
                    'user_id' => $commenter->id,
                    'cerpen_id' => $cerpen->id,
                    'parent_id' => null,
                    'content' => $content,
                ]);

                if (fake()->boolean(40)) {
                    $replyUser = $users->where('id', '!=', $commenter->id)->shuffle()->first();

                    if ($replyUser) {
                        Comments::query()->firstOrCreate([
                            'user_id' => $replyUser->id,
                            'cerpen_id' => $cerpen->id,
                            'parent_id' => $comment->id,
                            'content' => "Setuju, bagian ini juga favoritku.",
                        ]);
                    }
                }
            }
        }
    }

    private function makeTitle(string $authorName, int $index, bool $isDraft): string
    {
        $themes = [
            'Senja di Ujung Kota',
            'Surat yang Tak Pernah Terkirim',
            'Langkah Kecil ke Arah Pulang',
            'Ruang Tunggu Kenangan',
            'Malam Ketika Hujan Berhenti',
        ];

        $base = $themes[($index - 1) % count($themes)];

        if ($isDraft) {
            return "Draft: {$base} ({$authorName})";
        }

        return "{$base} - {$authorName}";
    }

    private function makeBody(string $authorName, int $index): string
    {
        return implode("\n\n", [
            "Di sore yang mendung, {$authorName} kembali menatap jalan lama yang pernah menjadi saksi banyak keputusan penting.",
            "Setiap langkah terasa seperti membuka lembaran yang lama tertutup, namun justru di sanalah ia menemukan alasan untuk bertahan.",
            "Cerita ini bergerak pelan, membiarkan pembaca merasakan jeda, ragu, lalu keberanian yang muncul di saat tidak terduga.",
            "Ketika malam tiba, satu hal menjadi jelas: pulang bukan selalu soal tempat, kadang itu tentang menerima diri sendiri.",
            "Catatan bagian {$index}: kisah ini masih akan berkembang, dengan konflik yang lebih dalam pada bab berikutnya.",
        ]);
    }
}
