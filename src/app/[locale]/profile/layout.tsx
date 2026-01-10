import { ProfileSidebar } from '@/components/profile/profile-sidebar';
import { MobileProfileSidebar } from '@/components/profile/mobile-profile-sidebar';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container py-8">
            <MobileProfileSidebar />
            <div className="flex gap-8">
                <ProfileSidebar />
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    );
}
