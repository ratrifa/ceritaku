import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpenText, Compass, Heart, PenLine, UserRoundPlus } from 'lucide-react';

type LandingStory = {
    id: number;
    title: string;
    slug: string;
    content: string;
    likes_count: number;
    user: {
        name: string;
        username?: string | null;
    };
};

type LandingProps = SharedData & {
    stories?: LandingStory[];
};

function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <section className="bg-card relative overflow-hidden rounded-3xl border px-6 py-14 md:px-12 md:py-20">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />

            <div className="relative max-w-3xl space-y-6">
                <Badge variant="secondary" className="px-3 py-1 text-xs tracking-wide uppercase">
                    CeritaKu for Writers & Readers
                </Badge>

                <h1 className="font-heading text-4xl leading-tight font-bold md:text-6xl">Tuangkan Ceritamu, Temukan Dunia Baru</h1>

                <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
                    Platform untuk menulis, membaca, dan berbagi cerpen dengan komunitas.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild size="lg">
                        <Link href={route('dashboard')}>Mulai Menulis</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href={route('home')}>Jelajahi Cerita</Link>
                    </Button>
                    {!isAuthenticated && (
                        <p className="text-muted-foreground text-sm">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-medium underline underline-offset-4">
                                Daftar gratis
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

function FeatureSection() {
    const features = [
        {
            title: 'Tulis Cerita',
            description: 'Editor sederhana untuk menulis cerpen',
            icon: PenLine,
        },
        {
            title: 'Interaksi',
            description: 'Like, komentar, dan bookmark',
            icon: Heart,
        },
        {
            title: 'Ikuti Penulis',
            description: 'Follow author favoritmu',
            icon: UserRoundPlus,
        },
        {
            title: 'Temukan Cerita',
            description: 'Jelajahi cerita berdasarkan minat',
            icon: Compass,
        },
    ];

    return (
        <section className="space-y-5">
            <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold md:text-3xl">Kenapa CeritaKu?</h2>
                <p className="text-muted-foreground">Semua yang kamu butuhkan untuk membangun kebiasaan menulis dan membaca.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <Card key={feature.title} className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <feature.icon className="size-5" />
                                {feature.title}
                            </CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function StoryPreview({ stories, isAuthenticated }: { stories: LandingStory[]; isAuthenticated: boolean }) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">Cerita Pilihan Minggu Ini</h2>
                    <p className="text-muted-foreground">Cuplikan cerita terbaru dari komunitas CeritaKu.</p>
                </div>
                <Button asChild variant="outline" className="hidden sm:inline-flex">
                    <Link href={route('home')}>Lihat Semua</Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => {
                    const targetHref = isAuthenticated ? route('cerpen.show', story.slug) : route('login');

                    return (
                        <Card
                            key={story.id}
                            className="hover:ring-foreground/20 h-full cursor-pointer transition"
                            role="button"
                            tabIndex={0}
                            onClick={() => router.visit(targetHref)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    router.visit(targetHref);
                                }
                            }}
                        >
                            <CardHeader className="space-y-3">
                                <CardTitle className="line-clamp-2 text-lg font-bold">{story.title}</CardTitle>
                                <CardDescription>
                                    Oleh {story.user.name} @{story.user.username ?? 'writer'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="story-content text-muted-foreground line-clamp-4 text-sm">{story.content}</p>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="gap-1">
                                        <Heart className="size-3" /> {story.likes_count}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="bg-muted/50 rounded-3xl border px-6 py-12 text-center md:px-10">
            <div className="mx-auto max-w-2xl space-y-4">
                <h2 className="font-heading text-3xl font-bold md:text-4xl">Mulai perjalanan ceritamu hari ini</h2>
                <p className="text-muted-foreground">Gabung dengan pembaca dan penulis lain, bagikan ceritamu dalam hitungan menit.</p>
                <Button asChild size="lg">
                    <Link href={route('register')}>Daftar Sekarang</Link>
                </Button>
            </div>
        </section>
    );
}

function FooterSection() {
    return (
        <footer className="text-muted-foreground flex flex-col items-center justify-between gap-2 border-t pt-6 text-sm sm:flex-row">
            <p>CeritaKu © {new Date().getFullYear()}</p>
            <div className="flex items-center gap-4">
                <Link href={route('landing')} className="hover:text-foreground transition-colors">
                    Beranda
                </Link>
                <Link href={route('login')} className="hover:text-foreground transition-colors">
                    Masuk
                </Link>
                <Link href={route('register')} className="hover:text-foreground transition-colors">
                    Daftar
                </Link>
            </div>
        </footer>
    );
}

export default function Welcome() {
    const { auth, stories = [] } = usePage<LandingProps>().props;

    return (
        <>
            <Head title="CeritaKu" />

            <div className="bg-background text-foreground min-h-screen">
                <header className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <Link href={route('landing')} className="font-heading flex items-center gap-2 text-lg font-bold">
                            <BookOpenText className="size-5" />
                            CeritaKu
                        </Link>

                        <nav className="flex items-center gap-2 sm:gap-3">
                            {auth.user ? (
                                <Button asChild variant="outline">
                                    <Link href={route('home')}>Home</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link href={route('login')}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <HeroSection isAuthenticated={Boolean(auth.user)} />
                    <FeatureSection />
                    <StoryPreview stories={stories} isAuthenticated={Boolean(auth.user)} />
                    <CTASection />
                    <FooterSection />
                </main>
            </div>
        </>
    );
}
