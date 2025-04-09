
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import * as d3 from "d3";
import { mockContacts } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Contact } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { 
  NetworkNode, 
  NetworkLink, 
  NetworkGraphProps, 
  NetworkGraphRef 
} from "./types";
import { 
  getConnectionColor, 
  getConnectionWidth, 
  getCategoryColor, 
  filterContacts,
  createAdditionalLinks,
  createDragHandlers
} from "./networkUtils";

export const NetworkGraph = forwardRef<NetworkGraphRef, NetworkGraphProps>(
  ({ filters = { categories: [], minStrength: 0 } }, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const zoomRef = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState<Contact | null>(null);
    const [profilePosition, setProfilePosition] = useState({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        if (zoomRef.current && svgRef.current) {
          zoomRef.current.scaleBy(d3.select(svgRef.current), 1.2);
        }
      },
      zoomOut: () => {
        if (zoomRef.current && svgRef.current) {
          zoomRef.current.scaleBy(d3.select(svgRef.current), 0.8);
        }
      },
      resetZoom: () => {
        if (zoomRef.current && svgRef.current) {
          zoomRef.current.transform(
            d3.select(svgRef.current),
            d3.zoomIdentity.translate(0, 0).scale(1)
          );
        }
      }
    }));

    const handleNodeClick = (event: MouseEvent, node: NetworkNode) => {
      const contact = mockContacts.find(c => c.id === node.id);
      if (contact) {
        setSelectedNode(contact);
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const x = Math.min(event.clientX - svgRect.left, svgRect.width - 220);
          const y = Math.min(event.clientY - svgRect.top, svgRect.height - 200);
          setProfilePosition({ x, y });
        }
      }
    };

    useEffect(() => {
      if (!svgRef.current) return;

      // Clear existing content
      d3.select(svgRef.current).selectAll("*").remove();

      // Filter contacts based on criteria
      const filteredContacts = filterContacts(mockContacts, filters);

      // Create nodes from filtered contacts
      const nodes = filteredContacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        category: contact.category || 'default', // Ensure category is never undefined
        connectionStrength: contact.connectionStrength,
        tags: contact.tags || [], // Ensure tags is never undefined
        photoUrl: contact.photoUrl
      })) as NetworkNode[];

      // Create links between nodes
      const initialLinks = filteredContacts
        .filter((contact) => contact.meetThroughContactId)
        .map((contact) => ({
          source: contact.meetThroughContactId as string,
          target: contact.id,
          value: contact.connectionStrength / 20
        })) as NetworkLink[];

      // Add additional links for better visualization
      const links = createAdditionalLinks(nodes, initialLinks);

      // Setup SVG and dimensions
      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;

      // Create main group for all elements
      const g = svg.append("g");

      // Setup zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      zoomRef.current = zoom;
      svg.call(zoom as any);

      // Force simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d: any) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(50));

      // Color for nodes
      const color = getCategoryColor();

      // Create links
      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", d => getConnectionWidth(d.value as number))
        .attr("stroke", d => getConnectionColor(d.value as number))
        .attr("stroke-opacity", 0.8)
        .attr("class", "transition-all duration-300 ease-in-out");

      // Setup drag behavior
      const { dragstarted, dragged, dragended } = createDragHandlers(simulation);

      // Create nodes
      const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110")
        .on("click", function(event, d) {
          handleNodeClick(event, d);
          event.stopPropagation();
        })
        .call(
          d3
            .drag<any, NetworkNode>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      // Add circles to nodes
      node
        .append("circle")
        .attr("r", d => 20 + d.connectionStrength / 10)
        .attr("fill", d => {
          // Make sure category exists and use default if not
          const categoryValue = d.category || 'default';
          return color(categoryValue) as string;
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("class", "transition-all duration-300 ease-in-out");

      // Add images to nodes where available
      node.each(function(d) {
        const nodeElement = d3.select(this);
        if (d.photoUrl) {
          nodeElement.append("clipPath")
            .attr("id", `clip-${d.id}`)
            .append("circle")
            .attr("r", 18 + d.connectionStrength / 11);

          nodeElement.append("image")
            .attr("xlink:href", d.photoUrl)
            .attr("x", -(18 + d.connectionStrength / 11))
            .attr("y", -(18 + d.connectionStrength / 11))
            .attr("width", 2 * (18 + d.connectionStrength / 11))
            .attr("height", 2 * (18 + d.connectionStrength / 11))
            .attr("clip-path", `url(#clip-${d.id})`)
            .attr("class", "transition-all duration-300 ease-in-out");
        }
      });

      // Add text labels to nodes
      node
        .append("text")
        .text(d => d.name)
        .attr("x", 0)
        .attr("y", d => 20 + d.connectionStrength / 10 + 12)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("class", "font-medium pointer-events-none drop-shadow-sm");

      // Update positions on simulation tick
      simulation.on("tick", () => {
        link
          .attr("x1", d => (d.source as any).x)
          .attr("y1", d => (d.source as any).y)
          .attr("x2", d => (d.target as any).x)
          .attr("y2", d => (d.target as any).y);

        node.attr("transform", d => `translate(${d.x}, ${d.y})`);
      });

      // Close profile card when clicking on svg
      svg.on("click", (event) => {
        if ((event.target as Element).tagName === "svg") {
          setSelectedNode(null);
        }
      });

      // Cleanup on unmount
      return () => {
        simulation.stop();
      };
    }, [filters]);

    return (
      <Card className="h-[calc(100vh-200px)] w-full overflow-hidden p-4 relative">
        <svg ref={svgRef} width="100%" height="100%"></svg>
        
        {selectedNode && (
          <ProfileCard 
            contact={selectedNode} 
            position={profilePosition}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </Card>
    );
  }
);

NetworkGraph.displayName = "NetworkGraph";
