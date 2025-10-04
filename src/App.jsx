import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  const [filters, setFilters] = useState({
    organism: "",
    experimentType: "",
    mission: "",
    year: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-background text-text-primary">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex relative">
            <Sidebar 
              filters={filters} 
              setFilters={setFilters} 
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <main className="flex-1 lg:ml-80 p-3 sm:p-4 lg:p-6 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Dashboard filters={filters} />
              </motion.div>
            </main>
          </div>
          
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;
