import { TechSidebar } from '@/components/tech/tech-sidebar';
import { MobileTechSidebar } from '@/components/tech/mobile-tech-sidebar';
import { createClient } from '@/lib/supabase/server';

export default async function TechLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();

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

    return (
        <div className="container py-8">
            <MobileTechSidebar profile={profile} />
            <div className="flex gap-8">
                <div className="hidden md:block">
                    <TechSidebar profile={profile} className="w-80 border-r pr-8 h-fit sticky top-24" />
                </div>
                <div className="flex-1 min-w-0">{/* min-w-0 to prevent flex child overflow */}
                    {children}
                </div>
            </div>
        </div>
    );
}
