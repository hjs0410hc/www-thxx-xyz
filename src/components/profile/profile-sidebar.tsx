'use client';

import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProfileSidebarContent } from './profile-sidebar-content';



export function ProfileSidebar() {
    const t = useTranslations('profile.nav');
    const ct = useTranslations('common');
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const [profile, setProfile] = useState<any>(null);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: profileData } = await supabase.from('profiles').select('*, profile_translations(*)').single();
            const { data: socialLinksData } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });

            if (profileData) {
                const translations = profileData.profile_translations || [];
                const trans = translations.find((t: any) => t.locale === locale)
                    || translations.find((t: any) => t.locale === 'ko')
                    || translations.find((t: any) => t.locale === 'en')
                    || translations[0]
                    || {};
                setProfile({ ...profileData, ...trans });
            }

            setSocialLinks(socialLinksData || []);
        };
        fetchData();
    }, []);

    return (
        <aside className="hidden md:flex w-80 flex-col gap-6 border-r pr-8">
            <ProfileSidebarContent
                profile={profile}
                socialLinks={socialLinks}
                locale={locale}
                pathname={pathname}
            />
        </aside>
    );
}
