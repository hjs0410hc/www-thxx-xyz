import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';
import { TiptapRenderer } from '@/components/blog/tiptap-renderer';
import { ProfileSections } from '@/components/profile/profile-sections';
import type { Locale } from '@/i18n';

export default async function ProfilePage({ params }: { params: { locale: Locale } }) {
    const supabase = await createClient();
    const locale = (await params).locale;

    const { data: profile } = await supabase.from('profiles').select('*').single();
    const { data: workExperience } = await supabase.from('work_experience').select('*').order('start_date', { ascending: false });
    const { data: education } = await supabase.from('education').select('*').order('start_date', { ascending: false });
    const { data: hobbies } = await supabase.from('hobbies').select('*');
    const { data: clubs } = await supabase.from('clubs').select('*').order('start_date', { ascending: false });
    const { data: experiences } = await supabase.from('experiences').select('*').order('date', { ascending: false });
    const { data: awards } = await supabase.from('awards').select('*').order('date', { ascending: false });
    const { data: certifications } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false });
    const { data: languages } = await supabase.from('languages').select('*').order('proficiency_level', { ascending: false });

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div>
                <h1 className="text-4xl font-bold mb-2">{profile?.name || 'Your Name'}</h1>
                <p className="text-xl text-muted-foreground">{profile?.bio || 'Add your bio'}</p>
            </div>

            {/* Markdown Content Section */}
            {profile?.markdown_content && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5" />
                        <h2 className="text-2xl font-bold">About</h2>
                    </div>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <TiptapRenderer content={profile.markdown_content} />
                    </div>
                </section>
            )}

            {/* Collapsible Sections */}
            <ProfileSections
                hobbies={hobbies || []}
                education={education || []}
                workExperience={workExperience || []}
                clubs={clubs || []}
                awards={awards || []}
                certifications={certifications || []}
                experiences={experiences || []}
                languages={languages || []}
            />
        </div>
    );
}
