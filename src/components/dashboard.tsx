"use client";

import { useEffect, useState } from "react";
import { Search, Server, Shield, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import InstanceGrid from "./instance-grid";
import StatusConsole from "./status-console";
import type { InstanceData } from "@/lib/types";
import { Button } from "./ui/button";

export default function Dashboard() {
  const [instances, setInstances] = useState<InstanceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [websocketUrl, setWebsocketUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "initiating"
  >("disconnected");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const filteredInstances = instances.filter(instance =>
    instance.uuid.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Connect to WebSocket and handle instance data
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    let ws: WebSocket;
    if (!websocketUrl) return;
    const connectWebSocket = () => {
      ws = new WebSocket(websocketUrl);
      ws.onopen = () => {
        setConnectionStatus("connected");
        console.log("WebSocket connection established");
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("WebSocket connection closed, attempting to reconnect...");
        // Try to reconnect after a delay
        reconnectTimeout = setTimeout(connectWebSocket, 5000); // reconnect after 5 seconds
      };

      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          console.log("Receiving data ;D");
          setInstances(data);
          // setLastUpdate(new Date());
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };
    };

    // Establish initial WebSocket connection
    setConnectionStatus("initiating");
    connectWebSocket();

    // Cleanup function to close WebSocket and clear any timeouts
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [websocketUrl]);

  const runningCount = instances.filter(i => i.status === "running").length;
  const pendingCount = instances.filter(i => i.status === "pending").length;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col gap-4">
      <header className="border border-green-500/30 rounded-md p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">BROWSERS</h1>
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

            <div className="flex items-center gap-2 ml-2 border-l border-primary/20 pl-2">
              {isEditing ? (
                <>
                  <Input
                    type="text"
                    value={inputValue}
                    placeholder="Enter the websocket url"
                    onChange={e => setInputValue(e.target.value)}
                    className="h-8 text-sm w-40 md:w-48"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setWebsocketUrl(inputValue);
                      setIsEditing(false);
                    }}
                    className="h-8"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">{websocketUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setInputValue(websocketUrl);
                    }}
                    className="h-6 px-2"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
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
        <StatusConsole instances={filteredInstances} lastUpdate={lastUpdate} />
      </div>
    </div>
  );
}
