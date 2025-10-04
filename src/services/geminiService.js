import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.isInitialized = false;
    this.pdfContents = new Map(); // Store parsed PDF contents
    this.initializationPromise = null; // Track initialization promise
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  async _doInitialize() {
    try {
      // Test the API connection with a simple prompt
      const result = await this.model.generateContent('Test connection');
      await result.response.text(); // Ensure the response is valid
      this.isInitialized = true;
      console.log('Gemini AI service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI service:', error);
      // Don't throw error, just log it and continue with limited functionality
      this.isInitialized = false;
      return false;
    }
  }

  async askQuestion(question, context = '') {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return this.getFallbackResponse(question);
        }
      }

      const prompt = this.buildPrompt(question, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response received');
      }
      
      return text;
    } catch (error) {
      console.error('Error asking question to Gemini:', error);
      return this.getFallbackResponse(question);
    }
  }

  getFallbackResponse(question) {
    const fallbackResponses = {
      'microgravity': 'Microgravity affects many biological processes including bone density, muscle mass, and plant growth. In space, astronauts experience bone loss and muscle atrophy due to the lack of gravitational stress.',
      'plant': 'Plants in space grow differently due to the absence of gravity. They lose their normal orientation cues and may grow in unusual directions. NASA has conducted many plant growth experiments on the ISS.',
      'radiation': 'Space radiation is a major concern for long-duration missions. It can damage DNA and increase cancer risk. NASA is developing better shielding materials and monitoring systems.',
      'astronaut': 'Astronauts face many health challenges in space including bone loss, muscle atrophy, vision changes, and psychological stress. Exercise and nutrition are key countermeasures.',
      'mars': 'Mars missions will require advanced life support systems, radiation protection, and psychological support for crew members during the 6-9 month journey each way.',
      'default': 'I apologize, but I\'m currently experiencing technical difficulties connecting to the AI service. However, I can tell you that NASA conducts extensive space biology research covering topics like microgravity effects, radiation biology, plant growth in space, and astronaut health. Please try your question again or check the PDF library for specific research papers.'
    };

    const questionLower = question.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (key !== 'default' && questionLower.includes(key)) {
        return response;
      }
    }
    
    return fallbackResponses.default;
  }

  buildPrompt(question, context) {
    return `You are an expert NASA space biology research assistant. You have access to comprehensive NASA research articles about space biology, microgravity effects, astronaut health, space agriculture, and related topics.

Context from NASA research articles:
${context}

User Question: ${question}

IMPORTANT: Format your response using clean HTML markup for better readability. Use the following guidelines:

1. Use <h3> for main section headings
2. Use <h4> for subsection headings  
3. Use <p> for paragraphs
4. Use <ul> and <li> for bullet points
5. Use <strong> for emphasis
6. Use <em> for italics
7. Use <br> for line breaks when needed
8. No markdown syntax (**, *, #, etc.) - use HTML only

Structure your response with:
- <h3>Key Findings</h3>
- <h3>Scientific Details</h3> 
- <h3>Applications & Implications</h3>
- <h3>Related Research Areas</h3>

Keep the response informative but accessible. When referencing research context, clearly indicate it. When using general knowledge, mention it as "Based on general NASA research knowledge".

Provide a comprehensive answer in clean HTML format.`;
  }

  async searchRelevantContent(question, availableContent) {
    // Simple keyword-based search for now
    // In a production environment, you'd use vector embeddings for better semantic search
    const keywords = question.toLowerCase().split(' ').filter(word => word.length > 3);
    const relevantContent = [];

    for (const [title, content] of availableContent) {
      const contentLower = (title + ' ' + content).toLowerCase();
      const matchCount = keywords.filter(keyword => contentLower.includes(keyword)).length;
      
      if (matchCount > 0) {
        relevantContent.push({
          title,
          content: content.substring(0, 2000), // Limit content length
          relevanceScore: matchCount
        });
      }
    }

    // Sort by relevance and return top 3 most relevant pieces
    return relevantContent
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
      .map(item => `Title: ${item.title}\n${item.content}`)
      .join('\n\n---\n\n');
  }

  async generateSummary(text, summaryType = 'technical') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const prompt = summaryType === 'plain' 
      ? `Provide a simple, easy-to-understand summary of this NASA space biology research in plain language that anyone can understand:\n\n${text}`
      : `Provide a technical summary of this NASA space biology research, highlighting key findings, methodologies, and implications:\n\n${text}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary. Please try again.');
    }
  }

  // Method to analyze and extract insights from research papers
  async analyzeResearchPaper(paperContent) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const prompt = `Analyze this NASA space biology research paper and extract:
1. Key findings
2. Research methodology
3. Implications for space exploration
4. Connection to other space biology research
5. Practical applications

Paper content:
${paperContent.substring(0, 4000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing research paper:', error);
      throw new Error('Failed to analyze research paper.');
    }
  }

  // Method to get related research suggestions
  async getRelatedResearch(topic) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const prompt = `Based on the topic "${topic}" in space biology and NASA research, suggest 5 related research areas or questions that would be interesting to explore. Focus on:
- Microgravity effects
- Astronaut health
- Space agriculture
- Life support systems
- Planetary biology
- Space medicine

Provide specific, actionable research questions or topics.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting related research:', error);
      throw new Error('Failed to get related research suggestions.');
    }
  }
}

export default new GeminiService();