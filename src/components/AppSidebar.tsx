
import { Link, useLocation } from 'react-router-dom';
import { Code, List } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      href: '/',
      label: 'Gerador',
      icon: Code,
    },
    {
      href: '/codes',
      label: 'Códigos Salvos',
      icon: List,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-2">Menu</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={item.label}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
