import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { FolderIcon, Loader2, ArrowLeft, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { Folder, SavedReport } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FolderDetail() {
  const [, params] = useRoute("/folder/:id");
  const [, setLocation] = useLocation();
  const folderId = params?.id;
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addReportsDialogOpen, setAddReportsDialogOpen] = useState(false);
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);

  const { data: folder, isLoading: folderLoading, isError } = useQuery<Folder>({
    queryKey: ["/api/folders", folderId],
    queryFn: async () => {
      if (!folderId) throw new Error("No folder ID");
      const res = await fetch(`/api/folders/${folderId}`);
      if (!res.ok) throw new Error("Failed to fetch folder");
      return res.json();
    },
    enabled: !!folderId,
  });

  const { data: allReports = [] } = useQuery<SavedReport[]>({
    queryKey: ["/api/saved-reports"],
    refetchOnMount: "always",
  });

  const folderReports = allReports.filter(
    (report) => report.folderId === folderId
  );

  const availableReports = allReports.filter(
    (report) => report.folderId !== folderId
  );

  const moveReportMutation = useMutation({
    mutationFn: async ({ reportId, newFolderId }: { reportId: string; newFolderId: string | null }) => {
      return await apiRequest("PATCH", `/api/saved-reports/${reportId}`, { folderId: newFolderId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      toast({
        title: "Reporte movido",
        description: "El reporte se ha movido exitosamente",
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

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      return await apiRequest("DELETE", `/api/folders/${folderId}`, undefined);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({
        title: "Carpeta eliminada",
        description: "La carpeta se ha eliminado exitosamente",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la carpeta",
        variant: "destructive",
      });
    },
  });

  const handleDeleteFolder = () => {
    if (folderId) {
      deleteFolderMutation.mutate(folderId);
    }
  };

  const addReportsMutation = useMutation({
    mutationFn: async (reportIds: string[]) => {
      return await Promise.all(
        reportIds.map((reportId) =>
          apiRequest("PATCH", `/api/saved-reports/${reportId}`, { folderId })
        )
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      toast({
        title: "Reportes agregados",
        description: `${selectedReportIds.length} ${selectedReportIds.length === 1 ? 'reporte agregado' : 'reportes agregados'} a la carpeta`,
      });
      setSelectedReportIds([]);
      setAddReportsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron agregar los reportes",
        variant: "destructive",
      });
    },
  });

  const handleAddReports = () => {
    if (selectedReportIds.length > 0) {
      addReportsMutation.mutate(selectedReportIds);
    }
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReportIds((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleDragStart = (e: React.DragEvent, reportId: string) => {
    e.dataTransfer.setData("reportId", reportId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const reportId = e.dataTransfer.getData("reportId");
    if (reportId && folderId) {
      moveReportMutation.mutate({ reportId, newFolderId: folderId });
    }
  };

  if (folderLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" data-testid="loader-folder" />
      </div>
    );
  }

  if (isError || !folder) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-error-title">
            Carpeta no encontrada
          </h2>
          <p className="text-muted-foreground" data-testid="text-error-message">
            La carpeta que buscas no existe.
          </p>
          <Link href="/">
            <Button className="mt-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FolderIcon className="w-6 h-6 text-primary" data-testid="icon-folder" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-folder-name">
                {folder.name}
              </h1>
              <p className="text-sm text-muted-foreground" data-testid="text-folder-count">
                {folderReports.length} {folderReports.length === 1 ? 'reporte' : 'reportes'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAddReportsDialogOpen(true)}
            data-testid="button-add-reports"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            data-testid="button-delete-folder"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {folderReports.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FolderIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">
              Esta carpeta está vacía
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="text-empty-message">
              Aún no hay reportes pre-armados en esta carpeta.
            </p>
            <Link href="/create-report">
              <Button data-testid="button-create-report">
                Crear reporte personalizado
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {folderReports.map((report) => (
            <div
              key={report.id}
              draggable
              onDragStart={(e) => handleDragStart(e, report.id)}
              data-testid={`draggable-report-${report.id}`}
            >
              <Link href={`/report/${report.id}`} data-testid={`link-report-${report.id}`}>
                <Card className="p-4 hover-elevate cursor-move">
                  <h3 className="font-semibold mb-1" data-testid={`text-report-name-${report.id}`}>
                    {report.name}
                  </h3>
                  {report.description && (
                    <p className="text-sm text-muted-foreground" data-testid={`text-report-desc-${report.id}`}>
                      {report.description}
                    </p>
                  )}
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        open={addReportsDialogOpen} 
        onOpenChange={(open) => {
          setAddReportsDialogOpen(open);
          if (!open) {
            setSelectedReportIds([]);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Agregar reportes a la carpeta</DialogTitle>
            <DialogDescription>
              Selecciona los reportes que deseas agregar a "{folder.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 py-4">
            {availableReports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-available-reports">
                No hay reportes disponibles para agregar
              </p>
            ) : (
              availableReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                  data-testid={`report-item-${report.id}`}
                >
                  <Checkbox
                    checked={selectedReportIds.includes(report.id)}
                    onCheckedChange={() => toggleReportSelection(report.id)}
                    data-testid={`checkbox-report-${report.id}`}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm" data-testid={`text-available-report-name-${report.id}`}>
                      {report.name}
                    </h4>
                    {report.description && (
                      <p className="text-sm text-muted-foreground" data-testid={`text-available-report-desc-${report.id}`}>
                        {report.description}
                      </p>
                    )}
                    {report.folderId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        En otra carpeta
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddReportsDialogOpen(false);
                setSelectedReportIds([]);
              }}
              data-testid="button-cancel-add-reports"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddReports}
              disabled={selectedReportIds.length === 0 || addReportsMutation.isPending}
              data-testid="button-confirm-add-reports"
            >
              {addReportsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                `Agregar ${selectedReportIds.length > 0 ? `(${selectedReportIds.length})` : ''}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar carpeta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la carpeta "{folder.name}". Los reportes dentro de esta carpeta no se eliminarán, solo quedarán sin carpeta asignada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
