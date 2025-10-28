import { Home, TrendingUp, TrendingDown, BarChart3, Settings, FileBarChart, LineChart, MoreVertical, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SavedReport, Folder } from "@shared/schema";

const menuItems = [
  { title: "Overview", url: "/", icon: Home },
  { title: "Create report", url: "/create-report", icon: FileBarChart },
  { title: "Analítica", url: "/analitica", icon: LineChart },
];

const folderIconMap: Record<string, any> = {
  "trend-up": TrendingUp,
  "trend-down": TrendingDown,
  "bar-chart": BarChart3,
};

export function AppSidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  
  const { data: savedReports = [] } = useQuery<SavedReport[]>({
    queryKey: ["/api/saved-reports"],
  });

  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: ["/api/folders"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (reportId: string) => {
      await apiRequest("DELETE", `/api/saved-reports/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      toast({
        title: "Reporte eliminado",
        description: "El reporte se ha eliminado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el reporte",
        variant: "destructive",
      });
    },
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
              {folders.map((folder) => {
                const IconComponent = folder.icon ? folderIconMap[folder.icon] || FileBarChart : FileBarChart;
                return (
                  <SidebarMenuItem key={folder.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location === `/folder/${folder.id}`} 
                      data-testid={`link-folder-${folder.id}`}
                    >
                      <Link href={`/folder/${folder.id}`}>
                        <IconComponent className="w-4 h-4" />
                        <span>{folder.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Reportes guardados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedReports.map((report) => (
                <SidebarMenuItem key={report.id}>
                  <div className="flex items-center gap-1 w-full group">
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="flex-1 min-w-0">
                        <SidebarMenuButton 
                          asChild 
                          isActive={location === `/report/${report.id}`}
                          data-testid={`link-saved-report-${report.id}`}
                          className="w-full"
                        >
                          <Link href={`/report/${report.id}`}>
                            <FileBarChart className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{report.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {report.description && (
                        <TooltipContent side="right" className="max-w-xs">
                          <p>{report.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          data-testid={`button-report-menu-${report.id}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteMutation.mutate(report.id);
                          }}
                          data-testid={`button-delete-report-${report.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
