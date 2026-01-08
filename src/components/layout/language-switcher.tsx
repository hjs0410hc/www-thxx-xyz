'use client';

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, type Locale } from '@/i18n';
import Link from 'next/link';

const localeNames: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
};

export function LanguageSwitcher() {
    const params = useParams();
    const pathname = usePathname();
    const currentLocale = params.locale as Locale;

    const switchLocale = (newLocale: Locale) => {
        // Replace the locale in the current pathname
        const segments = pathname.split('/');
        segments[1] = newLocale;
        return segments.join('/');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((locale) => (
                    <DropdownMenuItem key={locale} asChild>
                        <Link
                            href={switchLocale(locale)}
                            className={currentLocale === locale ? 'font-bold' : ''}
                        >
                            {localeNames[locale]}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
