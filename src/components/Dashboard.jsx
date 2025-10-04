import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, FileText, MessageSquare, BookOpen } from "lucide-react";
import KnowledgeGraphTab from "./tabs/KnowledgeGraphTab";
import SummariesTab from "./tabs/SummariesTab";
import AskTab from "./tabs/AskTab";
import PDFLibraryTab from "./tabs/PDFLibraryTab";

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
      id: "library",
      name: "PDF Library",
      icon: BookOpen,
      component: PDFLibraryTab,
    },
    {
      id: "summaries",
      name: "Summaries",
      icon: FileText,
      component: SummariesTab,
    },
    {
      id: "ask",
      name: "Ask AI",
      icon: MessageSquare,
      component: AskTab,
    },
  ];

  const activeTabComponent = tabs.find(
    (tab) => tab.id === activeTab
  )?.component;

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)]">
      {/* Tab Navigation */}
      <motion.div
        className="flex flex-wrap sm:flex-nowrap space-x-1 mb-4 sm:mb-6 bg-surface rounded-lg p-1 overflow-x-auto"
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
              className={`relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
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
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="relative z-10 font-heading hidden sm:inline">{tab.name}</span>
              <span className="relative z-10 font-heading sm:hidden">{tab.name.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <div className="h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] bg-surface rounded-xl shadow-card overflow-hidden">
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
