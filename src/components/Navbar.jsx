import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Menu, Download } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { search, loading } = useSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  };

  return (
    <motion.nav
      className="bg-background border-b border-border h-16 flex items-center px-6 relative z-50"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-8 w-full">
        {/* NASA Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-text-primary">
              NASA
            </h1>
            <p className="text-xs text-text-secondary">Space Biology Engine</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search publications, organisms, experiments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg pl-12 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-highlight border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Export Button */}
        <motion.button
          onClick={handleExport}
          className="bg-secondary hover:bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          <span className="font-medium">Export</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
