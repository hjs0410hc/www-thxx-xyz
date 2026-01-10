import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
    const t = useTranslations('common');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        {t('copyright', { year: currentYear })}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {/* <Link
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        GitHub
                    </Link>
                    <Link
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        LinkedIn
                    </Link> */}
                </div>
            </div>
        </footer>
    );
}
