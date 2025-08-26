'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarContent,
} from '@/components/ui/sidebar';
import { 
  UtensilsCrossed, 
  LogOut, 
  ClipboardList, 
  ChefHat, 
  Users, 
  Home,
  History,
  MessageSquare,
  BellDot,
  BarChart3,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Orders', icon: ClipboardList },
  { href: '/admin/menu', label: 'Set Menu', icon: ChefHat },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { href: '/admin/notifications', label: 'Notifications', icon: BellDot },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const userNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/history', label: 'Order History', icon: History },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/analytics', label: 'My Analytics', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
];

export function AppSidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const navLinks = role === 'admin' ? adminNavLinks : userNavLinks;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <UtensilsCrossed size={28} />
              </div>
              <h1 className="font-headline text-3xl text-primary group-data-[collapsible=icon]:hidden">
                30meals
              </h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(link.href)}
                    tooltip={link.label}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:p-0">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2">
            <LogOut size={16} />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="p-2 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
}
