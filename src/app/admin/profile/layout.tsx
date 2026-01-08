import { AdminProfileSidebar } from '@/components/admin/admin-profile-sidebar';

export default function AdminProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AdminProfileSidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
