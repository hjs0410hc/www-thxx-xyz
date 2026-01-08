import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteClub } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addClub } from '@/lib/actions/profile-items';
import Link from 'next/link';

export default async function AdminClubsPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: clubs } = await supabase
        .from('clubs')
        .select('*')
        .order('start_date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Club/Activity"
                description="Add extracurricular activities and clubs"
                action={addClub}
                fields={[
                    { name: 'name', label: 'Club Name', required: true, placeholder: 'Coding Club' },
                    { name: 'role', label: 'Role', placeholder: 'President' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'robotics-club' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    {
                        name: 'locale',
                        label: 'Language',
                        type: 'select',
                        options: [
                            { value: 'ko', label: 'Korean' },
                            { value: 'en', label: 'English' },
                            { value: 'ja', label: 'Japanese' },
                        ]
                    },
                    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
                    { name: 'end_date', label: 'End Date', type: 'date' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Clubs & Activities ({clubs?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {clubs && clubs.length > 0 ? (
                        <div className="space-y-4">
                            {clubs.map((club) => (
                                <div key={club.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <Link href={`/ko/profile/clubs/${club.slug}`} className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold hover:text-primary">{club.name}</h3>
                                            <span className="text-xs text-muted-foreground">/{club.slug}</span>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        {club.role && <p className="text-sm text-muted-foreground mb-1">{club.role}</p>}
                                        {club.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>
                                        )}
                                    </Link>
                                    <form action={deleteClub.bind(null, club.id)}>
                                        <Button variant="ghost" size="icon" type="submit">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No clubs added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
