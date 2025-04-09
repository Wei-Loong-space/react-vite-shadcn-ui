"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InstanceData } from "@/lib/types";

interface StatusConsoleProps {
  instances: InstanceData[];
  lastUpdate: Date | null;
}

export default function StatusConsole({
  instances,
  lastUpdate,
}: StatusConsoleProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Generate logs based on instance changes
  useEffect(() => {
    if (lastUpdate) {
      const timestamp = lastUpdate.toLocaleTimeString();
      const runningCount = instances.filter(i => i.status === "running").length;
      const pendingCount = instances.filter(i => i.status === "pending").length;

      const newLogs = [
        `[${timestamp}] STATUS UPDATE: ${instances.length} instances monitored`,
        `[${timestamp}] RUNNING: ${runningCount} | PENDING: ${pendingCount}`,
      ];

      // Add some random instance-specific logs
      if (instances.length > 0) {
        const randomInstance =
          instances[Math.floor(Math.random() * instances.length)];
        newLogs.push(
          `[${timestamp}] INSTANCE ${
            randomInstance.id
          } is ${randomInstance.status.toUpperCase()}`,
        );

        if (Math.random() > 0.7) {
          newLogs.push(
            `[${timestamp}] CPU ALERT: ${randomInstance.id} at ${Math.floor(
              Math.random() * 40 + 60,
            )}% utilization`,
          );
        }
      }

      setLogs(prev => [...prev, ...newLogs].slice(-100)); // Keep only the last 100 logs
    }
  }, [instances, lastUpdate]);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <Card className="w-full lg:w-96 border-green-500/30 bg-black/80 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          System Console
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-black border border-green-500/30 rounded-md h-[500px] overflow-y-auto p-3 text-xs font-mono">
          {logs.length === 0 ? (
            <div className="text-green-500/50 animate-pulse">
              Awaiting system data...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1 leading-5">
                <span className="text-green-400">{log}</span>
              </div>
            ))
          )}
          <div ref={consoleEndRef} />
        </div>
      </CardContent>
    </Card>
  );
}
