import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteExperience } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addExperience } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Experiences',
};

export default async function AdminExperiencesPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: experiences } = await supabase
        .from('experiences')
        .select('*, experience_translations(*)')
        .order('date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Experience"
                description="Add notable experiences and achievements"
                action={addExperience}
                fields={[
                    { name: 'title', label: 'Title', required: true, placeholder: 'Hackathon Winner' },
                    { name: 'organization', label: 'Organization', placeholder: 'Tech Conference' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'hackathon-2024' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'date', label: 'Start Date', type: 'date', required: true },
                    { name: 'end_date', label: 'End Date (Optional)', type: 'date' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['title', 'organization', 'description']}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Experiences ({experiences?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {experiences && experiences.length > 0 ? (
                        <div className="space-y-4">
                            {experiences.map((exp: any) => {
                                const trans = exp.experience_translations?.find((t: any) => t.locale === 'ko')
                                    || exp.experience_translations?.find((t: any) => t.locale === 'en')
                                    || exp.experience_translations?.[0]
                                    || {};

                                return (
                                    <div key={exp.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Link href={`/admin/profile/experiences-admin/${exp.id}/edit`} className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold hover:text-primary">{trans.title || 'Untitled'}</h3>
                                                <span className="text-xs text-muted-foreground">/{exp.slug}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {trans.organization && <p className="text-sm text-muted-foreground mb-1">{trans.organization}</p>}
                                            {trans.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{trans.description}</p>
                                            )}
                                        </Link>
                                        <form action={deleteExperience.bind(null, exp.id)}>
                                            <Button variant="ghost" size="icon" type="submit">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No experiences added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
