import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { updateCertification } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: certification } = await supabase
        .from('certifications')
        .select('*')
        .eq('id', id)
        .single();

    if (!certification) {
        notFound();
    }

    const updateCertificationWithId = updateCertification.bind(null, id);

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-6">
                <Link href="/admin/profile/certifications-admin">
                    <Button variant="ghost">← Back to Certifications</Button>
                </Link>
            </div>

            <ProfileFormWithEditor
                title="Edit Certification"
                description="Update certification details"
                action={updateCertificationWithId}
                initialData={certification}
                fields={[
                    { name: 'name', label: 'Certification Name', required: true, placeholder: 'AWS Certified Solutions Architect' },
                    { name: 'issuer', label: 'Issuer', required: true, placeholder: 'Amazon Web Services' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'aws-solutions-architect' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
                    { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
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
