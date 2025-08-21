import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, CalendarClock, FileText } from "lucide-react";
import KnowledgeGraphTab from "./tabs/KnowledgeGraphTab";
import TimelineTab from "./tabs/TimelineTab";
import SummariesTab from "./tabs/SummariesTab";

const Dashboard = ({ filters }) => {
  const [activeTab, setActiveTab] = useState("graph");

  const tabs = [
    {
      id: "graph",
      name: "Knowledge Graph",
      icon: Network,
      component: KnowledgeGraphTab,
    },
    {
      id: "timeline",
      name: "Timeline",
      icon: CalendarClock,
      component: TimelineTab,
    },
    {
      id: "summaries",
      name: "Summaries",
      icon: FileText,
      component: SummariesTab,
    },
  ];

  const activeTabComponent = tabs.find(
    (tab) => tab.id === activeTab
  )?.component;

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Tab Navigation */}
      <motion.div
        className="flex space-x-1 mb-6 bg-surface rounded-lg p-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-md"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-heading">{tab.name}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <div className="h-[calc(100%-5rem)] bg-surface rounded-xl shadow-card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTabComponent &&
              React.createElement(activeTabComponent, { filters })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
