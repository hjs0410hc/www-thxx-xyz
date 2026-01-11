
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: 'THXX - Admin - %s',
        default: 'THXX - Admin',
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="min-h-screen bg-muted/30">
            {children}
        </div>
    );
}
