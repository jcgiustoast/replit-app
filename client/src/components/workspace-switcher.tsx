import { useState } from "react";
import { Check, ChevronsUpDown, Plus, UserPlus, Settings, Camera } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import type { Workspace } from "@shared/schema";

interface WorkspaceSwitcherProps {
  onSettingsClick?: () => void;
}

export function WorkspaceSwitcher({ onSettingsClick }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // For now, fetch all workspaces
  // In a real app, this would filter by authenticated user
  const { data: workspaces = [] } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces/all"],
  });

  const currentWorkspace = currentWorkspaceId 
    ? workspaces.find(w => w.id === currentWorkspaceId) 
    : workspaces[0];

  const handleWorkspaceSelect = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    setOpen(false);
    // TODO: Update app context with new workspace
  };

  const handleCreateWorkspace = () => {
    setOpen(false);
    // TODO: Open create workspace dialog
    console.log("Create workspace clicked");
  };

  const handleInvitePeople = () => {
    setOpen(false);
    // TODO: Open invite people dialog
    console.log("Invite people clicked");
  };

  const handleSettings = () => {
    setOpen(false);
    setLocation("/settings");
    onSettingsClick?.();
  };

  if (!currentWorkspace) {
    return (
      <Button variant="ghost" className="w-full justify-start gap-2" data-testid="button-workspace-switcher">
        <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-xs">
          ?
        </div>
        <span className="text-sm">No workspace</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between gap-2 hover-elevate active-elevate-2"
          data-testid="button-workspace-switcher"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-xs flex-shrink-0">
              {currentWorkspace.icon || currentWorkspace.name.charAt(0)}
            </div>
            <span className="text-sm font-medium truncate">{currentWorkspace.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar workspaces..." data-testid="input-search-workspaces" />
          <CommandList>
            <CommandEmpty>No se encontraron workspaces.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={workspace.name}
                  onSelect={() => handleWorkspaceSelect(workspace.id)}
                  data-testid={`workspace-item-${workspace.id}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-xs">
                      {workspace.icon || workspace.name.charAt(0)}
                    </div>
                    <span>{workspace.name}</span>
                  </div>
                  {currentWorkspace.id === workspace.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={handleSettings} data-testid="workspace-option-workspace-settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Workspace settings</span>
              </CommandItem>
              <CommandItem onSelect={handleInvitePeople} data-testid="workspace-option-invite">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invitar personas</span>
              </CommandItem>
              <CommandItem onSelect={handleCreateWorkspace} data-testid="workspace-option-create">
                <Plus className="mr-2 h-4 w-4" />
                <span>Crear workspace</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
