import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateClub } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase.from('clubs').select('*, club_translations(*)').eq('id', id).single();

    if (!item) return { title: 'Edit Club' };

    const trans = item.club_translations?.find((t: any) => t.locale === 'ko' || t.locale === 'en') || {};
    return {
        title: `Edit ${trans.name || 'Club'}`,
    };
}

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: club } = await supabase
        .from('clubs')
        .select('*, translations:club_translations(*)')
        .eq('id', id)
        .single();

    if (!club) {
        notFound();
    }

    const updateClubWithId = updateClub.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/clubs">
                    <Button variant="ghost">← Back to Clubs</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Club/Activity"
                description="Update club details"
                action={updateClubWithId}
                initialData={club}
                fields={[
                    { name: 'name', label: 'Club Name', required: true, placeholder: 'Coding Club' },
                    { name: 'role', label: 'Role', placeholder: 'President' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'robotics-club' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
                    { name: 'end_date', label: 'End Date', type: 'date' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['name', 'role', 'description']}
            />
        </div>
    );
}
