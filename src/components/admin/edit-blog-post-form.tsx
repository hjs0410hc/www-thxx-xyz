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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define supported locales
const SUPPORTED_LOCALES = [
    { value: 'ko', label: 'Korean' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
];

interface EditBlogPostFormProps {
    post: any;
    tags: string;
}

export function EditBlogPostForm({ post, tags }: EditBlogPostFormProps) {
    // Initial state setup for translations
    const initialTranslations = SUPPORTED_LOCALES.reduce((acc, locale) => {
        // Find existing translation for this locale
        const trans = post.post_translations?.find((t: any) => t.locale === locale.value) || {};
        acc[locale.value] = {
            title: trans.title || '',
            excerpt: trans.excerpt || '',
            content: trans.content || null
        };
        return acc;
    }, {} as Record<string, any>);

    const [translations, setTranslations] = useState<Record<string, any>>(initialTranslations);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(post.cover_image);
    const [uploading, setUploading] = useState(false);

    const updateTranslation = (locale: string, field: string, value: any) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                [field]: value
            }
        }));
    };

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

        // Validation: Ensure at least one title is provided
        const hasTitle = Object.values(translations).some(t => t.title && t.title.trim() !== '');
        if (!hasTitle) {
            setError('At least one language must have a title.');
            setLoading(false);
            return;
        }

        // Add translations JSON to formData
        formData.append('translations', JSON.stringify(translations));

        if (imageUrl) {
            formData.set('cover_image', imageUrl);
        } else {
            if (post.cover_image && !imageUrl) {
                formData.set('cover_image', '');
            }
        }

        const result = await updatePost(post.id, formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
                <CardDescription>
                    Update post information and translations.
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

                    {/* Shared Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
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

                    {/* Localized Fields */}
                    <div className="space-y-2">
                        <Label>Content & Translations</Label>
                        <Tabs defaultValue="ko" className="w-full border rounded-lg p-4">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                {SUPPORTED_LOCALES.map(locale => (
                                    <TabsTrigger key={locale.value} value={locale.value}>
                                        {locale.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {SUPPORTED_LOCALES.map(locale => (
                                <TabsContent key={locale.value} value={locale.value} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`title-${locale.value}`}>Title ({locale.label})</Label>
                                        <Input
                                            id={`title-${locale.value}`}
                                            value={translations[locale.value].title}
                                            onChange={(e) => updateTranslation(locale.value, 'title', e.target.value)}
                                            placeholder={`Post Title in ${locale.label}`}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`excerpt-${locale.value}`}>Excerpt ({locale.label})</Label>
                                        <Textarea
                                            id={`excerpt-${locale.value}`}
                                            value={translations[locale.value].excerpt}
                                            onChange={(e) => updateTranslation(locale.value, 'excerpt', e.target.value)}
                                            rows={3}
                                            placeholder={`Brief summary in ${locale.label}...`}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content ({locale.label})</Label>
                                        <TiptapEditor
                                            content={translations[locale.value].content}
                                            onChange={(content) => updateTranslation(locale.value, 'content', content)}
                                        />
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
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
