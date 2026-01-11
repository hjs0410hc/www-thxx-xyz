import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteEducation } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addEducation } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Education',
};

export default async function AdminEducationPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: education } = await supabase
        .from('education')
        .select('*, education_translations(*)')
        .order('start_date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Education"
                description="Add your educational background"
                action={addEducation}
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

            <Card>
                <CardHeader>
                    <CardTitle>Education History ({education?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {education && education.length > 0 ? (
                        <div className="space-y-4">
                            {education.map((edu: any) => {
                                const trans = edu.education_translations?.find((t: any) => t.locale === 'ko')
                                    || edu.education_translations?.find((t: any) => t.locale === 'en')
                                    || edu.education_translations?.[0]
                                    || {};

                                return (
                                    <div key={edu.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Link href={`/admin/profile/education/${edu.id}/edit`} className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold hover:text-primary">{trans.institution || 'Untitled'}</h3>
                                                <span className="text-xs text-muted-foreground">/{edu.slug}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{trans.degree} {trans.field && `in ${trans.field}`}</p>
                                            {trans.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{trans.description}</p>
                                            )}
                                        </Link>
                                        <form action={deleteEducation.bind(null, edu.id)}>
                                            <Button variant="ghost" size="icon" type="submit">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No education added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
