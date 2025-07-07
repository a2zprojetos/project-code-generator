
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
import logoA2Z from '@assets/476284185_9672782622732554_7779269226472463925_n (1)_1751931917903.jpg';

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
        <div className="flex flex-col items-center p-4">
          <img 
            src={logoA2Z} 
            alt="A2Z Projetos" 
            className="h-12 w-auto object-contain mb-2"
          />
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <Separator />
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
