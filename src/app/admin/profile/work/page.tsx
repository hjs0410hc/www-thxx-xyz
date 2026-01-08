import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteWorkExperience } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addWorkExperience } from '@/lib/actions/profile-items';
import Link from 'next/link';

export default async function AdminWorkPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: work } = await supabase
        .from('work_experience')
        .select('*')
        .order('start_date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Work Experience"
                description="Add your professional work history"
                action={addWorkExperience}
                fields={[
                    { name: 'company', label: 'Company', required: true, placeholder: 'Company Name' },
                    { name: 'position', label: 'Position', required: true, placeholder: 'Software Engineer' },
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
                    <CardTitle>Work History ({work?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {work && work.length > 0 ? (
                        <div className="space-y-4">
                            {work.map((job) => (
                                <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                    <Link href={`/ko/profile/work/${job.slug}`} className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold hover:text-primary">{job.company}</h3>
                                            <span className="text-xs text-muted-foreground">/{job.slug}</span>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{job.position}</p>
                                        {job.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                                        )}
                                    </Link>
                                    <form action={deleteWorkExperience.bind(null, job.id)}>
                                        <Button variant="ghost" size="icon" type="submit">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No work experience added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
