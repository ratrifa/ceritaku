import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BookmarkCheck, Heart, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reading List',
        href: '/reading-list',
    },
];

type FeedCerpen = {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    bookmarked_at?: string;
    user: {
        id: number;
        name: string;
        username?: string | null;
    };
    likes_count: number;
    comments_count: number;
    bookmarks_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
};

type PaginatedCerpens = {
    data: FeedCerpen[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export default function ReadingListPage() {
    const { cerpens, filters } = usePage<SharedData & { cerpens: PaginatedCerpens; filters?: { sort?: 'newest' | 'oldest' | 'most-liked' } }>().props;
    const activeSort = filters?.sort ?? 'newest';
    const [feedItems, setFeedItems] = useState<FeedCerpen[]>(cerpens.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(cerpens.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadedPageRef = useRef<number>(0);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (cerpens.current_page === 1) {
            setFeedItems(cerpens.data);
        } else if (cerpens.current_page !== loadedPageRef.current) {
            setFeedItems((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));
                const incoming = cerpens.data.filter((item) => !existingIds.has(item.id));

                return [...prev, ...incoming];
            });
        }

        loadedPageRef.current = cerpens.current_page;
        setNextPageUrl(cerpens.next_page_url);
    }, [cerpens]);

    const loadMore = useCallback(() => {
        if (!nextPageUrl || isLoadingMore) {
            return;
        }

        router.get(
            nextPageUrl,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['cerpens'],
                onStart: () => setIsLoadingMore(true),
                onFinish: () => setIsLoadingMore(false),
            },
        );
    }, [nextPageUrl, isLoadingMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reading List" />
            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookmarkCheck className="size-5" />
                            Reading List
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Kumpulan cerpen yang sudah kamu bookmark untuk dibaca lagi nanti.</p>
                        <form action={route('reading-list')} method="get" className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <label htmlFor="sort" className="text-sm font-medium">
                                Urutkan
                            </label>
                            <select
                                id="sort"
                                name="sort"
                                defaultValue={activeSort}
                                className="bg-background h-9 rounded-md border px-3 text-sm outline-none"
                            >
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="most-liked">Paling Banyak Like</option>
                            </select>
                            <Button type="submit" size="sm">
                                Terapkan
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4">
                    {feedItems.map((cerpen) => (
                        <Card
                            key={cerpen.id}
                            className="hover:ring-foreground/20 h-full cursor-pointer transition"
                            role="button"
                            tabIndex={0}
                            onClick={() => router.visit(route('cerpen.show', cerpen.slug))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    router.visit(route('cerpen.show', cerpen.slug));
                                }
                            }}
                        >
                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Avatar size="sm">
                                        <AvatarFallback>{cerpen.user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{cerpen.user.name}</p>
                                        <p className="text-muted-foreground text-xs">@{cerpen.user.username ?? 'writer'}</p>
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg font-bold">{cerpen.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="story-content text-muted-foreground line-clamp-4 text-sm">{cerpen.content}</p>
                                <p className="text-muted-foreground text-xs">
                                    Disimpan {new Date(cerpen.bookmarked_at ?? cerpen.created_at).toLocaleDateString('id-ID')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={cerpen.is_liked ? 'default' : 'outline'}>
                                        <Heart className="size-3" /> {cerpen.likes_count}
                                    </Badge>
                                    <Badge variant="outline">
                                        <MessageCircle className="size-3" /> {cerpen.comments_count}
                                    </Badge>
                                    <Badge variant={cerpen.is_bookmarked ? 'secondary' : 'outline'}>
                                        <BookmarkCheck className="size-3" /> {cerpen.bookmarks_count}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            router.post(route('cerpen.bookmark.toggle', cerpen.id), {}, { preserveScroll: true });
                                        }}
                                    >
                                        Hapus Bookmark
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {feedItems.length === 0 && (
                    <Card className="mx-auto w-full max-w-4xl">
                        <CardContent className="text-muted-foreground py-10 text-center text-sm">
                            Reading List kamu masih kosong. Bookmark cerpen dari halaman detail untuk menyimpannya di sini.
                        </CardContent>
                    </Card>
                )}

                {feedItems.length > 0 && (
                    <div className="space-y-2">
                        <div ref={sentinelRef} className="h-1 w-full" />

                        {isLoadingMore && <p className="text-muted-foreground text-center text-sm">Memuat cerpen berikutnya...</p>}

                        {!nextPageUrl && <p className="text-muted-foreground text-center text-sm">Kamu sudah sampai di akhir daftar.</p>}

                        {nextPageUrl && !isLoadingMore && (
                            <div className="flex justify-center">
                                <Button type="button" variant="outline" size="sm" onClick={loadMore}>
                                    Muat lebih banyak
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
