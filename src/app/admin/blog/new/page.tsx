'use client';

import { useState } from 'react';
import { createPost } from '@/lib/actions/posts';
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

export default function NewBlogPostPage() {
    const [content, setContent] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
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

        // Add content & cover image to formData
        if (content) {
            formData.append('content', JSON.stringify(content));
        }

        if (imageUrl) {
            // formData already might have cover_image from hidden input, but ensuring it here
            formData.set('cover_image', imageUrl);
        }

        const result = await createPost(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful, createPost redirects
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/blog">
                    <Button variant="ghost">← Back to Blog</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                    <CardDescription>
                        Write and publish a new blog post
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
                                    placeholder="My Awesome Post"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    required
                                    placeholder="my-awesome-post"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="locale">Language</Label>
                                <select
                                    id="locale"
                                    name="locale"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    defaultValue="ko"
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
                                        disabled={loading}
                                    />
                                    <label htmlFor="published" className="text-sm">
                                        Publish immediately
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
                                placeholder="Brief summary of the post..."
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
                                    {/* Hidden input to ensure the value is submitted if needed, though we handle it in handleSubmit */}
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
                                placeholder="React, TypeScript, Web Development"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content *</Label>
                            <TiptapEditor content={content} onChange={setContent} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Post'}
                            </Button>
                            <Link href="/admin/blog">
                                <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
