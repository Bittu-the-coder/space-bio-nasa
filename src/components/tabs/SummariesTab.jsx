import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearch } from "../../contexts/SearchContext";
import { searchAPI } from "../../services/api";
import {
  FileText,
  Users,
  Calendar,
  Microscope,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";

const SummariesTab = ({ filters }) => {
  const { searchResults, loading, search } = useSearch();
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    loadPublications();
  }, [filters]);

  const loadPublications = async () => {
    try {
      const results = await searchAPI.search("", filters);
      setPublications(results);
    } catch (error) {
      console.error("Failed to load publications:", error);
    }
  };

  const handlePublicationSelect = async (publication) => {
    setSelectedPublication(publication);
    setSummaryLoading(true);
    try {
      const summary = await searchAPI.getSummary(publication.id);
      setSelectedPublication((prev) => ({ ...prev, summary }));
    } catch (error) {
      console.error("Failed to load summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const getExperimentIcon = (type) => {
    switch (type) {
      case "Botanical Research":
        return Microscope;
      case "Human Physiology":
        return Users;
      case "Astrobiology":
        return Microscope;
      default:
        return FileText;
    }
  };

  const PublicationCard = ({ publication, isSelected, onClick }) => {
    const Icon = getExperimentIcon(publication.experimentType);

    return (
      <motion.div
        className={`bg-surface rounded-lg p-3 sm:p-4 border cursor-pointer transition-all duration-200 hover-scale ${
          isSelected
            ? "border-highlight shadow-lg"
            : "border-border hover:border-text-secondary"
        }`}
        onClick={() => onClick(publication)}
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg ${
              isSelected ? "bg-highlight" : "bg-background"
            }`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary mb-2 line-clamp-2">
              {publication.title}
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{publication.year}</span>
                </span>
                <span className="text-accent truncate">{publication.mission}</span>
              </div>
              <p className="text-text-secondary truncate">{publication.organism}</p>
            </div>
            <p className="text-text-secondary text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
              {publication.abstract}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {publication.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-background text-accent text-xs rounded-md"
                >
                  {keyword}
                </span>
              ))}
              {publication.keywords.length > 3 && (
                <span className="px-2 py-1 bg-background text-text-secondary text-xs rounded-md">
                  +{publication.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0" />
        </div>
      </motion.div>
    );
  };

    return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Publications List */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-text-primary">
                Research Publications
              </h2>
              <p className="text-text-secondary text-sm sm:text-base">
                {publications.length} publications found
              </p>
            </div>
          </div>          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-text-secondary">Loading publications...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {publications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  isSelected={selectedPublication?.id === publication.id}
                  onClick={handlePublicationSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publication Details and Summaries */}
      <div className="flex-1 overflow-y-auto">
        {selectedPublication ? (
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-text-primary mb-2">
                {selectedPublication.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-text-secondary text-xs sm:text-sm mb-4">
                <span>{selectedPublication.year}</span>
                <span>•</span>
                <span className="break-all">{selectedPublication.mission}</span>
                <span>•</span>
                <span>{selectedPublication.experimentType}</span>
              </div>
              <p className="text-text-secondary mb-4 text-sm sm:text-base">
                <strong>Authors:</strong>{" "}
                {selectedPublication.authors.join(", ")}
              </p>
              <p className="text-text-secondary text-sm sm:text-base">
                <strong>Organism:</strong> {selectedPublication.organism}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
              <motion.button
                className="bg-primary hover:bg-opacity-80 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                <span>View Full Paper</span>
              </motion.button>
              <motion.button
                className="bg-secondary hover:bg-opacity-80 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>

            {/* Abstract */}
            <div className="mb-8">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">
                Abstract
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {selectedPublication.abstract}
              </p>
            </div>

            {/* AI Summaries */}
            <div className="space-y-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary">
                AI-Generated Summaries
              </h3>

              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-text-secondary text-sm">
                      Generating summaries...
                    </p>
                  </div>
                </div>
              ) : selectedPublication.summary ? (
                <>
                  {/* Plain Language Summary */}
                  <motion.div
                    className="bg-background rounded-lg p-6 border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <h4 className="font-heading font-medium text-text-primary">
                        Plain Language Summary
                      </h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {selectedPublication.summary.plain}
                    </p>
                  </motion.div>

                  {/* Technical Summary */}
                  <motion.div
                    className="bg-background rounded-lg p-6 border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <h4 className="font-heading font-medium text-text-primary">
                        Technical Summary
                      </h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed font-mono text-sm">
                      {selectedPublication.summary.technical}
                    </p>
                  </motion.div>

                  {/* Space Exploration Relevance */}
                  <motion.div
                    className="bg-background rounded-lg p-6 border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <h4 className="font-heading font-medium text-text-primary">
                        Human Space Exploration Impact
                      </h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      This research directly contributes to understanding how
                      biological systems adapt to space environments, providing
                      crucial insights for maintaining astronaut health and
                      developing life support systems for long-duration missions
                      to Mars and beyond.
                    </p>
                  </motion.div>
                </>
              ) : null}

              {/* Keywords */}
              <div>
                <h4 className="font-heading font-medium text-text-primary mb-3">
                  Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPublication.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-surface border border-border text-text-secondary text-sm rounded-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
                Select a Publication
              </h3>
              <p className="text-text-secondary">
                Choose a publication from the list to view AI-generated
                summaries
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummariesTab;
