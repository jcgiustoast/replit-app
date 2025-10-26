import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FilterOperator = "is" | "contains" | "isNot" | "gt" | "lt" | "eq" | "gte" | "lte";
export type FunnelStage = "TOFU" | "MOFU" | "BOFU";

export interface AdvancedFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilter[];
  onChange: (filters: AdvancedFilter[]) => void;
}

const FILTER_FIELDS = [
  { value: "campaignName", label: "Campaign name", type: "text" },
  { value: "adSetName", label: "Ad set name", type: "text" },
  { value: "offers", label: "Offers", type: "text" },
  { value: "angulo", label: "Ángulo", type: "text" },
  { value: "funnelStage", label: "Funnel stage (TOFU/MOFU/BOFU)", type: "funnel" },
  { value: "spend", label: "Spend", type: "number" },
  { value: "roas", label: "ROAS", type: "number" },
  { value: "cpa", label: "CPA", type: "number" },
  { value: "ctr", label: "CTR", type: "number" },
  { value: "frequency", label: "Frequency", type: "number" },
  { value: "convertScore", label: "Convert Score", type: "number" },
];

const TEXT_OPERATORS = [
  { value: "is", label: "es" },
  { value: "contains", label: "contiene" },
  { value: "isNot", label: "no es" },
];

const NUMBER_OPERATORS = [
  { value: "eq", label: "igual a" },
  { value: "gt", label: "mayor que" },
  { value: "gte", label: "mayor o igual que" },
  { value: "lt", label: "menor que" },
  { value: "lte", label: "menor o igual que" },
];

const FUNNEL_STAGES = [
  { value: "TOFU", label: "TOFU (Top of Funnel)" },
  { value: "MOFU", label: "MOFU (Middle of Funnel)" },
  { value: "BOFU", label: "BOFU (Bottom of Funnel)" },
];

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<AdvancedFilter>>({
    field: "campaignName",
    operator: "is",
    value: "",
  });

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== "" && newFilter.value !== undefined) {
      const filter: AdvancedFilter = {
        id: `${Date.now()}-${Math.random()}`,
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value,
      };
      onChange([...filters, filter]);
      setNewFilter({
        field: "campaignName",
        operator: "is",
        value: "",
      });
    }
  };

  const handleRemoveFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const getFilterLabel = (filter: AdvancedFilter) => {
    const field = FILTER_FIELDS.find(f => f.value === filter.field);
    const fieldLabel = field?.label || filter.field;
    
    let operatorLabel = "";
    if (field?.type === "number") {
      operatorLabel = NUMBER_OPERATORS.find(o => o.value === filter.operator)?.label || filter.operator;
    } else if (field?.type === "text") {
      operatorLabel = TEXT_OPERATORS.find(o => o.value === filter.operator)?.label || filter.operator;
    } else if (field?.type === "funnel") {
      operatorLabel = "es";
    }
    
    return `${fieldLabel} ${operatorLabel} "${filter.value}"`;
  };

  const selectedField = FILTER_FIELDS.find(f => f.value === newFilter.field);
  const operators = selectedField?.type === "number" ? NUMBER_OPERATORS : TEXT_OPERATORS;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-add-filter">
              <Filter className="w-4 h-4" />
              Agregar filtro
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="start">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Campo</label>
                <Select
                  value={newFilter.field}
                  onValueChange={(value) => {
                    const field = FILTER_FIELDS.find(f => f.value === value);
                    setNewFilter({
                      field: value,
                      operator: field?.type === "number" ? "eq" : field?.type === "funnel" ? "is" : "is",
                      value: "",
                    });
                  }}
                >
                  <SelectTrigger data-testid="select-filter-field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_FIELDS.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedField?.type !== "funnel" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Operador</label>
                  <Select
                    value={newFilter.operator}
                    onValueChange={(value) => setNewFilter({ ...newFilter, operator: value as FilterOperator })}
                  >
                    <SelectTrigger data-testid="select-filter-operator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Valor</label>
                {selectedField?.type === "funnel" ? (
                  <Select
                    value={newFilter.value as string}
                    onValueChange={(value) => setNewFilter({ ...newFilter, value, operator: "is" })}
                  >
                    <SelectTrigger data-testid="select-filter-value">
                      <SelectValue placeholder="Seleccionar etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNNEL_STAGES.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={selectedField?.type === "number" ? "number" : "text"}
                    placeholder={selectedField?.type === "number" ? "Ej: 100" : "Ej: Fall Campaign"}
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: selectedField?.type === "number" ? parseFloat(e.target.value) : e.target.value })}
                    data-testid="input-filter-value"
                  />
                )}
              </div>

              <Button
                onClick={() => {
                  handleAddFilter();
                  setIsOpen(false);
                }}
                className="w-full"
                disabled={!newFilter.value}
                data-testid="button-confirm-filter"
              >
                Agregar
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {filters.length > 0 && (
          <span className="text-sm text-muted-foreground" data-testid="text-filter-count">
            {filters.length} {filters.length === 1 ? "filtro aplicado" : "filtros aplicados"}
          </span>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="gap-2 pr-1"
              data-testid={`badge-filter-${filter.id}`}
            >
              <span className="text-xs">{getFilterLabel(filter)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.id)}
                data-testid={`button-remove-filter-${filter.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
