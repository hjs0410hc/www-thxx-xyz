'use client';

import { useState } from 'react';
import { updatePost } from '@/lib/actions/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { uploadImage } from '@/lib/actions/upload';

interface EditBlogPostFormProps {
    post: any;
    tags: string;
}

export function EditBlogPostForm({ post, tags }: EditBlogPostFormProps) {
    const [content, setContent] = useState(post.content);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(post.cover_image);
    const [uploading, setUploading] = useState(false);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await uploadImage(formData);

            if ('url' in result && result.url) {
                setImageUrl(result.url);
            } else if ('error' in result) {
                alert(result.error);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        if (content) {
            formData.append('content', JSON.stringify(content));
        }

        if (imageUrl) {
            formData.set('cover_image', imageUrl);
        } else {
            // If imageUrl is null (removed), sending explicit empty string or handling in backend might be needed.
            // For now, let's assume setting it to empty string removes it if the backend handles it.
            // Or if we don't send it, it might stay as is?
            // Actually, if we want to remove it, we should explicitly send empty string or null.
            // Let's send empty string if it's explicitly nullified.
            if (post.cover_image && !imageUrl) {
                formData.set('cover_image', '');
            }
        }

        const result = await updatePost(post.id, formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful, updatePost redirects
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
                <CardDescription>
                    Update post information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                defaultValue={post.title}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                defaultValue={post.slug}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="locale">Language</Label>
                            <select
                                id="locale"
                                name="locale"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                defaultValue={post.locale}
                                disabled={loading}
                            >
                                <option value="ko">Korean</option>
                                <option value="en">English</option>
                                <option value="ja">Japanese</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="published">Published</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    className="h-4 w-4"
                                    defaultChecked={post.published}
                                    disabled={loading}
                                />
                                <label htmlFor="published" className="text-sm">
                                    Publish this post
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            rows={3}
                            defaultValue={post.excerpt || ''}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        {imageUrl ? (
                            <div className="relative inline-block">
                                <Image
                                    src={imageUrl}
                                    alt="Cover Image"
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2"
                                    onClick={() => setImageUrl(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <input type="hidden" name="cover_image" value={imageUrl} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading || loading}
                                    className="hidden"
                                    id="cover-image-upload"
                                />
                                <Label htmlFor="cover-image-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center rounded-md border border-dashed border-input bg-background px-4 py-6 hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {uploading ? 'Uploading...' : 'Upload Cover Image'}
                                            </span>
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            defaultValue={tags}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Content *</Label>
                        <TiptapEditor content={content} onChange={setContent} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/blog">
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
