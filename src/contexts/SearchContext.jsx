import React, { createContext, useContext, useState, useCallback } from "react";
import { searchAPI } from "../services/api";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const search = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchAPI.search(query, filters);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
    setSelectedItem(null);
  }, []);

  const value = {
    searchResults,
    loading,
    error,
    selectedItem,
    setSelectedItem,
    search,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
