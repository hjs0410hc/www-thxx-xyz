import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateHobby } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditHobbyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: hobby } = await supabase
        .from('hobbies')
        .select('*')
        .eq('id', id)
        .single();

    if (!hobby) {
        notFound();
    }

    const updateHobbyWithId = updateHobby.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/hobbies">
                    <Button variant="ghost">← Back to Hobbies</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Hobby"
                description="Update hobby details"
                action={updateHobbyWithId}
                initialData={hobby}
                fields={[
                    { name: 'name', label: 'Name', required: true, placeholder: 'Photography' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'photography' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary for list view...' },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
            />
        </div>
    );
}
