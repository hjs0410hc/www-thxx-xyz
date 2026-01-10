'use client';

import { useState } from 'react';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/actions/upload';
import Image from 'next/image';

interface ProfileFormWithEditorProps {
    title: string;
    description: string;
    action: (formData: FormData) => Promise<void>;
    fields: Array<{
        name: string;
        label: string;
        type?: string;
        required?: boolean;
        placeholder?: string;
        options?: Array<{ value: string; label: string }>;
    }>;
    hasEditor?: boolean;
    editorLabel?: string;
    hasImageUpload?: boolean;
    imageFieldName?: string;
    hasSlug?: boolean;
    hasDescription?: boolean;
    initialData?: any;
}

export function ProfileFormWithEditor({
    title,
    description,
    action,
    fields,
    hasEditor = true,
    editorLabel = 'Content',
    hasImageUpload = false,
    imageFieldName = 'image_url',
    hasSlug = true,
    hasDescription = true,
    initialData,
}: ProfileFormWithEditorProps) {
    const [content, setContent] = useState<any>(initialData?.content || null);
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.[imageFieldName] || null);
    const [uploading, setUploading] = useState(false);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await uploadImage(formData);

            // Handle the result object
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
        if (hasEditor && content) {
            formData.set('content', JSON.stringify(content));
        }
        if (hasImageUpload && imageUrl) {
            formData.set(imageFieldName, imageUrl);
        }
        await action(formData);
        // Reset form
        setContent(null);
        setImageUrl('');
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {fields
                            .filter((field) => field.type !== 'file' && field.name !== imageFieldName)
                            .map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <Label htmlFor={field.name}>
                                        {field.label} {field.required && '*'}
                                    </Label>
                                    {field.type === 'select' && field.options ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required={field.required}
                                            defaultValue={initialData?.[field.name] || field.options[0]?.value}
                                        >
                                            {field.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            defaultValue={initialData?.[field.name]}
                                        />
                                    )}
                                </div>
                            ))}
                    </div>

                    {hasImageUpload && (
                        <div className="space-y-2">
                            <Label>Image</Label>
                            {imageUrl ? (
                                <div className="relative inline-block">
                                    <Image
                                        src={imageUrl}
                                        alt="Uploaded"
                                        width={200}
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
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Label htmlFor="image-upload" className="cursor-pointer">
                                        <Button type="button" variant="outline" disabled={uploading} asChild>
                                            <span>
                                                <Upload className="h-4 w-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </span>
                                        </Button>
                                    </Label>
                                </div>
                            )}
                        </div>
                    )}

                    {hasEditor && (
                        <div className="space-y-2">
                            <Label>{editorLabel}</Label>
                            <TiptapEditor content={content} onChange={setContent} />
                        </div>
                    )}

                    <Button type="submit" disabled={uploading}>
                        <Plus className="h-4 w-4 mr-2" />
                        {initialData ? 'Update' : 'Add'} {title}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
