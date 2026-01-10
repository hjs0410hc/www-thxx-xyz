import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateAward } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditAwardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: award } = await supabase
        .from('awards')
        .select('*')
        .eq('id', id)
        .single();

    if (!award) {
        notFound();
    }

    const updateAwardWithId = updateAward.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/awards-admin">
                    <Button variant="ghost">← Back to Awards</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Award"
                description="Update award details"
                action={updateAwardWithId}
                initialData={award}
                fields={[
                    { name: 'title', label: 'Award Title', required: true, placeholder: 'Best Project Award' },
                    { name: 'issuer', label: 'Issuer', required: true, placeholder: 'Organization Name' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'topcit-4th' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'date', label: 'Date', type: 'date', required: true },
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
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
            />
        </div>
    );
}
