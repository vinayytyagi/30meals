import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { AuthProvider } from '@/components/auth/auth-provider';

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar role="user" />
        <SidebarInset>
          <main className="min-h-screen">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
