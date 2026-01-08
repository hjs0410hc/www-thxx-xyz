import { TechSidebar } from '@/components/tech/tech-sidebar';

export default function TechLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container py-8">
            <div className="flex gap-8">
                <div className="hidden md:block">
                    <TechSidebar />
                </div>
                <div className="flex-1 min-w-0">{/* min-w-0 to prevent flex child overflow */}
                    {children}
                </div>
            </div>
        </div>
    );
}
