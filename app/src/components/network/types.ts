
import { SimulationNodeDatum, SimulationLinkDatum } from "d3";
import { Contact } from "@/types";

export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  connectionStrength: number;
  tags: string[];
  photoUrl?: string;
  x?: number;
  y?: number;
}

export interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
  source: NetworkNode | string;
  target: NetworkNode | string;
  value: number;
}

export interface NetworkGraphProps {
  filters?: {
    categories: string[];
    minStrength: number;
  };
}

export interface NetworkGraphRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}
