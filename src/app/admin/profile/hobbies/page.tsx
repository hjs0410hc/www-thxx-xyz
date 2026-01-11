import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteHobby } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addHobby } from '@/lib/actions/profile-items';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';

export const metadata: Metadata = {
    title: 'Hobbies',
};

export default async function AdminHobbiesPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: hobbies } = await supabase
        .from('hobbies')
        .select('*, hobby_translations(*)')
        .order('created_at', { ascending: true });

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile">
                    <Button variant="ghost">← Back to Profile</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Add New Hobby"
                description="Add a hobby or interest to your profile"
                action={addHobby}
                fields={[
                    { name: 'name', label: 'Name', required: true, placeholder: 'Photography' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'photography' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary for list view...' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['name', 'description']}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Your Hobbies ({hobbies?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {hobbies && hobbies.length > 0 ? (
                        <div className="space-y-4">
                            {hobbies.map((hobby: any) => {
                                // Prefer KO, then EN, then first
                                const trans = hobby.hobby_translations?.find((t: any) => t.locale === 'ko')
                                    || hobby.hobby_translations?.find((t: any) => t.locale === 'en')
                                    || hobby.hobby_translations?.[0]
                                    || {};

                                return (
                                    <div key={hobby.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Link href={`/admin/profile/hobbies/${hobby.id}/edit`} className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold hover:text-primary">{trans.name || 'Untitled'}</h3>
                                                <span className="text-xs text-muted-foreground">/{hobby.slug}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {trans.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{trans.description}</p>
                                            )}
                                        </Link>
                                        <form action={deleteHobby.bind(null, hobby.id)}>
                                            <Button variant="ghost" size="icon" type="submit">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No hobbies added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
