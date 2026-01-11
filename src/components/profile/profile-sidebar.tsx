'use client';

import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';
import { ProfileSidebarContent } from './profile-sidebar-content';



export function ProfileSidebar({ profile, socialLinks }: { profile: any, socialLinks: any[] }) {
    const t = useTranslations('profile.nav');
    const ct = useTranslations('common');
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;

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
