'use client';

import { useState, useEffect } from 'react';
import { TiptapEditor } from '@/components/admin/tiptap-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/actions/upload';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormWithEditorProps {
    title: string;
    description: string;
    action: (formData: FormData) => Promise<void>;
    fields: Array<{
        name: string;
        label: string;
        type?: string; // 'text' | 'date' | 'select'
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
    localizedFields?: string[];
}

const LOCALES = [
    { value: 'ko', label: 'Korean' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
];

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
    localizedFields = ['name', 'title', 'institution', 'degree', 'field', 'company', 'position', 'location', 'role', 'issuer', 'description'],
}: ProfileFormWithEditorProps) {
    const [locale, setLocale] = useState<string>('ko');
    // Flatten initial data: merge shared + initial translation (if any)
    const getInitialValues = (loc: string) => {
        const trans = initialData?.translations?.find((t: any) => t.locale === loc) || {};
        const values: any = { ...initialData }; // Start with shared

        // Overlay localized fields
        localizedFields.forEach(field => {
            values[field] = trans[field] || '';
        });

        // Specifically handle 'content' if it's localized
        if (hasEditor) {
            values.content = trans.content || initialData?.content || null; // fallback to shared content if exists, though unlikely for new schema
        }

        return values;
    };

    const [formValues, setFormValues] = useState<any>(getInitialValues('ko'));
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.[imageFieldName] || null);
    const [uploading, setUploading] = useState(false);

    // Update form values when locale changes, but PRESERVE current edits if we want (complex).
    // For now, let's load from "saved" data when switching to a clean locale, 
    // OR just keep a local cache of edits? 
    // Easier approach: Just re-derive from props + locale, losing unsaved edits on switch? 
    // Better: Maintain a `translations` state that mirrors the DB structure + edits.

    // Actually, simpler: Just load the values for the selected locale from `initialData` every time we switch,
    // causing data loss if you switch before saving. This is acceptable for MVP admin.
    // Ensure we warn or just assume user knows.
    // IMPROVEMENT: We can just use `useEffect` to update `formValues` when `locale` changes.

    useEffect(() => {
        setFormValues((prev: any) => {
            // If we want to persist updates across tab switching locally, we need complex state.
            // For now, let's just reset to initialData for that locale. 
            // This means switching tabs DISCARDS unsaved changes in the previous tab.
            return getInitialValues(locale);
        });
    }, [locale, initialData]);

    const handleChange = (name: string, value: any) => {
        setFormValues((prev: any) => ({ ...prev, [name]: value }));
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
                handleChange(imageFieldName, result.url);
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
        // Append all controlled values
        Object.keys(formValues).forEach(key => {
            // content handled separately usually, but let's Ensure
            if (key !== 'content' && key !== imageFieldName) {
                formData.set(key, formValues[key]);
            }
        });

        if (hasEditor && formValues.content) {
            formData.set('content', JSON.stringify(formValues.content));
        }
        if (hasImageUpload && imageUrl) {
            formData.set(imageFieldName, imageUrl);
        }

        formData.set('locale', locale);

        await action(formData);

        // Don't clear form on edit, maybe clear on add? 
        // For simplicity, we leave it.
    }

    return (
        <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Label>Language:</Label>
                    <Select value={locale} onValueChange={setLocale}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LOCALES.map(l => (
                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {fields
                            .filter((field) => field.type !== 'file' && field.name !== imageFieldName && field.name !== 'locale') // Hide manual locale field if present in config
                            .map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <Label htmlFor={field.name}>
                                        {field.label} {field.required && '*'}
                                        {localizedFields.includes(field.name) && <span className="text-xs text-muted-foreground ml-1">({LOCALES.find(l => l.value === locale)?.label})</span>}
                                    </Label>
                                    {field.type === 'select' && field.options ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required={field.required}
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
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
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
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
                                        onClick={() => {
                                            setImageUrl(null);
                                            handleChange(imageFieldName, null);
                                        }}
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
                            <Label>{editorLabel} <span className="text-xs text-muted-foreground ml-1">({LOCALES.find(l => l.value === locale)?.label})</span></Label>
                            <TiptapEditor content={formValues.content} onChange={(val) => handleChange('content', val)} />
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
