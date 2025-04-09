
import * as d3 from "d3";
import { NetworkNode, NetworkLink } from "./types";
import { Contact } from "@/types";

// Color functions for connections
export const getConnectionColor = (value: number) => {
  const colorScale = d3.scaleLinear<string>()
    .domain([1, 2, 3, 4, 5])
    .range(["#FFC6A1", "#FEF7CD", "#F2FCE2", "#D3E4FD", "#E5DEFF"]);
  return colorScale(value);
};

export const getConnectionWidth = (value: number) => {
  return Math.max(1, value);
};

// Color for nodes
export const getCategoryColor = () => {
  return d3
    .scaleOrdinal()
    .domain(["cat1", "cat2", "cat3", "cat4", "cat5", "cat6"])
    .range(["#D3E4FD", "#FFDEE2", "#F2FCE2", "#E5DEFF", "#FEF7CD", "#FEC6A1"]);
};

// Filter contacts based on criteria
export const filterContacts = (
  contacts: Contact[], 
  filters: { categories: string[]; minStrength: number }
) => {
  return contacts.filter(contact => {
    if (filters.categories.length > 0 && !filters.categories.includes(contact.category)) {
      return false;
    }
    if (contact.connectionStrength < filters.minStrength) {
      return false;
    }
    return true;
  });
};

// Create additional links for the network visualization
export const createAdditionalLinks = (nodes: NetworkNode[], existingLinks: NetworkLink[]) => {
  const additionalLinks: NetworkLink[] = [];
  
  if (nodes.length > 3) {
    [
      { source: "contact1", target: "contact2", value: 4 },
      { source: "contact1", target: "contact3", value: 3 },
      { source: "contact4", target: "contact1", value: 4 },
      { source: "contact2", target: "contact7", value: 2 },
      { source: "contact5", target: "contact9", value: 3 }
    ].forEach(link => {
      // Only add link if both source and target exist in nodes
      const sourceExists = nodes.some(n => n.id === link.source);
      const targetExists = nodes.some(n => n.id === link.target);
      if (sourceExists && targetExists) {
        additionalLinks.push(link as NetworkLink);
      }
    });
  }
  
  return [...existingLinks, ...additionalLinks];
};

// Simulation drag functions
export const createDragHandlers = (simulation: d3.Simulation<NetworkNode, NetworkLink>) => {
  const dragstarted = (event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  return { dragstarted, dragged, dragended };
};
