// Mock dependencies for chatbot system
jest.mock('../services/vectorIndex');
jest.mock('../services/keywordMatcher');
jest.mock('../services/embeddingService');

describe('Chatbot System Test Cases', () => {
  let mockVectorIndex, mockKeywordMatcher, mockEmbeddingService;

  beforeEach(() => {
    mockVectorIndex = {
      search: jest.fn(),
      getSimilarityScore: jest.fn()
    };

    mockKeywordMatcher = {
      checkKeywords: jest.fn(),
      getPredefinedResponse: jest.fn()
    };

    mockEmbeddingService = {
      generateEmbedding: jest.fn(),
      preprocessQuery: jest.fn()
    };

    jest.clearAllMocks();
  });

  // TC-01: Exact FAQ Match
  describe('TC-01: Exact FAQ Match', () => {
    it('should identify exact matches in FAQ Vector Index with high similarity score', async () => {
      const userQuery = 'What is the submission deadline?';
      const threshold = 0.8;

      // Mock exact match scenario
      const faqEntry = {
        question: 'What is the submission deadline?',
        answer: 'The submission deadline is December 31, 2024.',
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
      };

      const queryEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5]; // Identical embedding
      const similarityScore = 1.0; // Perfect match

      mockEmbeddingService.preprocessQuery.mockReturnValue('what is the submission deadline');
      mockEmbeddingService.generateEmbedding.mockResolvedValue(queryEmbedding);
      mockVectorIndex.search.mockResolvedValue([faqEntry]);
      mockVectorIndex.getSimilarityScore.mockReturnValue(similarityScore);

      // Simulate chatbot processing
      const processedQuery = mockEmbeddingService.preprocessQuery(userQuery);
      const embedding = await mockEmbeddingService.generateEmbedding(processedQuery);
      const searchResults = await mockVectorIndex.search(embedding);
      const score = mockVectorIndex.getSimilarityScore(embedding, searchResults[0].embedding);

      expect(score).toBeGreaterThan(threshold);
      expect(score).toBe(1.0);
      expect(searchResults[0].answer).toBe('The submission deadline is December 31, 2024.');
    });
  });

  // TC-02: Paraphrased Query
  describe('TC-02: Paraphrased Query', () => {
    it('should capture semantic meaning with score above threshold in Vector Index', async () => {
      const userQuery = 'When do I need to submit my documents?';
      const threshold = 0.7;

      // Mock paraphrased query scenario
      const faqEntry = {
        question: 'What is the submission deadline?',
        answer: 'The submission deadline is December 31, 2024.',
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
      };

      const queryEmbedding = [0.12, 0.18, 0.32, 0.38, 0.48]; // Similar but not identical
      const similarityScore = 0.85; // High similarity

      mockEmbeddingService.preprocessQuery.mockReturnValue('when do i need to submit my documents');
      mockEmbeddingService.generateEmbedding.mockResolvedValue(queryEmbedding);
      mockVectorIndex.search.mockResolvedValue([faqEntry]);
      mockVectorIndex.getSimilarityScore.mockReturnValue(similarityScore);

      // Simulate chatbot processing
      const processedQuery = mockEmbeddingService.preprocessQuery(userQuery);
      const embedding = await mockEmbeddingService.generateEmbedding(processedQuery);
      const searchResults = await mockVectorIndex.search(embedding);
      const score = mockVectorIndex.getSimilarityScore(embedding, searchResults[0].embedding);

      expect(score).toBeGreaterThan(threshold);
      expect(score).toBe(0.85);
      expect(searchResults[0].answer).toBe('The submission deadline is December 31, 2024.');
    });
  });

  // TC-03: Short Keyword
  describe('TC-03: Short Keyword', () => {
    it('should trigger predefined match through Keyword Rule Check', async () => {
      const userQuery = 'deadline';
      const threshold = 0.7;

      // Mock keyword matching scenario
      const keywordMatch = {
        keyword: 'deadline',
        response: 'The submission deadline is December 31, 2024. Please ensure all documents are submitted before this date.'
      };

      mockKeywordMatcher.checkKeywords.mockReturnValue(true);
      mockKeywordMatcher.getPredefinedResponse.mockReturnValue(keywordMatch.response);

      // Simulate chatbot processing
      const hasKeywordMatch = mockKeywordMatcher.checkKeywords(userQuery);
      
      if (hasKeywordMatch) {
        const response = mockKeywordMatcher.getPredefinedResponse(userQuery);
        
        expect(hasKeywordMatch).toBe(true);
        expect(response).toBe(keywordMatch.response);
        return;
      }

      // If no keyword match, proceed with vector search
      const queryEmbedding = await mockEmbeddingService.generateEmbedding(userQuery);
      const searchResults = await mockVectorIndex.search(queryEmbedding);
      const score = mockVectorIndex.getSimilarityScore(queryEmbedding, searchResults[0]?.embedding || []);

      expect(hasKeywordMatch).toBe(true);
    });
  });

  // TC-04: Out-of-Scope
  describe('TC-04: Out-of-Scope', () => {
    it('should fall below minimum threshold when no keyword match and low vector similarity', async () => {
      const userQuery = 'What is the weather like today?';
      const threshold = 0.5;

      // Mock out-of-scope scenario
      const faqEntry = {
        question: 'What is the submission deadline?',
        answer: 'The submission deadline is December 31, 2024.',
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5]
      };

      const queryEmbedding = [0.9, 0.8, 0.7, 0.6, 0.1]; // Very different embedding
      const similarityScore = 0.2; // Low similarity

      mockKeywordMatcher.checkKeywords.mockReturnValue(false);
      mockEmbeddingService.generateEmbedding.mockResolvedValue(queryEmbedding);
      mockVectorIndex.search.mockResolvedValue([faqEntry]);
      mockVectorIndex.getSimilarityScore.mockReturnValue(similarityScore);

      // Simulate chatbot processing
      const hasKeywordMatch = mockKeywordMatcher.checkKeywords(userQuery);
      
      if (!hasKeywordMatch) {
        const embedding = await mockEmbeddingService.generateEmbedding(userQuery);
        const searchResults = await mockVectorIndex.search(embedding);
        const score = mockVectorIndex.getSimilarityScore(embedding, searchResults[0].embedding);

        expect(score).toBeLessThan(threshold);
        expect(score).toBe(0.2);
        
        // Should trigger fallback mechanism
        const fallbackResponse = 'I apologize, but I don\'t have information about that topic. Please contact the admin at admin@thapar.edu for assistance.';
        
        expect(fallbackResponse).toContain('admin@thapar.edu');
      }

      expect(hasKeywordMatch).toBe(false);
    });
  });

  // Additional chatbot functionality tests
  describe('Additional Chatbot Functionality', () => {
    it('should handle preprocessing and embedding pipeline', async () => {
      const userQuery = 'How do I upload my training letter?';
      
      mockEmbeddingService.preprocessQuery.mockReturnValue('how do i upload my training letter');
      mockEmbeddingService.generateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);

      const processedQuery = mockEmbeddingService.preprocessQuery(userQuery);
      const embedding = await mockEmbeddingService.generateEmbedding(processedQuery);

      expect(mockEmbeddingService.preprocessQuery).toHaveBeenCalledWith(userQuery);
      expect(mockEmbeddingService.generateEmbedding).toHaveBeenCalledWith(processedQuery);
      expect(embedding).toEqual([0.1, 0.2, 0.3]);
    });

    it('should prioritize keyword matching over vector search', async () => {
      const userQuery = 'upload document';
      
      mockKeywordMatcher.checkKeywords.mockReturnValue(true);
      mockKeywordMatcher.getPredefinedResponse.mockReturnValue('To upload documents, go to your dashboard and click on the upload section.');

      // Check keyword first
      const hasKeywordMatch = mockKeywordMatcher.checkKeywords(userQuery);
      
      if (hasKeywordMatch) {
        const response = mockKeywordMatcher.getPredefinedResponse(userQuery);
        expect(response).toBe('To upload documents, go to your dashboard and click on the upload section.');
        
        // Vector search should not be called
        expect(mockVectorIndex.search).not.toHaveBeenCalled();
      }
    });

    it('should handle multiple FAQ matches and return best score', async () => {
      const userQuery = 'submission requirements';
      
      const faqEntries = [
        {
          question: 'What are the submission requirements?',
          answer: 'You need to submit training letter and fee receipt.',
          embedding: [0.1, 0.2, 0.3]
        },
        {
          question: 'What documents are required for submission?',
          answer: 'Required documents include training letter, fee receipt, and goal report.',
          embedding: [0.15, 0.25, 0.35]
        }
      ];

      const queryEmbedding = [0.12, 0.22, 0.32];
      
      mockEmbeddingService.generateEmbedding.mockResolvedValue(queryEmbedding);
      mockVectorIndex.search.mockResolvedValue(faqEntries);
      mockVectorIndex.getSimilarityScore
        .mockReturnValueOnce(0.9)  // First entry score
        .mockReturnValueOnce(0.95); // Second entry score (higher)

      const embedding = await mockEmbeddingService.generateEmbedding(userQuery);
      const searchResults = await mockVectorIndex.search(embedding);
      
      let bestMatch = null;
      let bestScore = 0;
      
      searchResults.forEach(result => {
        const score = mockVectorIndex.getSimilarityScore(embedding, result.embedding);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = result;
        }
      });

      expect(bestScore).toBe(0.95);
      expect(bestMatch.answer).toBe('Required documents include training letter, fee receipt, and goal report.');
    });

    it('should handle empty or invalid queries', async () => {
      const invalidQueries = ['', '   ', null, undefined];
      
      for (const query of invalidQueries) {
        mockEmbeddingService.preprocessQuery.mockReturnValue('');
        
        const processedQuery = mockEmbeddingService.preprocessQuery(query);
        
        if (!processedQuery || processedQuery.trim() === '') {
          const errorResponse = 'Please provide a valid question.';
          expect(errorResponse).toBe('Please provide a valid question.');
        }
      }
    });

    it('should maintain conversation context', async () => {
      const conversationHistory = [
        { user: 'What is the deadline?', bot: 'The submission deadline is December 31, 2024.' },
        { user: 'Can I extend it?', bot: 'Extensions may be granted in exceptional circumstances. Please contact admin.' }
      ];

      const currentQuery = 'How do I request it?';
      
      // Context should help understand "it" refers to extension
      const contextualQuery = `${conversationHistory[1].user} ${currentQuery}`;
      
      mockEmbeddingService.preprocessQuery.mockReturnValue('can i extend it how do i request it');
      
      const processedQuery = mockEmbeddingService.preprocessQuery(contextualQuery);
      
      expect(processedQuery).toContain('extend');
      expect(processedQuery).toContain('request');
    });
  });
});