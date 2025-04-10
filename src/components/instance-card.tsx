import { Activity, Server } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { InstanceData } from "@/lib/types";

interface InstanceCardProps {
  instance: InstanceData;
  onClick: (instance: InstanceData) => void;
}

export default function InstanceCard({ instance, onClick }: InstanceCardProps) {
  const statusColor =
    instance.status === "running"
      ? "text-green-400 border-green-500/50 bg-green-500/10"
      : "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
  const progress = instance.progress ? instance.progress * 100 : 0;

  return (
    <Card
      onClick={() => {
        onClick(instance);
      }}
      className="border border-green-500/30 bg-black hover:bg-green-950/30 transition-colors group"
    >
      <CardContent className="p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Server className="h-4 w-4 text-green-500/70" />
          <div
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusColor}`}
          >
            <Activity className="h-3 w-3" />
            {instance.status}
          </div>
        </div>
        <div
          className="text-xs font-mono mt-1 text-green-400 group-hover:text-green-300 transition-colors truncate"
          title={instance.uuid}
        >
          {instance.uuid}
        </div>
        <span className="mt-2">{progress}%</span>
        <div className="mt-2 h-1 w-full bg-green-950/50 overflow-hidden rounded-full">
          <div
            className={`h-full ${
              instance.status === "running" ? "bg-green-500" : "bg-yellow-500"
            } animate-pulse`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
