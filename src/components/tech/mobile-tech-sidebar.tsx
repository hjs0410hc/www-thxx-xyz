'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { TechSidebar } from './tech-sidebar';

export function MobileTechSidebar() {
    const [open, setOpen] = useState(false);
    const t = useTranslations('profile.nav'); // Reusing 'profile' label key if strictly needed, or maybe 'tech.nav' has a menu key? 
    // Actually user asked to modify button translation to "Menu" which is now in 'profile.nav.profile'.
    // Let's use 'profile.nav.profile' based on previous context, or check if 'tech.nav' has a better fit.
    // The user said: "modify button(that opens mobile sidebar)'s translation to "Menu" "메뉴" "メニュー"." and we did that in 'profile.nav.profile'.
    // So distinct from "Profile", it is now "Menu".

    return (
        <div className="md:hidden w-full flex justify-start mb-4">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Menu className="h-4 w-4" />
                        {t('profile')}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto px-4">
                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-left">{t('profile')}</SheetTitle>
                    </SheetHeader>
                    <TechSidebar onLinkClick={() => setOpen(false)} hideProfileInfo={true} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
