import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Eye, Heart, MessageCircle, PenSquare, Users } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type PublicUser = {
    id: number;
    name: string;
    username: string;
    bio?: string | null;
    avatar?: string | null;
    created_at: string;
    published_stories_count: number;
    followers_count: number;
    following_count: number;
    total_views_count: number | null;
};

type StoryItem = {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
};

type PaginatedStories = {
    data: StoryItem[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type TopStoryItem = {
    id: number;
    title: string;
    slug: string;
    views_count: number;
    likes_count: number;
};

type ProfilePageProps = SharedData & {
    profileUser: PublicUser;
    stories: PaginatedStories;
    topStories: TopStoryItem[];
    isFollowing: boolean;
};

function buildExcerpt(content: string, length = 150): string {
    if (content.length <= length) {
        return content;
    }

    return `${content.slice(0, length).trim()}...`;
}

function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString).getTime();
    const now = Date.now();
    const diffMs = date - now;

    const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ['year', 1000 * 60 * 60 * 24 * 365],
        ['month', 1000 * 60 * 60 * 24 * 30],
        ['day', 1000 * 60 * 60 * 24],
        ['hour', 1000 * 60 * 60],
        ['minute', 1000 * 60],
    ];

    for (const [unit, amount] of ranges) {
        const value = Math.round(diffMs / amount);

        if (Math.abs(value) >= 1) {
            return new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' }).format(value, unit);
        }
    }

    return 'baru saja';
}

