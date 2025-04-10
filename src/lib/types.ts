export interface InstanceData {
  uuid: string;
  status: "pending" | "running";
  progress?: number; // from 0.00 to 1
}
