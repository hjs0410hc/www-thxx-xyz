import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { deleteAward } from '@/lib/actions/profile-items';
import { ProfileFormWithEditor } from '@/components/admin/profile-form-with-editor';
import { addAward } from '@/lib/actions/profile-items';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Awards',
};

export default async function AdminAwardsPage() {
    const user = await getUser();
    if (!user) redirect('/admin/login');

    const supabase = await createClient();
    const { data: awards } = await supabase
        .from('awards')
        .select('*, award_translations(*)')
        .order('date', { ascending: false });

    return (
        <div className="container max-w-4xl py-8">
            <ProfileFormWithEditor
                title="Add Award"
                description="Add awards and recognitions"
                action={addAward}
                fields={[
                    { name: 'title', label: 'Award Title', required: true, placeholder: 'Best Project Award' },
                    { name: 'issuer', label: 'Issuer', required: true, placeholder: 'Organization Name' },
                    { name: 'slug', label: 'Slug (URL)', required: true, placeholder: 'topcit-4th' },
                    { name: 'description', label: 'Short Description', placeholder: 'Brief summary...' },
                    { name: 'date', label: 'Date', type: 'date', required: true },
                ]}
                hasEditor={true}
                editorLabel="Content"
                hasImageUpload={true}
                imageFieldName="preview_image"
                localizedFields={['title', 'issuer', 'description']}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Awards ({awards?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {awards && awards.length > 0 ? (
                        <div className="space-y-4">
                            {awards.map((award: any) => {
                                const trans = award.award_translations?.find((t: any) => t.locale === 'ko')
                                    || award.award_translations?.find((t: any) => t.locale === 'en')
                                    || award.award_translations?.[0]
                                    || {};

                                return (
                                    <div key={award.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                        <Link href={`/admin/profile/awards-admin/${award.id}/edit`} className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold hover:text-primary">{trans.title || 'Untitled'}</h3>
                                                <span className="text-xs text-muted-foreground">/{award.slug}</span>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{trans.issuer}</p>
                                            {trans.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{trans.description}</p>
                                            )}
                                        </Link>
                                        <form action={deleteAward.bind(null, award.id)}>
                                            <Button variant="ghost" size="icon" type="submit">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No awards added yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
