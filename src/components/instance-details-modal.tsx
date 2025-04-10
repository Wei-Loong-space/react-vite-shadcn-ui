"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { InstanceData } from "@/lib/types";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface InstanceDetailsModalProps {
  instance: InstanceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstanceDetailsModal({
  instance,
  open,
  onOpenChange,
}: InstanceDetailsModalProps) {
  if (!instance) return null;

  // Mock additional data for the instance

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-mono bg-white border border-primary/30">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle
              onClick={() => onOpenChange(false)}
              className="text-lg font-bold"
            >
              {instance.uuid}
            </DialogTitle>
            <DialogDescription className="text-primary/70">
              <div className="space-y-4 mt-4">
                <p>Cookies</p>
                <Separator />
                <p>Description</p>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
