"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InstanceData } from "@/lib/types";
import InstanceCard from "./instance-card";

interface InstanceGridProps {
  instances: InstanceData[];
  onRefresh?: () => void;
}

export default function InstanceGrid({
  instances,
  onRefresh,
}: InstanceGridProps) {
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
              onClick={onRefresh}
              className="h-7 border-green-500/30 hover:bg-green-500/10 text-xs"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {instances.map(instance => (
            <InstanceCard key={instance.uuid} instance={instance} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
