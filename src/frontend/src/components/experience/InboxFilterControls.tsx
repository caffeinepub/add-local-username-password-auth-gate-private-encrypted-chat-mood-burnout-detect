import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Filter, X } from "lucide-react";

interface InboxFilterControlsProps {
  clients: string[];
  selectedClient: string | null;
  onClientChange: (client: string | null) => void;
  readFilter: "all" | "unread" | "read";
  onReadFilterChange: (filter: "all" | "unread" | "read") => void;
  sortOrder: "newest" | "oldest";
  onSortOrderChange: (order: "newest" | "oldest") => void;
  onClearFilters: () => void;
}

export default function InboxFilterControls({
  clients,
  selectedClient,
  onClientChange,
  readFilter,
  onReadFilterChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: InboxFilterControlsProps) {
  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`;
  };

  const hasActiveFilters =
    selectedClient !== null || readFilter !== "all" || sortOrder !== "newest";

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-secondary/30 border border-border/30">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Filters:</span>
      </div>

      <Select
        value={selectedClient || "all"}
        onValueChange={(v) => onClientChange(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All clients" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All clients</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client} value={client}>
              {formatPrincipal(client)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          variant={readFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onReadFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={readFilter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => onReadFilterChange("unread")}
        >
          Unread
        </Button>
        <Button
          variant={readFilter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => onReadFilterChange("read")}
        >
          Read
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onSortOrderChange(sortOrder === "newest" ? "oldest" : "newest")
        }
        className="gap-2"
      >
        <ArrowUpDown className="w-4 h-4" />
        {sortOrder === "newest" ? "Newest first" : "Oldest first"}
      </Button>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2 ml-auto"
        >
          <X className="w-4 h-4" />
          Clear filters
        </Button>
      )}

      {hasActiveFilters && (
        <Badge variant="secondary" className="ml-auto">
          {[
            selectedClient && "Client",
            readFilter !== "all" && "Status",
            sortOrder !== "newest" && "Sort",
          ]
            .filter(Boolean)
            .join(", ")}{" "}
          filtered
        </Badge>
      )}
    </div>
  );
}
