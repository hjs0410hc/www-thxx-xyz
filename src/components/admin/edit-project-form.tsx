'use client';

import { useState, useEffect } from 'react';
import { createProject, updateProject } from '@/lib/actions/projects';
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
// @ts-ignore
import { Project } from '@/types/tech';
import Image from 'next/image';
import { uploadImage } from '@/lib/actions/upload';

interface ProjectFormProps {
    project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
    const isEditing = !!project;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Controlled states for localized fields
    const [locale, setLocale] = useState('ko');

    // Initialize from translations if available
    const initialTrans = project?.project_translations?.find((t) => t.locale === 'ko')
        || project?.project_translations?.[0];

    const [title, setTitle] = useState(initialTrans?.title || '');
    const [description, setDescription] = useState(initialTrans?.description || '');
    const [content, setContent] = useState(initialTrans?.contents || null);

    // Shared state
    const [imageUrl, setImageUrl] = useState<string | null>(project?.cover_image || null);
    const [uploading, setUploading] = useState(false);

    // Update localized fields when locale changes
    useEffect(() => {
        if (project && project.project_translations) {
            const translation = project.project_translations.find((t: any) => t.locale === locale);
            if (translation) {
                setTitle(translation.title || '');
                setDescription(translation.description || '');
                setContent(translation.contents || null);
            } else {
                // If no translation exists for this locale, start empty
                setTitle('');
                setDescription('');
                setContent(null);
            }
        }
    }, [locale, project]);

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

        // Append localized data
        formData.set('locale', locale);
        formData.set('title', title);
        formData.set('description', description);
        if (content) {
            formData.set('contents', JSON.stringify(content));
        }

        if (imageUrl) {
            formData.set('cover_image', imageUrl);
        } else if (project?.cover_image && !imageUrl) {
            formData.set('cover_image', ''); // Explicitly clear if removed
        }

        let result;
        if (isEditing && project) {
            // Check if we have an ID for this translation to potential upsert cleanly (optional, backend handles it via conflict)
            // But we pass the project ID primarily
            result = await updateProject(project.id, formData);
        } else {
            result = await createProject(formData);
        }

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update project information' : 'Add a new project to your portfolio'}
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
                            <Label htmlFor="locale">Language</Label>
                            <Select name="locale" value={locale} onValueChange={setLocale} disabled={loading}>
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
                            <Label htmlFor="title">Title ({locale}) *</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                defaultValue={project?.slug}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={project?.status || 'in_progress'} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="discontinued">Discontinued</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description ({locale})</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        {imageUrl ? (
                            <div className="relative inline-block">
                                <Image
                                    src={imageUrl}
                                    alt="Project Cover"
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
                        <Label>Content ({locale})</Label>
                        <div className="min-h-[300px] border rounded-md">
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                className="h-4 w-4"
                                defaultChecked={project?.featured}
                                disabled={loading}
                            />
                            <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Featured Project
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="demo_url">Demo URL</Label>
                            <Input
                                id="demo_url"
                                name="demo_url"
                                type="url"
                                defaultValue={project?.demo_url || ''}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="github_url">GitHub URL</Label>
                            <Input
                                id="github_url"
                                name="github_url"
                                type="url"
                                defaultValue={project?.github_url || ''}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                name="start_date"
                                type="date"
                                defaultValue={project?.start_date || ''}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                defaultValue={project?.end_date || ''}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input
                            id="technologies"
                            name="technologies"
                            defaultValue={project?.technologies?.join(', ') || ''}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/projects">
                            <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// Export as EditProjectForm for backward compatibility if needed, or update consumers
export const EditProjectForm = ProjectForm;
