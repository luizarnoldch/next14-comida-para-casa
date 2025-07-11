import React from "react";
import { BookOpen, BotIcon, ChevronRightIcon, HomeIcon, Settings2, ShoppingCartIcon, SquareTerminalIcon } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define the shape of sub-items
interface SidebarSubItem {
  title: string;
  url: string;
}

// Define the shape of top-level items
interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  items?: SidebarSubItem[];
}



const items: SidebarItem[] = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: HomeIcon,
    isActive: false,
    items: [
      { title: 'Analytics', url: '/dashboard' },
      { title: 'Starred', url: '#' },
      { title: 'Settings', url: '#' },
    ],
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: ShoppingCartIcon,
    isActive: false,
    items: [
      { title: 'Gallery', url: '/dashboard/products' },
      { title: 'New Products', url: '/dashboard/products/create' },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpen,
    isActive: false,
    items: [
      { title: 'Introduction', url: '#' },
      { title: 'Get Started', url: '#' },
      { title: 'Tutorials', url: '#' },
      { title: 'Changelog', url: '#' },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    isActive: false,
    items: [
      { title: 'General', url: '#' },
      { title: 'Team', url: '#' },
      { title: 'Billing', url: '#' },
      { title: 'Limits', url: '#' },
    ],
  },
];

type SidebarDashboardContentProps = {}

const SidebarDashboardContent: React.FC<SidebarDashboardContentProps> = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Store</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={Boolean(item.isActive)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarDashboardContent;
