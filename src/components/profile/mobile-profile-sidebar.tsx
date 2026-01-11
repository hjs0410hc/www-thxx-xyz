'use client';

import { useState } from 'react';
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
import type { Locale } from '@/i18n';
import { ProfileSidebarContent } from './profile-sidebar-content';

export function MobileProfileSidebar({ profile, socialLinks }: { profile: any, socialLinks: any[] }) {
    const [open, setOpen] = useState(false);

    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const t = useTranslations('profile.nav');

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
