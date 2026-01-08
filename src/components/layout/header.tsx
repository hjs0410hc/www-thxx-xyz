'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import Image from 'next/image';
import type { Locale } from '@/i18n';

export function Header() {
    const params = useParams();
    const locale = params.locale as Locale;
    const t = useTranslations('nav');

    const navItems = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/profile`, label: t('profile') },
        { href: `/${locale}/tech`, label: t('tech') },
        { href: `/${locale}/blog`, label: t('blog') },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
                        <Image
                            src="/logo.png"
                            alt="thxx.xyz"
                            width={32}
                            height={32}
                            className="rounded-sm"
                        />
                        <span className="font-bold">THXX</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center space-x-1">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
