'use client';

import { useState } from 'react';
import { createSkill, updateSkill } from '@/lib/actions/skills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { AlertCircle, Upload, X } from 'lucide-react';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Skill } from '@/types/tech';
import Image from 'next/image';
import { uploadImage } from '@/lib/actions/upload';

interface EditSkillFormProps {
    skill?: Skill; // Optional for create mode
    mode: 'create' | 'edit';
}

export function EditSkillForm({ skill, mode }: EditSkillFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(skill?.contents);
    const [imageUrl, setImageUrl] = useState<string | null>(skill?.cover_image || null);
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
            formData.set('contents', JSON.stringify(content));
        }

        if (imageUrl) {
            formData.set('cover_image', imageUrl);
        } else if (skill?.cover_image && !imageUrl) {
            formData.set('cover_image', ''); // Explicitly clear if removed
        }

        let result;
        if (mode === 'edit' && skill) {
            result = await updateSkill(skill.id, formData);
        } else {
            result = await createSkill(formData);
        }

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{mode === 'create' ? 'New Skill' : 'Edit Skill'}</CardTitle>
                <CardDescription>
                    {mode === 'create' ? 'Add a new skill or technology' : 'Update skill information'}
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
                                defaultValue={skill?.title}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                defaultValue={skill?.slug}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                list="categories"
                                defaultValue={skill?.category || ''}
                                disabled={loading}
                                placeholder="e.g. Frontend, Backend, DevOps"
                            />
                            <datalist id="categories">
                                <option value="Frontend" />
                                <option value="Backend" />
                                <option value="DevOps" />
                                <option value="Design" />
                                <option value="Tools" />
                            </datalist>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select name="level" defaultValue={skill?.level || 'Intermediate'} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="locale">Language</Label>
                            <Select name="locale" defaultValue={skill?.locale || 'ko'} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ko">Korean</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ja">Japanese</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input
                                id="display_order"
                                name="display_order"
                                type="number"
                                defaultValue={skill?.display_order || 0}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            defaultValue={skill?.description || ''}
                            disabled={loading}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <Label>Cover Image / Icon</Label>
                        {imageUrl ? (
                            <div className="relative inline-block">
                                <Image
                                    src={imageUrl}
                                    alt="Skill Cover"
                                    width={100}
                                    height={100}
                                    className="rounded-lg object-contain bg-muted p-2"
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
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </span>
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Content (Detail)</Label>
                        <div className="min-h-[300px] border rounded-md">
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technologies">Related Tech (comma-separated)</Label>
                        <Input
                            id="technologies"
                            name="technologies"
                            defaultValue={skill?.technologies?.join(', ') || ''}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/skills">
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
