import React from "react";
import { motion } from "framer-motion";
import { Filter, Calendar, Microscope, Rocket, Users } from "lucide-react";

const Sidebar = ({ filters, setFilters, sidebarOpen, setSidebarOpen }) => {
  const filterOptions = {
    organism: [
      "Arabidopsis thaliana",
      "Homo sapiens",
      "Microbial Communities",
      "Drosophila melanogaster",
      "Mus musculus",
    ],
    experimentType: [
      "Botanical Research",
      "Human Physiology",
      "Astrobiology",
      "Radiation Biology",
      "Materials Science",
    ],
    mission: [
      "ISS Expedition 68",
      "Artemis Analog",
      "ECLSS Testing",
      "ISS National Lab",
      "Mars Analog",
    ],
    year: ["2021", "2022", "2023", "2024"],
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      organism: "",
      experimentType: "",
      mission: "",
      year: "",
    });
  };

  const FilterSection = ({ title, icon: Icon, filterType, options }) => (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="w-4 h-4 text-accent" />
        <h3 className="font-heading text-sm font-medium text-text-primary">
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => {
              handleFilterChange(filterType, option);
              // Close sidebar on mobile after selection
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              filters[filterType] === option
                ? "bg-highlight text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
            whileHover={{ x: 4 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-surface border-r border-border p-4 sm:p-6 overflow-y-auto z-50 lg:z-auto transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      initial={{ x: -320 }}
      animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -320 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-accent" />
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Filters
          </h2>
        </div>
        <motion.button
          onClick={clearAllFilters}
          className="text-xs text-text-secondary hover:text-accent transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
        >
          Clear All
        </motion.button>
      </div>

      <FilterSection
        title="Organism"
        icon={Microscope}
        filterType="organism"
        options={filterOptions.organism}
      />

      <FilterSection
        title="Experiment Type"
        icon={Users}
        filterType="experimentType"
        options={filterOptions.experimentType}
      />

      <FilterSection
        title="Mission"
        icon={Rocket}
        filterType="mission"
        options={filterOptions.mission}
      />

      <FilterSection
        title="Year"
        icon={Calendar}
        filterType="year"
        options={filterOptions.year}
      />

      {/* Active Filters Summary */}
      {Object.values(filters).some((filter) => filter) && (
        <motion.div
          className="mt-8 p-4 bg-background rounded-lg border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-heading text-sm font-medium text-text-primary mb-2">
            Active Filters
          </h4>
          <div className="space-y-1">
            {Object.entries(filters).map(
              ([key, value]) =>
                value && (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-text-secondary capitalize">
                      {key}:
                    </span>
                    <span className="text-accent">{value}</span>
                  </div>
                )
            )}
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
