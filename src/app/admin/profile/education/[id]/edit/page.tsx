import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateEducation } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: education } = await supabase
        .from('education')
        .select('*, translations:education_translations(*)')
        .eq('id', id)
        .single();

    if (!education) {
        notFound();
    }

    const updateEducationWithId = updateEducation.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/education">
                    <Button variant="ghost">← Back to Education</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Education"
                description="Update educational background"
                action={updateEducationWithId}
                initialData={education}
                fields={[
                    { name: 'institution', label: 'Institution', required: true, placeholder: 'University Name' },
                    { name: 'degree', label: 'Degree', required: true, placeholder: "Bachelor's" },
                    { name: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
                    {
                        name: 'type',
                        label: 'Type',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'university', label: 'University' },
                            { value: 'study_abroad', label: 'Study Abroad' },
                            { value: 'course', label: 'Course' },
                        ]
                    },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'mit-computer-science' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary for list view...' },
                    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
                    { name: 'end_date', label: 'End Date', type: 'date' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['institution', 'degree', 'field', 'description']}
            />
        </div>
    );
}
