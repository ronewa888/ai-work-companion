import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, ListTodo, Search, MessageSquare, Zap, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListTodo },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-white shadow-[0_0_20px_-2px_rgba(236,72,153,0.5)]">
            <Zap className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold font-display text-gradient leading-tight">FlowMind AI</span>
            <span className="text-[11px] text-muted-foreground leading-tight">Workplace co-pilot</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "!bg-gradient-primary !text-white shadow-[0_0_18px_-4px_rgba(236,72,153,0.55)] hover:!opacity-95"
                          : "hover:bg-primary/10"
                      }
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Settings</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
