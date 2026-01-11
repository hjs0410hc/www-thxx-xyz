import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // Always use locale prefix
    localePrefix: 'always',
});

export const config = {
    // Match only internationalized pathnames, exclude admin routes and static files
    matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico|logo.png|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