export default function PublicProfilePage() {
    const { profileUser, stories, topStories, isFollowing, auth } = usePage<ProfilePageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `@${profileUser.username}`,
            href: route('profile.public', profileUser.username),
        },
    ];

    const [activeTab, setActiveTab] = useState<'stories' | 'liked'>('stories');
    const [isFollowingState, setIsFollowingState] = useState(isFollowing);
    const [followersCount, setFollowersCount] = useState(profileUser.followers_count);
    const [followLoading, setFollowLoading] = useState(false);
    const [storyItems, setStoryItems] = useState<StoryItem[]>(stories.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(stories.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadedPageRef = useRef<number>(0);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const isAuthenticated = Boolean(auth?.user);
    const isOwnProfile = auth?.user?.username === profileUser.username;

    useEffect(() => {
        if (stories.current_page === 1) {
            setStoryItems(stories.data);
        } else if (stories.current_page !== loadedPageRef.current) {
            setStoryItems((prev) => {
                const existingIds = new Set(prev.map((story) => story.id));
                const incoming = stories.data.filter((story) => !existingIds.has(story.id));

                return [...prev, ...incoming];
            });
        }

        loadedPageRef.current = stories.current_page;
        setNextPageUrl(stories.next_page_url);
    }, [stories]);

    const loadMoreStories = useCallback(() => {
        if (!nextPageUrl || isLoadingMore || activeTab !== 'stories') {
            return;
        }

        router.get(
            nextPageUrl,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['stories'],
                onStart: () => setIsLoadingMore(true),
                onFinish: () => setIsLoadingMore(false),
            },
        );
    }, [nextPageUrl, isLoadingMore, activeTab]);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel || activeTab !== 'stories') {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMoreStories();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [loadMoreStories, activeTab]);

    const handleToggleFollow = () => {
        if (!isAuthenticated || isOwnProfile || followLoading) {
            return;
        }

        const previousState = isFollowingState;
        const previousFollowers = followersCount;
        const nextState = !isFollowingState;

        setIsFollowingState(nextState);
        setFollowersCount((prev) => prev + (nextState ? 1 : -1));
        setFollowLoading(true);

        router.post(
            route('users.follow.toggle', profileUser.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setIsFollowingState(previousState);
                    setFollowersCount(previousFollowers);
                },
                onFinish: () => {
                    setFollowLoading(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`@${profileUser.username}`} />

            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (window.history.length > 1) {
                                window.history.back();

                                return;
                            }

                            router.visit(route('home'));
                        }}
                    >
                        <ArrowLeft className="size-4" />
                        Kembali
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar size="lg">
                                <AvatarImage src={profileUser.avatar ?? undefined} alt={profileUser.name} />
                                <AvatarFallback>{profileUser.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{profileUser.name}</CardTitle>
                                <p className="text-muted-foreground text-sm">@{profileUser.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="w-fit">
                                <CalendarDays className="size-3" />
                                Bergabung {new Date(profileUser.created_at).toLocaleDateString('id-ID')}
                            </Badge>

                            {isAuthenticated && !isOwnProfile && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={isFollowingState ? 'secondary' : 'default'}
                                    disabled={followLoading}
                                    onClick={handleToggleFollow}
                                >
                                    {followLoading ? 'Memproses...' : isFollowingState ? 'Following' : 'Follow'}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{profileUser.bio?.trim() || 'Belum ada bio.'}</p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Published Stories</p>
                                <p className="mt-1 text-xl font-semibold">{profileUser.published_stories_count}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Followers</p>
                                <p className="mt-1 text-xl font-semibold">{followersCount}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Following</p>
                                <p className="mt-1 text-xl font-semibold">{profileUser.following_count}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-muted-foreground text-xs">Total Views</p>
                                <p className="mt-1 text-xl font-semibold">{profileUser.total_views_count ?? 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section className="grid gap-4 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Users className="text-muted-foreground size-4" />
                                <h2 className="text-lg font-semibold">@{profileUser.username}</h2>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={activeTab === 'stories' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('stories')}
                                >
                                    Stories
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={activeTab === 'liked' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('liked')}
                                >
                                    Liked
                                </Button>
                            </div>
                        </div>

                        {activeTab === 'liked' && (
                            <Card>
                                <CardContent className="text-muted-foreground py-10 text-center text-sm">
                                    Tab Liked akan ditambahkan pada iterasi berikutnya.
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'stories' && isLoadingMore && storyItems.length > 0 && (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-2/3" />
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-5/6" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {activeTab === 'stories' && storyItems.length === 0 && (
                            <Card>
                                <CardContent className="text-muted-foreground py-10 text-center text-sm">
                                    User ini belum punya cerita yang dipublish.
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'stories' &&
                            storyItems.map((story) => (
                                <Card key={story.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold">{story.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="story-content text-muted-foreground text-sm leading-relaxed">{buildExcerpt(story.content)}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">
                                                <Heart className="size-3" /> {story.likes_count}
                                            </Badge>
                                            <Badge variant="outline">
                                                <MessageCircle className="size-3" /> {story.comments_count}
                                            </Badge>
                                            <Badge variant="outline">
                                                <CalendarDays className="size-3" /> {formatRelativeDate(story.created_at)}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={route('cerpen.show', story.slug)}>
                                                <PenSquare className="size-4" />
                                                Baca
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}

                        {activeTab === 'stories' && storyItems.length > 0 && (
                            <div className="space-y-2">
                                <div ref={sentinelRef} className="h-1 w-full" />

                                {isLoadingMore && <p className="text-muted-foreground text-center text-sm">Memuat cerita berikutnya...</p>}

                                {!nextPageUrl && (
                                    <p className="text-muted-foreground text-center text-sm">Kamu sudah sampai di akhir daftar cerita.</p>
                                )}

                                {nextPageUrl && !isLoadingMore && (
                                    <div className="flex justify-center">
                                        <Button type="button" variant="outline" size="sm" onClick={loadMoreStories}>
                                            Muat lebih banyak
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Stories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {topStories.length === 0 && <p className="text-muted-foreground text-sm">Belum ada cerita populer.</p>}
                                {topStories.map((story) => (
                                    <div key={story.id} className="rounded-md border p-3">
                                        <Link
                                            href={route('cerpen.show', story.slug)}
                                            className="font-heading line-clamp-2 text-sm font-bold hover:underline"
                                        >
                                            {story.title}
                                        </Link>
                                        <div className="text-muted-foreground mt-2 flex flex-wrap gap-2 text-xs">
                                            <span className="inline-flex items-center gap-1">
                                                <Heart className="size-3" /> {story.likes_count}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Eye className="size-3" /> {story.views_count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>
                </section>
            </main>
        </AppLayout>
    );
}
