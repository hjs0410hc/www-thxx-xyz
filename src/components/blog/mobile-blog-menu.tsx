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
import { BlogSidebar } from './blog-sidebar';

interface MobileBlogMenuProps {
    tags: { name: string; count: number }[];
    currentTag?: string;
    locale: string;
}

export function MobileBlogMenu({ tags, currentTag, locale }: MobileBlogMenuProps) {
    const [open, setOpen] = useState(false);
    const t = useTranslations('profile.nav'); // Reusing 'profile.nav.profile' (Menu) key

    return (
        <div className="lg:hidden w-full flex justify-start mb-4">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Menu className="h-4 w-4" />
                        {t('profile')}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto px-4">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-left">{t('profile')}</SheetTitle>
                    </SheetHeader>
                    {/* 
                        BlogSidebar typically handles navigation/search which updates URL.
                        If it works via URL updates, we might want to close the sheet on interaction.
                        However, BlogSidebar usually contains inputs (search) and links (tags).
                        If there are links, we can try to intercept or just let user close manually.
                        Given typical sidebar behavior, we often want search to NOT close immediately,
                        but clicking a tag MIGHT close it. 
                        Let's check BlogSidebar content from the view_file call to see if it accepts an onInteract prop.
                        If not, we might just render it for now.
                    */}
                    <BlogSidebar tags={tags} currentTag={currentTag} locale={locale} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
