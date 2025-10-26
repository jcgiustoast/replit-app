import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Overview from "@/pages/overview";
import CreateReport from "@/pages/create-report";
import SavedReportPage from "@/pages/saved-report";
import FolderDetail from "@/pages/folder-detail";
import NotFound from "@/pages/not-found";
import { Menu } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/create-report" component={CreateReport} />
      <Route path="/report/:id" component={SavedReportPage} />
      <Route path="/folder/:id" component={FolderDetail} />
      <Route path="/launch" component={NotFound} />
      <Route path="/settings" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                  <SidebarTrigger data-testid="button-sidebar-toggle">
                    <Menu className="w-5 h-5" />
                  </SidebarTrigger>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-hidden">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
