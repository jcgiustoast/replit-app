import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderIcon, Clock } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFolderSchema, type InsertFolder } from "@shared/schema";
import type { Folder, RecentReport } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Overview() {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const { toast } = useToast();

  const { data: folders = [], isLoading: foldersLoading } = useQuery<Folder[]>({
    queryKey: ["/api/folders"],
  });

  const { data: recentReports = [], isLoading: recentLoading } = useQuery<RecentReport[]>({
    queryKey: ["/api/recent-reports"],
  });

  const form = useForm<InsertFolder>({
    resolver: zodResolver(insertFolderSchema),
    defaultValues: {
      name: "",
      icon: null,
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (data: InsertFolder) => {
      return await apiRequest("POST", "/api/folders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setCreateFolderOpen(false);
      form.reset();
      toast({
        title: "Carpeta creada",
        description: "La carpeta se ha creado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la carpeta",
        variant: "destructive",
      });
    },
  });

  const onSubmitFolder = (data: InsertFolder) => {
    createFolderMutation.mutate(data);
  };

  const moveReportMutation = useMutation({
    mutationFn: async ({ reportId, newFolderId }: { reportId: string; newFolderId: string | null }) => {
      return await apiRequest("PATCH", `/api/saved-reports/${reportId}`, { folderId: newFolderId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      await queryClient.refetchQueries({ queryKey: ["/api/saved-reports"] });
      toast({
        title: "Reporte movido",
        description: "El reporte se ha movido a la carpeta",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo mover el reporte",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const reportId = e.dataTransfer.getData("reportId");
    if (reportId) {
      moveReportMutation.mutate({ reportId, newFolderId: folderId });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overview</h1>
        <p className="text-muted-foreground">
          Gestiona y analiza el rendimiento de tus creatividades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/create-report" data-testid="link-create-report">
          <Card className="p-6 hover-elevate cursor-pointer h-full">
            <div className="flex flex-col items-start gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Plus className="w-6 h-6 text-primary" data-testid="icon-plus" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" data-testid="text-create-title">
                  Crear reporte personalizado
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-create-description">
                  Crea reportes y obtén insights sobre el rendimiento de tus creatividades
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-5 h-5" data-testid="icon-folder" />
            <h2 className="text-2xl font-bold" data-testid="text-folders-title">Folders</h2>
          </div>
          <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-folder">
                <Plus className="w-4 h-4 mr-2" />
                Nueva carpeta
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-folder">
              <DialogHeader>
                <DialogTitle>Crear nueva carpeta</DialogTitle>
                <DialogDescription>
                  Crea una carpeta personalizada para organizar tus reportes
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitFolder)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la carpeta</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Análisis de Q4" 
                            {...field} 
                            data-testid="input-folder-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateFolderOpen(false)}
                      data-testid="button-cancel-folder"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createFolderMutation.isPending}
                      data-testid="button-submit-folder"
                    >
                      {createFolderMutation.isPending ? "Creando..." : "Crear carpeta"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {foldersLoading ? (
          <div className="text-muted-foreground" data-testid="text-folders-loading">Cargando carpetas...</div>
        ) : folders.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground text-center" data-testid="text-no-folders">
              No hay carpetas creadas aún
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
                data-testid={`drop-zone-folder-${folder.id}`}
              >
                <Link href={`/folder/${folder.id}`} data-testid={`link-folder-${folder.id}`}>
                  <Card className="p-4 hover-elevate cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FolderIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium" data-testid={`text-folder-name-${folder.id}`}>
                        {folder.name}
                      </span>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" data-testid="icon-clock" />
          <h2 className="text-2xl font-bold" data-testid="text-recent-title">Últimos reportes vistos</h2>
        </div>

        {recentLoading ? (
          <div className="text-muted-foreground" data-testid="text-recent-loading">Cargando reportes recientes...</div>
        ) : recentReports.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground text-center" data-testid="text-no-recent">
              No has abierto ningún reporte recientemente
            </p>
          </Card>
        ) : (
          <Card className="p-4">
            <div className="space-y-2">
              {recentReports.map((report) => (
                <Link key={report.id} href={`/report/${report.reportId}`} data-testid={`link-recent-${report.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-md hover-elevate cursor-pointer">
                    <span className="font-medium" data-testid={`text-report-name-${report.id}`}>
                      {report.reportName}
                    </span>
                    <span className="text-sm text-muted-foreground" data-testid={`text-report-date-${report.id}`}>
                      {new Date(report.lastOpenedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
