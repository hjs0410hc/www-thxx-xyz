import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateWorkExperience } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: work } = await supabase
        .from('work_experience')
        .select('*, translations:work_experience_translations(*)')
        .eq('id', id)
        .single();

    if (!work) {
        notFound();
    }

    const updateWorkExperienceWithId = updateWorkExperience.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/work">
                    <Button variant="ghost">← Back to Work Experience</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Work Experience"
                description="Update work history details"
                action={updateWorkExperienceWithId}
                initialData={work}
                fields={[
                    { name: 'company', label: 'Company', required: true, placeholder: 'Company Name' },
                    { name: 'position', label: 'Position', required: true, placeholder: 'Software Engineer' },
                    { name: 'location', label: 'Location', placeholder: 'Seoul, Korea' },
                    {
                        name: 'type',
                        label: 'Type',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'internship', label: 'Internship' },
                            { value: 'part_time', label: 'Part-time' },
                            { value: 'full_time', label: 'Full-time Job' },
                            { value: 'military_service', label: 'Military Service' },
                        ]
                    },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'google-software-engineer' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary for list view...' },
                    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
                    { name: 'end_date', label: 'End Date', type: 'date' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['company', 'position', 'location', 'description']}
            />
        </div>
    );
}
