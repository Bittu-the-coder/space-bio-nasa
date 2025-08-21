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

  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-background text-text-primary">
          <Navbar />
          <div className="flex">
            <Sidebar filters={filters} setFilters={setFilters} />
            <main className="flex-1 ml-80 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Dashboard filters={filters} />
              </motion.div>
            </main>
          </div>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;
