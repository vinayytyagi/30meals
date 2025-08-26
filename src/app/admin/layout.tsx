import { type ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { ClipboardList, ChefHat, Users, BellDot } from 'lucide-react';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Orders', icon: ClipboardList },
  { href: '/admin/menu', label: 'Set Menu', icon: ChefHat },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/notifications', label: 'Notifications', icon: BellDot },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar navLinks={adminNavLinks} />
      <SidebarInset>
        <main className="min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
