// PDF processing service for handling NASA research articles
class PDFService {
  constructor() {
    this.pdfCache = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    // For now, we'll use mock data representing the PDF contents
    // In a production environment, you'd implement actual PDF parsing
    this.loadMockPDFData();
    this.isInitialized = true;
  }

  loadMockPDFData() {
    // Generate comprehensive mock data for all NASA PDF files
    const pdfFiles = [
      'PMC10020673', 'PMC10025027', 'PMC10027818', 'PMC10030976', 'PMC10058394', 'PMC10063413', 'PMC10138634', 'PMC10142442', 'PMC10144393', 'PMC10233975',
      'PMC10261121', 'PMC10264680', 'PMC10284894', 'PMC10285634', 'PMC10308117', 'PMC10342025', 'PMC10344948', 'PMC10370681', 'PMC10386755', 'PMC10390562',
      'PMC10410709', 'PMC10414970', 'PMC10422843', 'PMC10432549', 'PMC10470837', 'PMC10472590', 'PMC10487739', 'PMC10503492', 'PMC10504369', 'PMC10528075',
      'PMC10605753', 'PMC10607959', 'PMC10628120', 'PMC10712242', 'PMC10715203', 'PMC10719374', 'PMC10751425', 'PMC10764921', 'PMC10772081', 'PMC10774393',
      'PMC10780891', 'PMC10789781', 'PMC10793275', 'PMC10797188', 'PMC10800490', 'PMC10813126', 'PMC10831389', 'PMC10846184', 'PMC10848226', 'PMC10889206',
      'PMC10926278', 'PMC10960378', 'PMC10996920', 'PMC11022651', 'PMC11046949', 'PMC11053165', 'PMC11063234', 'PMC11088941', 'PMC11094041', 'PMC11096397',
      'PMC11126634', 'PMC11127935', 'PMC11166646', 'PMC11166648', 'PMC11166655', 'PMC11166662', 'PMC11166909', 'PMC11166911', 'PMC11166937', 'PMC11166943',
      'PMC11166944', 'PMC11166946', 'PMC11166948', 'PMC11166952', 'PMC11166967', 'PMC11166968', 'PMC11166969', 'PMC11166981', 'PMC11167039', 'PMC11167060',
      'PMC11167063', 'PMC11167097', 'PMC11222149', 'PMC11233762', 'PMC11263583', 'PMC11271499', 'PMC11302229', 'PMC11324864', 'PMC11339457', 'PMC11353732',
    ];

    const sampleTitles = [
      'Microgravity Effects on Cellular Metabolism in Space',
      'Plant Growth and Development in Lunar Regolith Simulant',
      'Radiation Shielding Materials for Deep Space Missions',
      'Psychological Adaptation to Isolated and Confined Environments',
      'Bioregenerative Life Support Systems for Space Exploration',
      'Protein Crystallization in Microgravity Environments',
      'Bone Density Changes During Long-Duration Spaceflight',
      'Cardiovascular Adaptations to Space Environment',
      'Effects of Space Radiation on DNA Repair Mechanisms',
      'Microbial Community Dynamics in Closed-Loop Systems',
      'Sleep Patterns and Circadian Rhythms in Space',
      'Muscle Atrophy Prevention in Microgravity',
      'Space Food Systems and Nutritional Requirements',
      'Water Recovery and Purification Technologies',
      'Atmospheric Control and Air Quality in Space Habitats',
      'Exercise Countermeasures for Spaceflight Deconditioning',
      'Vestibular System Adaptations to Microgravity',
      'Immune System Function in Space Environment',
      'Telemedicine and Health Monitoring in Space',
      'Fire Safety and Combustion in Microgravity',
      'Materials Science Experiments in Microgravity',
      'Crystal Growth and Phase Transitions in Space',
      'Fluid Physics and Heat Transfer in Microgravity',
      'Space Agriculture and Crop Production Systems',
      'Environmental Control and Life Support Systems',
      'Human Factors in Spacecraft Design',
      'Radiation Biology and Space Medicine',
      'Astrobiology and Extremophile Research',
      'Planetary Protection and Contamination Control',
      'Space Suit Technology and EVA Systems'
    ];

    const sampleKeywords = [
      ['microgravity', 'cellular metabolism', 'astronaut health', 'mitochondria', 'spaceflight'],
      ['lunar agriculture', 'plant growth', 'regolith', 'Moon colonization', 'space farming'],
      ['radiation protection', 'deep space', 'Mars missions', 'astronaut safety', 'shielding materials'],
      ['space psychology', 'crew dynamics', 'isolation', 'Mars simulation', 'mental health'],
      ['life support systems', 'bioregenerative', 'closed-loop', 'sustainability', 'space habitats'],
      ['protein crystallization', 'microgravity', 'structural biology', 'pharmaceutical research'],
      ['bone density', 'osteoporosis', 'calcium metabolism', 'exercise countermeasures'],
      ['cardiovascular', 'heart function', 'blood pressure', 'deconditioning'],
      ['radiation biology', 'DNA damage', 'space radiation', 'repair mechanisms'],
      ['microbiology', 'closed systems', 'bacterial communities', 'contamination control']
    ];

    pdfFiles.forEach((pdfId, index) => {
      const titleIndex = index % sampleTitles.length;
      const keywordIndex = index % sampleKeywords.length;
      
      const pdf = {
        id: pdfId,
        title: sampleTitles[titleIndex],
        content: `Abstract: NASA research study examining ${sampleTitles[titleIndex].toLowerCase()}. This comprehensive investigation provides insights into the challenges and opportunities of space exploration and human spaceflight.

Key Findings:
- Significant physiological and biological changes observed in space environment
- Novel adaptation mechanisms discovered
- Important implications for long-duration space missions
- Potential applications for Earth-based research and medicine

Methodology: Advanced research techniques using space-based experiments, ground-based analogs, and computational modeling.

Implications: These findings contribute to our understanding of space biology and help prepare for future deep space exploration missions including Mars colonization.

Research conducted at NASA facilities with international collaboration and state-of-the-art equipment.`,
        keywords: sampleKeywords[keywordIndex],
        filename: `${pdfId}.pdf`,
        path: `/home/linuxeleven/Documents/WebD/Work/space-bio-nasa/Nasa pdfs/${pdfId}.pdf`
      };

      this.pdfCache.set(pdfId, pdf);
    });
  }

