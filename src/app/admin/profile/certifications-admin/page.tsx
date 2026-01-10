import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteCertification } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addCertification } from '@/lib/actions/profile-items';
import Link from 'next/link';

export default async function AdminCertificationsPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Certification"
                description="Add professional certifications and licenses"
                action={addCertification}
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

            <Card>
                <CardHeader>
                    <CardTitle>Certifications ({certifications?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {certifications && certifications.length > 0 ? (
                        <div className="space-y-4">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <Link href={`/admin/profile/certifications-admin/${cert.id}/edit`} className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold hover:text-primary">{cert.name}</h3>
                                            <span className="text-xs text-muted-foreground">/{cert.slug}</span>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                                        {cert.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                                        )}
                                    </Link>
                                    <form action={deleteCertification.bind(null, cert.id)}>
                                        <Button variant="ghost" size="icon" type="submit">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No certifications added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
