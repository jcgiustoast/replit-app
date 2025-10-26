import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertSavedReport } from "@shared/schema";
import type { AdvancedFilter } from "./advanced-filters";

const saveReportFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

type SaveReportFormData = z.infer<typeof saveReportFormSchema>;

interface SaveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: string[];
  filters?: AdvancedFilter[];
}

export function SaveReportDialog({ open, onOpenChange, metrics, filters = [] }: SaveReportDialogProps) {
  const { toast } = useToast();
  const form = useForm<SaveReportFormData>({
    resolver: zodResolver(saveReportFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: InsertSavedReport) => {
      return await apiRequest("POST", "/api/saved-reports", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-reports"] });
      toast({
        title: "Reporte guardado",
        description: "El reporte ha sido guardado exitosamente",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar el reporte",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SaveReportFormData) => {
    const reportData: InsertSavedReport = {
      name: data.name,
      description: data.description || null,
      metrics,
      filters: filters.length > 0 ? filters : null,
    };
    saveMutation.mutate(reportData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-save-report">
        <DialogHeader>
          <DialogTitle>Guardar Reporte</DialogTitle>
          <DialogDescription>
            Dale un nombre a este reporte para identificarlo fácilmente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Análisis de ROAS y Spend" 
                      {...field} 
                      data-testid="input-report-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción breve del reporte..."
                      className="resize-none"
                      {...field}
                      data-testid="input-report-description"
                    />
                  </FormControl>
                  <FormDescription>
                    Esta descripción se mostrará al hacer hover sobre el reporte
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                data-testid="button-cancel-save-report"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                data-testid="button-confirm-save-report"
              >
                {saveMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
