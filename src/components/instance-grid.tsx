"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InstanceData } from "@/lib/types";
import InstanceCard from "./instance-card";

interface InstanceGridProps {
  instances: InstanceData[];
}

export default function InstanceGrid({ instances }: InstanceGridProps) {
  const [sortBy, setSortBy] = useState<"id" | "status">("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: "id" | "status") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedInstances = [...instances].sort((a, b) => {
    if (sortBy === "id") {
      return sortDirection === "asc"
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    } else {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
  });

  return (
    <Card className="flex-1 border-green-500/30 bg-black/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Instances</h2>
            <span className="text-xs text-green-500/70">
              {instances.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-green-500/30 hover:bg-green-500/10 text-xs"
              onClick={() => toggleSort("id")}
            >
              ID{" "}
              {sortBy === "id" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ))}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-green-500/30 hover:bg-green-500/10 text-xs"
              onClick={() => toggleSort("status")}
            >
              Status{" "}
              {sortBy === "status" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ))}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {sortedInstances.map(instance => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
