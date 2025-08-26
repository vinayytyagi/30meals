import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { AuthProvider } from '@/components/auth/auth-provider';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar role="admin" />
        <SidebarInset>
          <main className="min-h-screen">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
