"use client"

import { useState, useEffect } from 'react';
import flashcardService from '@/lib/FlashcardService';

export const useFlashcardsService = () => {
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to flashcard service updates
    const unsubscribeDecks = flashcardService.onDecksChange(setDecks);
    const unsubscribeCurrentDeck = flashcardService.onCurrentDeckChange(setCurrentDeck);
    const unsubscribeFlashcards = flashcardService.onFlashcardsChange(setFlashcards);
    const unsubscribeLoading = flashcardService.onLoadingChange(setLoading);
    const unsubscribeError = flashcardService.onErrorChange(setError);

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeDecks();
      unsubscribeCurrentDeck();
      unsubscribeFlashcards();
      unsubscribeLoading();
      unsubscribeError();
    };
  }, []);

  return {
    decks,
    currentDeck,
    flashcards,
    loading,
    error,
    fetchDecks: flashcardService.fetchDecks.bind(flashcardService),
    fetchDeck: flashcardService.fetchDeck.bind(flashcardService),
    createDeck: flashcardService.createDeck.bind(flashcardService),
    deleteDeck: flashcardService.deleteDeck.bind(flashcardService),
    updateFlashcard: flashcardService.updateFlashcard.bind(flashcardService)
  };
};
