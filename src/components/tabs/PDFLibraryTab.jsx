import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye,
  BookOpen,
  Calendar,
  Tag
} from 'lucide-react';
import pdfService from '../../services/pdfService';

const PDFLibraryTab = ({ filters }) => {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfError, setPdfError] = useState(null);
  
  const itemsPerPage = 12;

  useEffect(() => {
    loadPDFs();
  }, []);

  useEffect(() => {
    filterPDFs();
  }, [searchQuery, selectedCategory, pdfs]);

  const loadPDFs = async () => {
    setLoading(true);
    setPdfError(null);
    try {
      await pdfService.initialize();
      const allPdfs = await pdfService.getAllPDFs();
      setPdfs(allPdfs);
      setFilteredPdfs(allPdfs);
    } catch (error) {
      console.error('Failed to load PDFs:', error);
      setPdfError('Failed to load PDF library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const filterPDFs = () => {
    let filtered = [...pdfs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pdf =>
        pdf.title.toLowerCase().includes(query) ||
        pdf.content.toLowerCase().includes(query) ||
        pdf.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pdf =>
        pdf.keywords.some(keyword => 
          keyword.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    setFilteredPdfs(filtered);
    setCurrentPage(1);
  };

  const handleViewPDF = (pdf) => {
    try {
      // Try to open the PDF in a new tab
      const pdfPath = `/Nasa pdfs/${pdf.id}.pdf`;
      window.open(pdfPath, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert(`Unable to open PDF: ${pdf.title}. The file may not be available.`);
    }
  };

  const handleDownloadPDF = (pdfId) => {
    try {
      // Create a download link
      const pdfPath = `/Nasa pdfs/${pdfId}.pdf`;
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = `${pdfId}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Unable to download PDF: ${pdfId}. The file may not be available.`);
    }
  };

  const getPaginatedPDFs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPdfs.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPdfs.length / itemsPerPage);

  const categories = [
    { id: 'all', name: 'All Papers', count: pdfs.length },
    { id: 'microgravity', name: 'Microgravity', count: pdfs.filter(p => p.keywords.some(k => k.includes('microgravity'))).length },
    { id: 'radiation', name: 'Radiation', count: pdfs.filter(p => p.keywords.some(k => k.includes('radiation'))).length },
    { id: 'plant', name: 'Plant Biology', count: pdfs.filter(p => p.keywords.some(k => k.includes('plant') || k.includes('agriculture'))).length },
    { id: 'health', name: 'Astronaut Health', count: pdfs.filter(p => p.keywords.some(k => k.includes('health') || k.includes('medical'))).length },
    { id: 'psychology', name: 'Psychology', count: pdfs.filter(p => p.keywords.some(k => k.includes('psychology') || k.includes('mental'))).length }
  ];

  const PDFCard = ({ pdf }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border border-border rounded-xl p-4 sm:p-6 hover:border-primary/30 transition-colors group"
    >
      <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors self-start">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {pdf.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mb-3 line-clamp-3">
            {pdf.content.substring(0, 120)}...
          </p>
          
          {/* Keywords */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {pdf.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
              >
                {keyword}
              </span>
            ))}
            {pdf.keywords.length > 3 && (
              <span className="text-xs text-text-secondary">
                +{pdf.keywords.length - 3} more
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => handleViewPDF(pdf)}
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>View</span>
            </button>
            <button 
              onClick={() => handleDownloadPDF(pdf.id)}
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading PDF library...</p>
        </div>
      </div>
    );
  }

  if (pdfError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-error mx-auto mb-4" />
          <p className="text-error mb-2">Error Loading PDFs</p>
          <p className="text-text-secondary mb-4">{pdfError}</p>
          <button
            onClick={loadPDFs}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary font-heading">
                NASA Research Library
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm">
                {filteredPdfs.length} research papers available
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search papers by title, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PDF Grid */}
            {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No papers found</h3>
            <p className="text-text-secondary">
              Try adjusting your search criteria or browse all papers.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <AnimatePresence>
                {getPaginatedPDFs().map((pdf) => (
                  <PDFCard key={pdf.id} pdf={pdf} />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 bg-surface border border-border rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(window.innerWidth >= 640 ? 5 : 3, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-border text-text-primary hover:bg-primary/10'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 bg-surface border border-border rounded-lg text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PDFLibraryTab;