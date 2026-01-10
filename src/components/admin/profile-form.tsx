'use client';

import { useState } from 'react';
import { updateProfile, addSocialLink, deleteSocialLink, updateSocialLink, addLanguage, deleteLanguage, updateLanguage } from '@/lib/actions/profile';
import { uploadImage } from '@/lib/actions/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, CheckCircle2, Upload, Pencil, Save, Ban } from 'lucide-react';
import Image from 'next/image';
import { TiptapEditor } from '@/components/admin/tiptap-editor';

interface ProfileFormProps {
    profile: any;
    socialLinks: any[];
    languages: any[];
}

export function ProfileForm({ profile, socialLinks, languages }: ProfileFormProps) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string>(profile?.profile_image_url || '');
    const [uploading, setUploading] = useState(false);
    const [markdownContent, setMarkdownContent] = useState(profile?.markdown_content || null);
    const [editingSocialLink, setEditingSocialLink] = useState<string | null>(null);
    const [editingLanguage, setEditingLanguage] = useState<string | null>(null);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const url = await uploadImage(formData);
            setProfileImageUrl(url.url as string);
        } catch (error) {
            console.error('Upload failed:', error);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    async function handleProfileSubmit(formData: FormData) {
        setSuccess(false);
        setError(null);
        if (profileImageUrl) {
            formData.set('profile_image_url', profileImageUrl);
        }
        if (markdownContent) {
            formData.set('markdown_content', JSON.stringify(markdownContent));
        }
        const result = await updateProfile(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    }

    async function handleAddSocialLink(formData: FormData) {
        const result = await addSocialLink(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    async function handleDeleteSocialLink(id: string) {
        const result = await deleteSocialLink(id);
        if (result?.error) {
            setError(result.error);
        }
    }

    async function handleAddLanguage(formData: FormData) {
        const result = await addLanguage(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    async function handleDeleteLanguage(id: string) {
        const result = await deleteLanguage(id);
        if (result?.error) {
            setError(result.error);
        }
    }

    async function handleUpdateSocialLink(id: string, formData: FormData) {
        const result = await updateSocialLink(id, formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setEditingSocialLink(null);
        }
    }

    async function handleUpdateLanguage(id: string, formData: FormData) {
        const result = await updateLanguage(id, formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setEditingLanguage(null);
        }
    }

    return (
        <div className="space-y-6">
            {success && (
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Your personal and contact information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleProfileSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={profile?.name || ''}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={profile?.email || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={profile?.phone || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    name="nationality"
                                    defaultValue={profile?.nationality || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Birth Date</Label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    defaultValue={profile?.birth_date || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    name="gender"
                                    defaultValue={profile?.gender || ''}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={profile?.bio || ''}
                                rows={4}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Profile Image</Label>
                            {profileImageUrl ? (
                                <div className="relative inline-block">
                                    <Image
                                        src={profileImageUrl}
                                        alt="Profile"
                                        width={150}
                                        height={150}
                                        className="rounded-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2"
                                        onClick={() => setProfileImageUrl('')}
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
                                        id="profile-image-upload"
                                    />
                                    <Label htmlFor="profile-image-upload" className="cursor-pointer">
                                        <Button type="button" variant="outline" disabled={uploading} asChild>
                                            <span>
                                                <Upload className="h-4 w-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Profile Image'}
                                            </span>
                                        </Button>
                                    </Label>
                                </div>
                            )}
                        </div>





                        <Separator className="my-6" />

                        <div className="space-y-2">
                            <Label>About Section (Markdown)</Label>
                            <CardDescription className="mb-2">
                                Rich text content for your profile&apos;s &quot;About&quot; section
                            </CardDescription>
                            <TiptapEditor content={markdownContent} onChange={setMarkdownContent} />
                        </div>

                        <Button type="submit">Save Profile</Button>
                    </form>
                </CardContent>
            </Card>



            {/* Social Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                        Your social media and contact links
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Existing Links */}
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="space-y-2">
                            {socialLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    {editingSocialLink === link.id ? (
                                        <form
                                            action={(formData) => handleUpdateSocialLink(link.id, formData)}
                                            className="flex-1 flex gap-2 items-center"
                                        >
                                            <Input
                                                name="platform"
                                                defaultValue={link.platform}
                                                placeholder="Platform"
                                                className="w-1/3"
                                                required
                                            />
                                            <Input
                                                name="url"
                                                defaultValue={link.url}
                                                placeholder="URL"
                                                className="flex-1"
                                                required
                                            />
                                            <Button type="submit" size="icon" variant="ghost">
                                                <Save className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingSocialLink(null)}
                                            >
                                                <Ban className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </form>
                                    ) : (
                                        <>
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => setEditingSocialLink(link.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{link.platform}</p>
                                                    <Pencil className="h-3 w-3 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">{link.url}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteSocialLink(link.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <Separator />

                    {/* Add New Link */}
                    <form action={handleAddSocialLink} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input
                                    id="platform"
                                    name="platform"
                                    placeholder="GitHub"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    name="url"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    required
                                />
                            </div>
                        </div>

                        <Input
                            type="hidden"
                            name="display_order"
                            value={socialLinks?.length || 0}
                        />

                        <Button type="submit" variant="outline">Add Social Link</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Languages */}
            <Card>
                <CardHeader>
                    <CardTitle>Languages</CardTitle>
                    <CardDescription>
                        Your language proficiency
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Existing Languages */}
                    {languages && languages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {languages.map((lang) => (
                                <div key={lang.id}>
                                    {editingLanguage === lang.id ? (
                                        <div className="flex items-center gap-2 p-2 border rounded-md bg-background">
                                            <form
                                                action={(formData) => handleUpdateLanguage(lang.id, formData)}
                                                className="flex items-center gap-2"
                                            >
                                                <Input
                                                    name="language"
                                                    defaultValue={lang.language}
                                                    className="h-8 w-24"
                                                    placeholder="Lang"
                                                    required
                                                />
                                                <Input
                                                    name="proficiency_level"
                                                    defaultValue={lang.proficiency_level}
                                                    className="h-8 w-32"
                                                    placeholder="Level"
                                                    required
                                                />
                                                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                                                    <Save className="h-3 w-3 text-green-600" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => setEditingLanguage(null)}
                                                >
                                                    <Ban className="h-3 w-3 text-red-600" />
                                                </Button>
                                            </form>
                                        </div>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="text-sm py-2 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
                                            onClick={() => setEditingLanguage(lang.id)}
                                        >
                                            {lang.language} ({lang.proficiency_level})
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteLanguage(lang.id);
                                                }}
                                                className="inline ml-2 hover:text-destructive p-1 rounded-full hover:bg-muted"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <Separator />

                    {/* Add New Language */}
                    <form action={handleAddLanguage} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Input
                                    id="language"
                                    name="language"
                                    placeholder="English"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="proficiency_level">Proficiency Level</Label>
                                <Input
                                    id="proficiency_level"
                                    name="proficiency_level"
                                    placeholder="Native, Fluent, Intermediate, etc."
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="outline">Add Language</Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
