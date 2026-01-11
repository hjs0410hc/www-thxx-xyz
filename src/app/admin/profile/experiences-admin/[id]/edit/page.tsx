import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateExperience } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: item } = await supabase.from('experiences').select('*, experience_translations(*)').eq('id', id).single();

    if (!item) return { title: 'Edit Experience' };

    const trans = item.experience_translations?.find((t: any) => t.locale === 'ko' || t.locale === 'en') || {};
    return {
        title: `Edit ${trans.title || 'Experience'}`,
    };
}

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: experience } = await supabase
        .from('experiences')
        .select('*, translations:experience_translations(*)')
        .eq('id', id)
        .single();

    if (!experience) {
        notFound();
    }

    const updateExperienceWithId = updateExperience.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/experiences-admin">
                    <Button variant="ghost">← Back to Experiences</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Experience"
                description="Update experience details"
                action={updateExperienceWithId}
                initialData={experience}
                fields={[
                    { name: 'title', label: 'Title', required: true, placeholder: 'Hackathon Winner' },
                    { name: 'organization', label: 'Organization', placeholder: 'Tech Conference' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'hackathon-2024' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'date', label: 'Date', type: 'date', required: true },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['title', 'organization', 'description']}
            />
        </div>
    );
}
