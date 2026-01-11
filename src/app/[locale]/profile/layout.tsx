import { ProfileSidebar } from '@/components/profile/profile-sidebar';
import { MobileProfileSidebar } from '@/components/profile/mobile-profile-sidebar';
import { createClient } from '@/lib/supabase/server';

export default async function ProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();
    const { data: socialLinksData } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });

    let profile = null;
    if (profileData) {
        const translations = profileData.profile_translations || [];
        const trans = translations.find((t: any) => t.locale === locale)
            || translations.find((t: any) => t.locale === 'ko')
            || translations.find((t: any) => t.locale === 'en')
            || translations[0]
            || {};
        profile = { ...profileData, ...trans };
    }

    const socialLinks = socialLinksData || [];

    return (
        <div className="container py-8">
            <MobileProfileSidebar profile={profile} socialLinks={socialLinks} />
            <div className="flex gap-8">
                <ProfileSidebar profile={profile} socialLinks={socialLinks} />
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    );
}
