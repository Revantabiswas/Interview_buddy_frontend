// FlashcardService.js - Direct service for flashcard functionality
import { flashcardsAPI } from './api';

class FlashcardService {
  constructor() {
    this.decks = [];
    this.currentDeck = null;
    this.flashcards = [];
    this.isLoading = false;
    this.error = null;
    
    this.decksListeners = [];
    this.currentDeckListeners = [];
    this.flashcardsListeners = [];
    this.loadingListeners = [];
    this.errorListeners = [];
  }

  // Subscribe to decks updates
  onDecksChange(callback) {
    this.decksListeners.push(callback);
    callback(this.decks);
    return () => {
      this.decksListeners = this.decksListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to current deck updates
  onCurrentDeckChange(callback) {
    this.currentDeckListeners.push(callback);
    callback(this.currentDeck);
    return () => {
      this.currentDeckListeners = this.currentDeckListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to flashcards updates
  onFlashcardsChange(callback) {
    this.flashcardsListeners.push(callback);
    callback(this.flashcards);
    return () => {
      this.flashcardsListeners = this.flashcardsListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to loading state updates
  onLoadingChange(callback) {
    this.loadingListeners.push(callback);
    callback(this.isLoading);
    return () => {
      this.loadingListeners = this.loadingListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to error updates
  onErrorChange(callback) {
    this.errorListeners.push(callback);
    callback(this.error);
    return () => {
      this.errorListeners = this.errorListeners.filter(cb => cb !== callback);
    };
  }

  // Update decks and notify listeners
  _updateDecks(newDecks) {
    this.decks = newDecks;
    this.decksListeners.forEach(callback => callback(this.decks));
  }

  // Update current deck and notify listeners
  _updateCurrentDeck(deck) {
    this.currentDeck = deck;
    this.currentDeckListeners.forEach(callback => callback(this.currentDeck));
  }

  // Update flashcards and notify listeners
  _updateFlashcards(newFlashcards) {
    this.flashcards = newFlashcards;
    this.flashcardsListeners.forEach(callback => callback(this.flashcards));
  }

  // Update loading state and notify listeners
  _updateLoading(isLoading) {
    this.isLoading = isLoading;
    this.loadingListeners.forEach(callback => callback(this.isLoading));
  }

  // Update error and notify listeners
  _updateError(error) {
    this.error = error;
    this.errorListeners.forEach(callback => callback(this.error));
  }

  // Fetch all flashcard decks
  async fetchDecks() {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const data = await flashcardsAPI.getDecks();
      this._updateDecks(data.decks || []);
      return data.decks || [];
    } catch (error) {
      console.error('Error fetching flashcard decks:', error);
      this._updateError(error.message || 'Failed to fetch flashcard decks');
      return [];
    } finally {
      this._updateLoading(false);
    }
  }

  // Fetch a specific deck with its flashcards
  async fetchDeck(deckId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const data = await flashcardsAPI.getDeck(deckId);
      this._updateCurrentDeck(data.deck);
      this._updateFlashcards(data.flashcards);
      return data;
    } catch (error) {
      console.error(`Error fetching deck ${deckId}:`, error);
      this._updateError(error.message || 'Failed to fetch flashcard deck');
      return null;
    } finally {
      this._updateLoading(false);
    }
  }

  // Create a new flashcard deck
  async createDeck(documentId, title, topic = "", count = 10) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const data = await flashcardsAPI.createDeck(documentId, title, topic, count);
      this._updateDecks([...this.decks, data.deck]);
      return data;
    } catch (error) {
      console.error('Error creating flashcard deck:', error);
      this._updateError(error.message || 'Failed to create flashcard deck');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Delete a flashcard deck
  async deleteDeck(deckId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      await flashcardsAPI.deleteDeck(deckId);
      this._updateDecks(this.decks.filter(deck => deck.id !== deckId));
      
      // If the current deck is the one being deleted, clear it
      if (this.currentDeck && this.currentDeck.id === deckId) {
        this._updateCurrentDeck(null);
        this._updateFlashcards([]);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting deck ${deckId}:`, error);
      this._updateError(error.message || 'Failed to delete flashcard deck');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Update a flashcard in the current deck
  async updateFlashcard(flashcardId, updates) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const updatedFlashcard = await flashcardsAPI.updateFlashcard(flashcardId, updates);
      
      // Update flashcard in our local state
      this._updateFlashcards(
        this.flashcards.map(card => 
          card.id === flashcardId ? updatedFlashcard : card
        )
      );
      
      return updatedFlashcard;
    } catch (error) {
      console.error(`Error updating flashcard ${flashcardId}:`, error);
      this._updateError(error.message || 'Failed to update flashcard');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Initialize service by fetching all decks
  initialize() {
    this.fetchDecks();
  }
}

// Export a singleton instance
const flashcardService = new FlashcardService();
flashcardService.initialize();
export default flashcardService;