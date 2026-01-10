'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { User, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/i18n';
import { ProfileSidebarContent } from './profile-sidebar-content';

export function MobileProfileSidebar() {
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);

    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const t = useTranslations('profile.nav');

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
    }, [locale]);

    return (
        <div className="md:hidden w-full flex justify-start mb-4">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Menu className="h-4 w-4" />
                        {t('profile')}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
                    <SheetHeader className="p-4 border-b text-left">
                        <SheetTitle className="text-left">{t('profile')}</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <ProfileSidebarContent
                            profile={profile}
                            socialLinks={socialLinks}
                            locale={locale}
                            pathname={pathname}
                            onLinkClick={() => setOpen(false)}
                            hideProfileInfo={true}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
