import { ProfileSidebar } from '@/components/profile/profile-sidebar';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container py-8">
            <div className="flex gap-8">
                <ProfileSidebar />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
