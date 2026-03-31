import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Bookmark, Eye, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

type Author = {
    id: number;
    name: string;
    username?: string | null;
};

type Tag = {
    id: number;
    name: string;
};

type CommentItem = {
    id: number;
    content: string;
    created_at: string;
    user_id: number;
    user: Author;
    replies: CommentItem[];
};

type CerpenDetail = {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    status: 'draft' | 'published';
    created_at: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    bookmarks_count: number;
    user: Author;
    tags: Tag[];
};

type ShowProps = SharedData & {
    cerpen: CerpenDetail;
    comments: CommentItem[];
    isLiked: boolean;
    isBookmarked: boolean;
    canManage: boolean;
};

export default function CerpenShow() {
    const { cerpen, comments, isLiked, isBookmarked, canManage, auth, flash } = usePage<ShowProps>().props;
    const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
    const [replyTarget, setReplyTarget] = useState<{ id: number; name: string } | null>(null);
    const isAuthenticated = Boolean(auth?.user);
    const currentUserId = auth?.user?.id ?? null;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Home',
            href: '/home',
        },
        {
            title: cerpen.title,
            href: route('cerpen.show', cerpen.slug),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        parent_id: null as number | null,
    });

    const submitComment = () => {
        post(route('cerpen.comments.store', cerpen.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
                setData('parent_id', null);
                setReplyTarget(null);
            },
        });
    };

    const startReply = (commentId: number, authorName: string) => {
        setData('parent_id', commentId);
        setReplyTarget({ id: commentId, name: authorName });
        commentInputRef.current?.focus();
    };

    const cancelReply = () => {
        setData('parent_id', null);
        setReplyTarget(null);
    };

    const deleteComment = (commentId: number) => {
        router.delete(route('cerpen.comments.destroy', { cerpen: cerpen.id, comment: commentId }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={cerpen.title} />

            <div className="grid h-full flex-1 gap-4 rounded-xl p-4 lg:grid-cols-3">
                <section className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={route('home')}>
                                        <ArrowLeft className="size-4" />
                                        Kembali
                                    </Link>
                                </Button>
                                <Badge variant={cerpen.status === 'published' ? 'default' : 'secondary'}>
                                    {cerpen.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold">{cerpen.title}</CardTitle>
                            <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                <Avatar size="sm">
                                    <AvatarFallback>{cerpen.user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{cerpen.user.name}</span>
                                <span>@{cerpen.user.username ?? 'writer'}</span>
                                <span>{new Date(cerpen.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                            {cerpen.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {cerpen.tags.map((tag) => (
                                        <Badge key={tag.id} variant="outline">
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <article className="story-content prose prose-base text-foreground max-w-none whitespace-pre-wrap">
                                {cerpen.content}
                            </article>
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={isLiked ? 'default' : 'outline'}
                                size="sm"
                                disabled={!isAuthenticated}
                                onClick={() => router.post(route('cerpen.like.toggle', cerpen.id), {}, { preserveScroll: true })}
                            >
                                <Heart className="size-4" />
                                {cerpen.likes_count}
                            </Button>
                            <Button
                                type="button"
                                variant={isBookmarked ? 'secondary' : 'outline'}
                                size="sm"
                                disabled={!isAuthenticated}
                                onClick={() => router.post(route('cerpen.bookmark.toggle', cerpen.id), {}, { preserveScroll: true })}
                            >
                                <Bookmark className="size-4" />
                                {cerpen.bookmarks_count}
                            </Button>
                            <Badge variant="outline">
                                <MessageCircle className="size-3" /> {cerpen.comments_count}
                            </Badge>
                            <Badge variant="outline">
                                <Eye className="size-3" /> {cerpen.views_count}
                            </Badge>
                            {canManage && (
                                <Button asChild variant="outline" size="sm" className="ml-auto">
                                    <Link href={route('cerpen.index')}>Kelola Cerpen</Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </section>

                <aside className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Komentar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {flash?.success && <p className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">{flash.success}</p>}
                            {!isAuthenticated && (
                                <p className="text-muted-foreground rounded-md border px-3 py-2 text-xs">
                                    Login untuk memberikan like, bookmark, dan komentar.{' '}
                                    <Link href={route('login')} className="underline">
                                        Masuk sekarang
                                    </Link>
                                </p>
                            )}
                            {replyTarget && (
                                <div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                    <span>
                                        Sedang membalas komentar dari <strong>{replyTarget.name}</strong>
                                    </span>
                                    <Button type="button" size="sm" variant="ghost" onClick={cancelReply}>
                                        Batal Reply
                                    </Button>
                                </div>
                            )}
                            <Textarea
                                ref={commentInputRef}
                                value={data.content}
                                onChange={(event) => setData('content', event.target.value)}
                                placeholder={replyTarget ? `Balas ${replyTarget.name}...` : 'Tulis komentar...'}
                                rows={4}
                                disabled={!isAuthenticated}
                            />
                            <InputError message={errors.content} />
                            <Button type="button" className="w-full" onClick={submitComment} disabled={processing || !isAuthenticated}>
                                {replyTarget ? 'Kirim Balasan' : 'Kirim Komentar'}
                            </Button>
                            <Separator />

                            {comments.length === 0 && <p className="text-muted-foreground text-sm">Belum ada komentar.</p>}

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="space-y-2 rounded-lg border p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm font-medium">{comment.user.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-xs">
                                                    {new Date(comment.created_at).toLocaleString('id-ID')}
                                                </span>
                                                {currentUserId !== null && comment.user_id === currentUserId && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button type="button" variant="ghost" size="icon-sm">
                                                                <Trash2 className="text-destructive size-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent align="end" className="w-56">
                                                            <p className="text-sm">Hapus komentar ini?</p>
                                                            <div className="mt-3 flex justify-end gap-2">
                                                                <PopoverClose asChild>
                                                                    <Button type="button" size="sm" variant="outline">
                                                                        Batal
                                                                    </Button>
                                                                </PopoverClose>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => deleteComment(comment.id)}
                                                                >
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">{comment.content}</p>
                                        <div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={!isAuthenticated}
                                                onClick={() => startReply(comment.id, comment.user.name)}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                        {comment.replies.length > 0 && (
                                            <div className="space-y-2 border-l pl-3">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="bg-muted/40 rounded-md p-2">
                                                        <div className="mb-1 flex items-center justify-between gap-2">
                                                            <p className="text-xs font-medium">{reply.user.name}</p>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                disabled={!isAuthenticated}
                                                                onClick={() => startReply(reply.id, reply.user.name)}
                                                            >
                                                                Reply
                                                            </Button>
                                                        </div>
                                                        <p className="text-muted-foreground text-xs">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </AppLayout>
    );
}
