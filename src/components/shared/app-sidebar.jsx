'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  BellDot
} from 'lucide-react';
import { Button } from '../ui/button';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Orders', icon: ClipboardList },
  { href: '/admin/menu', label: 'Set Menu', icon: ChefHat },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { href: '/admin/notifications', label: 'Notifications', icon: BellDot },
];

const userNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/history', label: 'Order History', icon: History },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
];

export function AppSidebar({ role }) {
  const pathname = usePathname();
  const navLinks = role === 'admin' ? adminNavLinks : userNavLinks;

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
                <Link href={link.href} legacyBehavior passHref>
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
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut size={16} />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Button>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <div className="p-2 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
}
