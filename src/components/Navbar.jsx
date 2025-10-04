import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Menu, Download, X } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
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
      className="bg-background border-b border-border h-16 flex items-center px-3 sm:px-6 relative z-50"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-text-primary" />
          )}
        </button>

        {/* NASA Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm sm:text-lg">N</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg sm:text-xl font-bold text-text-primary">
              NASA
            </h1>
            <p className="text-xs text-text-secondary">Space Biology Engine</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md sm:max-w-2xl mx-2 sm:mx-4 lg:mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200"
              />
              {loading && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-highlight border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Export Button */}
        <motion.button
          onClick={handleExport}
          className="bg-secondary hover:bg-opacity-80 text-white px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-all duration-200 shadow-button text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">Export</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
