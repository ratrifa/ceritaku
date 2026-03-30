import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpenText, Bookmark, Hash, Heart, MessageCircle, Search, UserRound } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home() {
    type FeedCerpen = {
        id: number;
        title: string;
        slug: string;
        content: string;
        created_at: string;
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

    type SearchUser = {
        id: number;
        name: string;
        username: string;
        bio?: string | null;
        followers_count: number;
        published_stories_count: number;
    };

    type SearchTag = {
        id: number;
        name: string;
        published_stories_count: number;
    };

    const { cerpens, users, tags, filters } = usePage<
        SharedData & {
            cerpens: PaginatedCerpens;
            users: SearchUser[];
            tags: SearchTag[];
            filters: { q?: string };
        }
    >().props;

    const searchQuery = filters?.q ?? '';
    const [feedItems, setFeedItems] = useState<FeedCerpen[]>(cerpens.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(cerpens.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const loadedPageRef = useRef<number>(0);

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
            <Head title="Home" />
            <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpenText className="size-5" />
                            Jelajahi Cerpen Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Cari judul cerpen, profil penulis, atau tag cerita, lalu jelajahi hasilnya.</p>
                        <form action={route('home')} method="get" className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input name="q" defaultValue={searchQuery} placeholder="Cari judul, @username, atau #tag" className="pl-9" />
                            </div>
                            <Button type="submit">Cari</Button>
                            {searchQuery && (
                                <Button asChild type="button" variant="outline">
                                    <Link href={route('home')}>Reset</Link>
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {searchQuery && (
                    <Card className="mx-auto w-full max-w-4xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserRound className="size-4" />
                                Hasil Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {users.length > 0 &&
                                users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">{user.name}</p>
                                            <p className="text-muted-foreground text-xs">@{user.username}</p>
                                            {user.bio && <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{user.bio}</p>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{user.published_stories_count} cerita</Badge>
                                            <Badge variant="outline">{user.followers_count} followers</Badge>
                                            <Button asChild size="sm" variant="secondary">
                                                <Link href={route('profile.public', user.username)}>Lihat Profil</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                            {users.length === 0 && <p className="text-muted-foreground text-sm">Tidak ada profile yang cocok.</p>}
                        </CardContent>
                    </Card>
                )}

                {searchQuery && (
                    <Card className="mx-auto w-full max-w-4xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Hash className="size-4" />
                                Hasil Tag
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Button key={tag.id} asChild variant="outline" size="sm">
                                            <Link href={route('home', { q: tag.name })}>
                                                <span className="mr-1">#{tag.name}</span>
                                                <Badge variant="secondary" className="ml-1 px-2 py-0 text-[10px]">
                                                    {tag.published_stories_count}
                                                </Badge>
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {tags.length === 0 && <p className="text-muted-foreground text-sm">Tidak ada tag yang cocok.</p>}
                        </CardContent>
                    </Card>
                )}

                <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4">
                    {feedItems.map((cerpen) => (
                        <Card
                            key={cerpen.id}
                            className="h-full cursor-pointer transition hover:ring-foreground/20"
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
                                <p className="text-muted-foreground text-xs">{new Date(cerpen.created_at).toLocaleDateString('id-ID')}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={cerpen.is_liked ? 'default' : 'outline'}>
                                        <Heart className="size-3" /> {cerpen.likes_count}
                                    </Badge>
                                    <Badge variant="outline">
                                        <MessageCircle className="size-3" /> {cerpen.comments_count}
                                    </Badge>
                                    <Badge variant={cerpen.is_bookmarked ? 'secondary' : 'outline'}>
                                        <Bookmark className="size-3" /> {cerpen.bookmarks_count}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {feedItems.length === 0 && (
                    <Card className="mx-auto w-full max-w-4xl">
                        <CardContent className="text-muted-foreground py-10 text-center text-sm">
                            {searchQuery ? `Tidak ada cerpen untuk kata kunci "${searchQuery}".` : 'Belum ada cerpen yang dipublish.'}
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
