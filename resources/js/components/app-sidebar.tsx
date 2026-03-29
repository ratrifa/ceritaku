import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, ChevronDown, Cog, Folder, KeyRound, LayoutGrid, SunMoon, User } from 'lucide-react';
import AppLogo from './app-logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        url: '/home',
        icon: LayoutGrid,
    },
];

const settingsNavItems: NavItem[] = [
    
    {
        title: 'Profile',
        url: '/settings/profile',
        icon: User,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: SunMoon,
    },
    {
        title: 'Password',
        url: '/settings/password',
        icon: KeyRound,
    }
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/home" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <Collapsible defaultOpen className='group/collapsible'>
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        <Cog className='h-4 w-4 gap-2'></Cog>
                        Settings
                        <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180'></ChevronDown>
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarMenu>
                        <NavMain items={settingsNavItems} />
                    </SidebarMenu>
                </CollapsibleContent>
            </SidebarGroup>
            </Collapsible>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
