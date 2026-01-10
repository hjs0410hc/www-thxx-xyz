'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
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
                <div className="mr-4 flex items-center">
                    <div className="md:hidden mr-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="pr-0">
                                <SheetHeader>
                                    <SheetTitle className="text-left px-4">THXX</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col space-y-4 px-4 mt-4">
                                    {navItems.map((item) => (
                                        <SheetClose asChild key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                                            >
                                                {item.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
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
