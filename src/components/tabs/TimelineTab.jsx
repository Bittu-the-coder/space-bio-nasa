import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { searchAPI } from "../../services/api";
import { Calendar, Rocket, Users, Microscope } from "lucide-react";

const TimelineTab = ({ filters }) => {
  const svgRef = useRef(null);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    loadTimelineData();
  }, [filters]);

  const loadTimelineData = async () => {
    setLoading(true);
    try {
      const data = await searchAPI.getTimeline();
      setTimelineData(data);
      renderTimeline(data);
    } catch (error) {
      console.error("Failed to load timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (data) => {
    const svg = svgRef.current;
    if (!svg || !data.length) return;

    // Clear previous content
    svg.innerHTML = "";

    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Group data by year
    const yearGroups = data.reduce((acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    }, {});

    const years = Object.keys(yearGroups).sort();
    const maxExperiments = Math.max(
      ...Object.values(yearGroups).map((group) => group.length)
    );

    // Color mapping for experiment types
    const colorMap = {
      "Botanical Research": "#28A745",
      "Human Physiology": "#1E90FF",
      Astrobiology: "#FFD700",
      "Radiation Biology": "#FC3D21",
      "Materials Science": "#A9A9A9",
    };

    // Create SVG elements using D3-style approach
    const xScale = (year) =>
      margin.left +
      ((year - Math.min(...years)) /
        (Math.max(...years) - Math.min(...years))) *
        chartWidth;
    const yScale = (count) =>
      margin.top + (1 - count / maxExperiments) * chartHeight;

    // Draw grid lines
    years.forEach((year) => {
      const x = xScale(year);
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x);
      line.setAttribute("y1", margin.top);
      line.setAttribute("x2", x);
      line.setAttribute("y2", height - margin.bottom);
      line.setAttribute("stroke", "#2A2A2A");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("stroke-dasharray", "2,2");
      svg.appendChild(line);
    });

    // Draw year labels
    years.forEach((year) => {
      const x = xScale(year);
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", x);
      text.setAttribute("y", height - margin.bottom + 20);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#A9A9A9");
      text.setAttribute("font-family", "Orbitron");
      text.setAttribute("font-size", "12");
      text.textContent = year;
      svg.appendChild(text);
    });

    // Draw experiment bars
    years.forEach((year) => {
      const experiments = yearGroups[year];
      const x = xScale(year);

      // Stack experiments by type
      let yOffset = 0;
      const typeGroups = experiments.reduce((acc, exp) => {
        if (!acc[exp.experimentType]) acc[exp.experimentType] = [];
        acc[exp.experimentType].push(exp);
        return acc;
      }, {});

      Object.entries(typeGroups).forEach(([type, typeExperiments]) => {
        const barHeight =
          (typeExperiments.length / maxExperiments) * chartHeight;

        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", x - 15);
        rect.setAttribute("y", height - margin.bottom - yOffset - barHeight);
        rect.setAttribute("width", "30");
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", colorMap[type] || "#A9A9A9");
        rect.setAttribute("opacity", "0.8");
        rect.setAttribute("cursor", "pointer");

        // Add hover effects
        rect.addEventListener("mouseenter", () => {
          rect.setAttribute("opacity", "1");
          rect.setAttribute("stroke", "#FFFFFF");
          rect.setAttribute("stroke-width", "2");
        });

        rect.addEventListener("mouseleave", () => {
          rect.setAttribute("opacity", "0.8");
          rect.setAttribute("stroke", "none");
        });

        rect.addEventListener("click", () => {
          setSelectedYear({ year, type, experiments: typeExperiments });
        });

        svg.appendChild(rect);
        yOffset += barHeight;
      });

      // Add count label
      const totalCount = experiments.length;
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", x);
      text.setAttribute("y", height - margin.bottom - yOffset - 10);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#FFFFFF");
      text.setAttribute("font-family", "Roboto");
      text.setAttribute("font-size", "10");
      text.setAttribute("font-weight", "bold");
      text.textContent = totalCount;
      svg.appendChild(text);
    });

    // Draw y-axis
    const yAxis = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    yAxis.setAttribute("x1", margin.left);
    yAxis.setAttribute("y1", margin.top);
    yAxis.setAttribute("x2", margin.left);
    yAxis.setAttribute("y2", height - margin.bottom);
    yAxis.setAttribute("stroke", "#A9A9A9");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);

    // Draw x-axis
    const xAxis = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    xAxis.setAttribute("x1", margin.left);
    xAxis.setAttribute("y1", height - margin.bottom);
    xAxis.setAttribute("x2", width - margin.right);
    xAxis.setAttribute("y2", height - margin.bottom);
    xAxis.setAttribute("stroke", "#A9A9A9");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    // Y-axis label
    for (let i = 0; i <= maxExperiments; i += Math.ceil(maxExperiments / 5)) {
      const y = yScale(i);
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", margin.left - 10);
      text.setAttribute("y", y + 4);
      text.setAttribute("text-anchor", "end");
      text.setAttribute("fill", "#A9A9A9");
      text.setAttribute("font-family", "Roboto");
      text.setAttribute("font-size", "10");
      text.textContent = i;
      svg.appendChild(text);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Botanical Research":
        return Microscope;
      case "Human Physiology":
        return Users;
      case "Astrobiology":
        return Microscope;
      case "Radiation Biology":
        return Rocket;
      default:
        return Calendar;
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-text-secondary">Loading timeline...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
                Experiments Timeline
              </h2>
              <p className="text-text-secondary">
                Distribution of space biology experiments across years and
                missions
              </p>
            </div>

            <div className="h-[calc(100%-100px)] relative">
              <svg
                ref={svgRef}
                className="w-full h-full"
                style={{ minHeight: "400px" }}
              />

              {/* Legend */}
              <div className="absolute top-4 right-4 bg-background bg-opacity-80 backdrop-blur-sm rounded-lg p-4 border border-border">
                <h3 className="font-heading text-sm font-medium text-text-primary mb-3">
                  Experiment Types
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.entries({
                    "Botanical Research": "#28A745",
                    "Human Physiology": "#1E90FF",
                    Astrobiology: "#FFD700",
                    "Radiation Biology": "#FC3D21",
                    "Materials Science": "#A9A9A9",
                  }).map(([type, color]) => (
                    <div key={type} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-text-secondary">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Year Details Panel */}
      {selectedYear && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="w-80 bg-background border-l border-border p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              {selectedYear.year} Details
            </h3>
            <button
              onClick={() => setSelectedYear(null)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-accent">
              {React.createElement(getIcon(selectedYear.type), {
                className: "w-5 h-5",
              })}
              <span className="font-medium">{selectedYear.type}</span>
            </div>

            <div className="space-y-3">
              {selectedYear.experiments.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-lg p-3 border border-border"
                >
                  <h4 className="font-medium text-text-primary text-sm mb-1">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Mission: {exp.mission}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TimelineTab;
