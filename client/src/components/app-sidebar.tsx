import { Home, Users, FileText, TrendingUp, TrendingDown, BarChart3, Settings, FileBarChart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SavedReport } from "@shared/schema";

const menuItems = [
  { title: "Overview", url: "/", icon: Home },
  { title: "Create report", url: "/create-report", icon: FileBarChart },
  { title: "Explore Agents", url: "/explore", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
];

const analysisItems = [
  { title: "What's Working", url: "/working", icon: TrendingUp },
  { title: "What's Not Working", url: "/not-working", icon: TrendingDown },
  { title: "Launch Analysis", url: "/launch", icon: BarChart3 },
];

export function AppSidebar() {
  const [location] = useLocation();
  
  const { data: savedReports = [] } = useQuery<SavedReport[]>({
    queryKey: ["/api/saved-reports"],
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6">
            <h1 className="text-xl font-semibold">HEXCLAD</h1>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Reportes guardados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedReports.map((report) => (
                <SidebarMenuItem key={report.id}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="w-full">
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === `/report/${report.id}`}
                        data-testid={`link-saved-report-${report.id}`}
                      >
                        <Link href={`/report/${report.id}`}>
                          <FileBarChart className="w-4 h-4" />
                          <span>{report.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {report.description && (
                      <TooltipContent side="right" className="max-w-xs">
                        <p>{report.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild data-testid="link-settings">
                <Link href="/settings">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
