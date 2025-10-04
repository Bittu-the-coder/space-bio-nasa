import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { searchAPI } from "../../services/api";
import { Eye, Info } from "lucide-react";

const KnowledgeGraphTab = ({ filters }) => {
  const canvasRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGraphData();
  }, [filters]);

  const loadGraphData = async () => {
    setLoading(true);
    try {
      const data = await searchAPI.getGraph(filters);
      setGraphData(data);
      renderGraph(data);
    } catch (error) {
      console.error("Failed to load graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGraph = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    // Clear canvas
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, width, height);

    // Simple force-directed layout simulation
    const nodes = data.nodes.map((node, i) => ({
      ...node,
      x: width * 0.2 + Math.random() * width * 0.6,
      y: height * 0.2 + Math.random() * height * 0.6,
      vx: 0,
      vy: 0,
      radius:
        node.type === "organism" ? 25 : node.type === "experiment" ? 20 : 15,
    }));

    const edges = data.edges.map((edge) => ({
      ...edge,
      sourceNode: nodes.find((n) => n.id === edge.source),
      targetNode: nodes.find((n) => n.id === edge.target),
    }));

    // Animation loop
    let animationId;
    const animate = () => {
      // Apply forces
      nodes.forEach((node) => {
        // Center force
        node.vx += (width / 2 - node.x) * 0.001;
        node.vy += (height / 2 - node.y) * 0.001;

        // Repulsion between nodes
        nodes.forEach((other) => {
          if (node !== other) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              const force = (100 - distance) * 0.01;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Apply velocity with damping
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });

      // Clear and redraw
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, width, height);

      // Draw edges
      ctx.strokeStyle = "#A9A9A9";
      ctx.lineWidth = 2;
      edges.forEach((edge) => {
        if (edge.sourceNode && edge.targetNode) {
          ctx.beginPath();
          ctx.moveTo(edge.sourceNode.x, edge.sourceNode.y);
          ctx.lineTo(edge.targetNode.x, edge.targetNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw label
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Roboto";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle clicks
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedNode = nodes.find((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) <= node.radius;
      });

      if (clickedNode) {
        setSelectedNode(clickedNode);
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("click", handleClick);
    };
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="flex-1 relative min-h-[400px] lg:min-h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-50 z-10">
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-text-secondary text-sm sm:text-base">Loading knowledge graph...</p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

        {/* Graph Legend */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-background bg-opacity-80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border">
          <h3 className="font-heading text-xs sm:text-sm font-medium text-text-primary mb-2 sm:mb-3">
            Node Types
          </h3>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
              <span className="text-text-secondary">Organisms</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400"></div>
              <span className="text-text-secondary">Experiments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <span className="text-text-secondary">Missions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              <span className="text-text-secondary">Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 300, opacity: 0 }}
          className="w-full lg:w-80 bg-background border-t lg:border-t-0 lg:border-l border-border p-4 sm:p-6 overflow-y-auto max-h-64 lg:max-h-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              Node Details
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wide">
                Type
              </label>
              <p className="text-text-primary font-medium capitalize">
                {selectedNode.type}
              </p>
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wide">
                Label
              </label>
              <p className="text-text-primary font-medium">
                {selectedNode.label}
              </p>
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wide">
                ID
              </label>
              <p className="text-text-primary font-mono text-sm">
                {selectedNode.id}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <button className="w-full bg-primary hover:bg-opacity-80 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Related</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default KnowledgeGraphTab;