  async searchPDFs(query) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const results = [];
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);

    for (const [id, pdf] of this.pdfCache) {
      const searchText = (pdf.title + ' ' + pdf.content + ' ' + pdf.keywords.join(' ')).toLowerCase();
      const matchCount = queryWords.filter(word => searchText.includes(word)).length;

      if (matchCount > 0) {
        results.push({
          ...pdf,
          relevanceScore: matchCount,
          excerpt: this.extractRelevantExcerpt(pdf.content, queryWords)
        });
      }
    }

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }

  extractRelevantExcerpt(content, queryWords) {
    const sentences = content.split(/[.!?]+/);
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      if (queryWords.some(word => sentenceLower.includes(word))) {
        return sentence.trim() + '.';
      }
    }
    return content.substring(0, 200) + '...';
  }

  async getPDFContent(pdfId) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.pdfCache.get(pdfId);
  }

  async getAllPDFs() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return Array.from(this.pdfCache.values());
  }

  async getRelatedPDFs(keywords, currentPdfId = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const related = [];
    const searchKeywords = keywords.map(k => k.toLowerCase());

    for (const [id, pdf] of this.pdfCache) {
      if (id === currentPdfId) continue;

      const pdfKeywords = pdf.keywords.map(k => k.toLowerCase());
      const commonKeywords = searchKeywords.filter(k => 
        pdfKeywords.some(pk => pk.includes(k) || k.includes(pk))
      );

      if (commonKeywords.length > 0) {
        related.push({
          ...pdf,
          commonKeywords,
          relevanceScore: commonKeywords.length
        });
      }
    }

    return related
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  }

  // Download PDF functionality
  downloadPDF(pdfId) {
    try {
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
      throw new Error('Failed to download PDF. Please try again.');
    }
  }

  // Open PDF in new tab
  openPDF(pdfId) {
    try {
      const pdfPath = `/Nasa pdfs/${pdfId}.pdf`;
      window.open(pdfPath, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
      throw new Error('Failed to open PDF. Please try again.');
    }
  }

  // Get PDF file path
  getPDFPath(pdfId) {
    return `/Nasa pdfs/${pdfId}.pdf`;
  }
}

export default new PDFService();