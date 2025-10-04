import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  FileText, 
  Lightbulb, 
  Search,
  Brain,
  Sparkles,
  BookOpen
} from 'lucide-react';
import geminiService from '../../services/geminiService';
import pdfService from '../../services/pdfService';

const AskTab = ({ filters }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your NASA Space Biology Research Assistant. I can help you explore and understand research from NASA\'s space biology articles. Ask me anything about microgravity effects, astronaut health, space agriculture, or any other space biology topic!',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions] = useState([
    'How does microgravity affect plant growth?',
    'What are the health risks for astronauts on long missions?',
    'How do we protect astronauts from space radiation?',
    'What is bioregenerative life support?',
    'How does space affect human psychology?'
  ]);
  const [relatedPapers, setRelatedPapers] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    initializeServices();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeServices = async () => {
    try {
      const [aiInitialized, pdfInitialized] = await Promise.all([
        geminiService.initialize(),
        pdfService.initialize()
      ]);
      
      if (!aiInitialized) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: 'AI service initialization failed, but I can still help you search through NASA research papers and provide information based on the available content.',
          timestamp: new Date()
        }]);
      } else {
        console.log('All services initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize services:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Some services had initialization issues, but I can still help you explore NASA research papers. Please note that AI-powered responses may be limited.',
        timestamp: new Date()
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskQuestion = async (questionText = question) => {
    if (!questionText.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: questionText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      // Search for relevant PDF content
      const relevantPapers = await pdfService.searchPDFs(questionText);
      setRelatedPapers(relevantPapers);

      // Build context from relevant papers
      const context = relevantPapers
        .slice(0, 3)
        .map(paper => `Paper: ${paper.title}\nContent: ${paper.content.substring(0, 1000)}`)
        .join('\n\n---\n\n');

      // Get AI response
      const response = await geminiService.askQuestion(questionText, context);

      const assistantMessage = {
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedPapers: relevantPapers.slice(0, 3)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Check if we got a fallback response
      const fallbackResponse = geminiService.getFallbackResponse(questionText);
      
      const responseMessage = {
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        isOffline: true
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const MessageComponent = ({ message }) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6`}
      >
        <div className={`max-w-full sm:max-w-2xl lg:max-w-3xl ${isUser ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 ${
              isUser
                ? 'bg-primary text-white ml-2 sm:ml-4'
                : isError
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-surface border border-border mr-2 sm:mr-4'
            }`}
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              {!isUser && !isError && (
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                {message.content.includes('<h3>') || message.content.includes('<p>') || message.content.includes('<ul>') ? (
                  <div 
                    className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    style={{
                      '--tw-prose-body': '#ffffff',
                      '--tw-prose-headings': '#ffffff',
                      '--tw-prose-lead': '#a9a9a9',
                      '--tw-prose-links': '#1E90FF',
                      '--tw-prose-bold': '#ffffff',
                      '--tw-prose-counters': '#a9a9a9',
                      '--tw-prose-bullets': '#a9a9a9',
                      '--tw-prose-hr': '#2a2a2a',
                      '--tw-prose-quotes': '#ffffff',
                      '--tw-prose-quote-borders': '#2a2a2a',
                      '--tw-prose-captions': '#a9a9a9',
                      '--tw-prose-code': '#ffffff',
                      '--tw-prose-pre-code': '#ffffff',
                      '--tw-prose-pre-bg': '#111111',
                      '--tw-prose-th-borders': '#2a2a2a',
                      '--tw-prose-td-borders': '#2a2a2a'
                    }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                )}
                {message.relatedPapers && message.relatedPapers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center text-xs text-text-secondary mb-2">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Related Research Papers:
                    </div>
                    <div className="space-y-2">
                      {message.relatedPapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="bg-background/50 rounded-lg p-3 border border-border/30"
                        >
                          <h4 className="text-sm font-medium text-text-primary mb-1">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-text-secondary">
                            {paper.excerpt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-text-secondary mt-2 px-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary font-heading">
              Ask NASA Research Assistant
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm">
              Ask questions about NASA space biology research and get AI-powered insights
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-6"
          >
            <div className="bg-surface border border-border rounded-2xl px-6 py-4 mr-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-text-secondary">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface rounded-xl p-4 sm:p-6 border border-border"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="font-semibold text-text-primary text-sm sm:text-base">Suggested Questions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((suggestedQ, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAskQuestion(suggestedQ)}
                  className="text-left p-3 bg-background hover:bg-primary/5 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <span className="text-xs sm:text-sm text-text-primary">{suggestedQ}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border-t border-border p-3 sm:p-6">
        <div className="flex space-x-2 sm:space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about NASA space biology research..."
              className="w-full bg-background border border-border rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                resize: 'none'
              }}
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={!question.trim() || isLoading}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-text-secondary">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default AskTab;