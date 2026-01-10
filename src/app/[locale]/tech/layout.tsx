import { TechSidebar } from '@/components/tech/tech-sidebar';
import { MobileTechSidebar } from '@/components/tech/mobile-tech-sidebar';

export default function TechLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container py-8">
            <MobileTechSidebar />
            <div className="flex gap-8">
                <div className="hidden md:block">
                    <TechSidebar className="w-80 border-r pr-8 h-fit sticky top-24" />
                </div>
                <div className="flex-1 min-w-0">{/* min-w-0 to prevent flex child overflow */}
                    {children}
                </div>
            </div>
        </div>
    );
}
