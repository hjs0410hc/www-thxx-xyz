import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
    locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
    const t = useTranslations();

    return (
        <section className="relative flex flex-col justify-center px-4 py-8 md:py-12 overflow-hidden border-b">
            {/* Background Gradient/Pattern (Optional) - simplified */}
            <div className="absolute inset-0 -z-10 bg-background" />

            {/* Container: Flex Row on Desktop */}
            <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12 max-w-6xl">

                {/* Text Content: Left Side */}
                <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl animate-in fade-in slide-in-from-left-4 duration-500 text-left">
                        {t('home.hero.greeting')}
                    </h1>

                    <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-left-5 duration-700 delay-150 text-left">
                        {t('home.hero.tagline')}
                    </p>
                </div>

                {/* Buttons: Right Side */}
                <div className="flex flex-row gap-3 animate-in fade-in slide-in-from-right-6 duration-700 delay-300 shrink-0">
                    <Button asChild size="default" className="rounded-full px-6">
                        <Link href={`/${locale}/profile`}>
                            {t('home.hero.cta.profile')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="default" className="rounded-full px-6">
                        <Link href={`/${locale}/projects`}>
                            {t('home.hero.cta.projects')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
