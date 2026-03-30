import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Field } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Folder, Globe, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cerpen',
        href: 'cerpen',
    },
];

type CerpenForm = {
    title: string;
    content: string;
    tags: string;
    status: 'draft' | 'published';
};

type TagItem = {
    id: number;
    name: string;
};

type CerpenItem = {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: 'draft' | 'published';
    likes_count: number;
    comments_count: number;
    bookmarks_count: number;
    tags: TagItem[];
    created_at: string;
};

type CerpenPageProps = SharedData & {
    cerpens: CerpenItem[];
};

export default function Home() {
    const { cerpens, flash } = usePage<CerpenPageProps>().props;
    const [editingId, setEditingId] = useState<number | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
        processing,
        reset,
        transform,
    } = useForm<CerpenForm>({
        title: '',
        content: '',
        tags: '',
        status: 'draft',
    });

    const resetForm = () => {
        setEditingId(null);
        reset('title', 'content', 'tags');
        setData('status', 'draft');
    };

    const submitWithStatus = (status: CerpenForm['status']) => {
        transform((formData) => ({ ...formData, status }));

        const onSuccess = () => {
            resetForm();
            transform((formData) => formData);
        };

        if (editingId !== null) {
            put(route('cerpen.update', editingId), {
                onSuccess,
            });

            return;
        }

        post(route('cerpen.store'), {
            onSuccess: () => {
                resetForm();
                transform((formData) => formData);
            },
        });
    };

    const startEdit = (cerpen: CerpenItem) => {
        setEditingId(cerpen.id);
        setData('title', cerpen.title);
        setData('content', cerpen.content);
        setData('tags', cerpen.tags.map((tag) => tag.name).join(', '));
        setData('status', cerpen.status);
    };

    const deleteCerpen = (cerpen: CerpenItem) => {
        destroy(route('cerpen.destroy', cerpen.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (editingId === cerpen.id) {
                    resetForm();
                }
            },
        });
    };

    const editingCerpen = editingId !== null ? cerpens.find((cerpen) => cerpen.id === editingId) : null;
    const isEditingPublished = editingCerpen?.status === 'published';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="grid h-full flex-1 gap-4 rounded-xl p-4 lg:grid-cols-3">
                <Card className="col-span-2 row-span-1 h-full">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Cerpen' : 'Buat Cerpen Baru'}</CardTitle>
                    </CardHeader>
                    <form className="flex h-full flex-col">
                        <CardContent className="flex-1 space-y-4">
                            {flash?.success && (
                                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{flash.success}</div>
                            )}

                            <Field>
                                <FieldLabel className="mb-2" htmlFor="title">
                                    Judul
                                </FieldLabel>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Judul"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </Field>

                            <Field>
                                <FieldLabel className="my-2" htmlFor="content">
                                    Cerita
                                </FieldLabel>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Tuangkan karya mu di sini"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    required
                                />
                                <InputError className="mt-2" message={errors.content} />
                            </Field>

                            <Field>
                                <FieldLabel className="my-2" htmlFor="tags">
                                    Tags
                                </FieldLabel>
                                <Input
                                    id="tags"
                                    name="tags"
                                    placeholder="contoh: romance, drama, slice of life"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                />
                                <p className="text-muted-foreground mt-1 text-xs">Pisahkan dengan koma. Maksimal 8 tag.</p>
                                <InputError className="mt-2" message={errors.tags} />
                            </Field>

                            <InputError className="mt-2" message={errors.status} />
                        </CardContent>

                        <CardFooter className="mt-auto gap-2">
                            {(!editingId || !isEditingPublished) && (
                                <Button type="button" disabled={processing} onClick={() => submitWithStatus('draft')}>
                                    <Folder />
                                    {editingId ? 'Update Draft' : 'Simpan Draft'}
                                </Button>
                            )}
                            <Button type="button" disabled={processing} onClick={() => submitWithStatus('published')}>
                                <Globe />
                                {editingId ? 'Update Publish' : 'Publish'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" disabled={processing} onClick={resetForm}>
                                    Batal
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Card>
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Cerpen Kamu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cerpens.length === 0 && <p className="text-muted-foreground text-sm">Belum ada cerpen. Buat yang pertama sekarang.</p>}

                        {cerpens.map((cerpen) => (
                            <div key={cerpen.id} className="rounded-lg border p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-heading line-clamp-2 font-bold">{cerpen.title}</p>
                                    <span
                                        className={
                                            cerpen.status === 'published'
                                                ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700'
                                                : 'rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700'
                                        }
                                    >
                                        {cerpen.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className="story-content text-muted-foreground mt-2 line-clamp-2 text-xs">{cerpen.content}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline">
                                        <Heart className="size-3" /> {cerpen.likes_count}
                                    </Badge>
                                    <Badge variant="outline">
                                        <MessageCircle className="size-3" /> {cerpen.comments_count}
                                    </Badge>
                                    <Badge variant="outline">Bookmark {cerpen.bookmarks_count}</Badge>
                                    {cerpen.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary">
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-muted-foreground mt-2 text-xs">{new Date(cerpen.created_at).toLocaleString('id-ID')}</p>
                                <div className="mt-3 flex gap-2">
                                    <Button type="button" size="sm" variant="secondary" asChild>
                                        <Link href={route('cerpen.show', cerpen.slug)}>Lihat</Link>
                                    </Button>
                                    <Button type="button" size="sm" variant="outline" disabled={processing} onClick={() => startEdit(cerpen)}>
                                        Edit
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button type="button" size="sm" variant="destructive" disabled={processing}>
                                                Hapus
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-64">
                                            <p className="text-sm font-medium">Hapus cerpen ini?</p>
                                            <p className="text-muted-foreground mt-1 text-xs">Data yang dihapus tidak bisa dikembalikan.</p>
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
                                                    disabled={processing}
                                                    onClick={() => deleteCerpen(cerpen)}
                                                >
                                                    Ya, Hapus
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
