"use client";

import { useEffect, useState } from "react";
import { Search, Server, Shield, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import InstanceGrid from "./instance-grid";
import StatusConsole from "./status-console";
import type { InstanceData } from "@/lib/types";

export default function Dashboard() {
  const [instances, setInstances] = useState<InstanceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Connect to WebSocket and handle instance data
  useEffect(() => {
    // In a real implementation, replace with your actual WebSocket endpoint
    const ws = new WebSocket("wss://your-websocket-endpoint");

    ws.onopen = () => {
      setConnectionStatus("connected");
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      console.log("WebSocket connection closed");
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        setInstances(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    // Mock data for preview purposes
    const mockData: InstanceData[] = Array.from({ length: 100 }, (_, i) => ({
      id: `i-${Math.random().toString(36).substring(2, 12)}`,
      status: Math.random() > 0.2 ? "running" : "pending",
    }));

    setInstances(mockData);
    setLastUpdate(new Date());

    return () => {
      ws.close();
    };
  }, []);

  const filteredInstances = instances.filter(instance =>
    instance.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const runningCount = instances.filter(i => i.status === "running").length;
  const pendingCount = instances.filter(i => i.status === "pending").length;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col gap-4">
      <header className="border border-green-500/30 rounded-md p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">EC2 MONITOR</h1>
            <Badge
              variant="outline"
              className={
                connectionStatus === "connected"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }
            >
              {connectionStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>INSTANCES: {instances.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-400">RUNNING: {runningCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400">PENDING: {pendingCount}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 relative">
          <Search className="absolute left-3 h-4 w-4 text-green-500/50" />
          <Input
            type="text"
            placeholder="Search instances by ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-black border-green-500/30 focus-visible:ring-green-500/50 text-green-400 placeholder:text-green-500/50"
          />
          <div className="text-xs text-green-500/70">
            {lastUpdate && `LAST UPDATE: ${lastUpdate.toLocaleTimeString()}`}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        <InstanceGrid instances={filteredInstances} />
        <StatusConsole instances={instances} lastUpdate={lastUpdate} />
      </div>
    </div>
  );
}
