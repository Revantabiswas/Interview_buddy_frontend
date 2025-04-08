// NotesService.js - Direct service for notes functionality
import { notesAPI } from './api';

class NotesService {
  constructor() {
    this.notes = [];
    this.currentNote = null;
    this.isLoading = false;
    this.error = null;
    
    this.notesListeners = [];
    this.currentNoteListeners = [];
    this.loadingListeners = [];
    this.errorListeners = [];
  }

  // Subscribe to notes updates
  onNotesChange(callback) {
    this.notesListeners.push(callback);
    callback(this.notes);
    return () => {
      this.notesListeners = this.notesListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to current note updates
  onCurrentNoteChange(callback) {
    this.currentNoteListeners.push(callback);
    callback(this.currentNote);
    return () => {
      this.currentNoteListeners = this.currentNoteListeners.filter(cb => cb !== callback);
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

  // Update notes and notify listeners
  _updateNotes(newNotes) {
    this.notes = newNotes;
    this.notesListeners.forEach(callback => callback(this.notes));
  }

  // Update current note and notify listeners
  _updateCurrentNote(note) {
    this.currentNote = note;
    this.currentNoteListeners.forEach(callback => callback(this.currentNote));
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

  // Fetch all notes
  async fetchNotes() {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const { notes } = await notesAPI.getNotes();
      this._updateNotes(notes || []);
      return notes || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      this._updateError(error.message || 'Failed to fetch notes');
      return [];
    } finally {
      this._updateLoading(false);
    }
  }

  // Fetch a specific note
  async fetchNote(noteId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const note = await notesAPI.getNote(noteId);
      this._updateCurrentNote(note);
      return note;
    } catch (error) {
      console.error(`Error fetching note ${noteId}:`, error);
      this._updateError(error.message || 'Failed to fetch note');
      return null;
    } finally {
      this._updateLoading(false);
    }
  }

  // Create study notes from a document
  async createNotes(documentId, title, topic = "") {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const note = await notesAPI.createNotes(documentId, title, topic);
      this._updateNotes([...this.notes, note]);
      return note;
    } catch (error) {
      console.error('Error creating notes:', error);
      this._updateError(error.message || 'Failed to create notes');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Update a note
  async updateNote(noteId, updates) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const updatedNote = await notesAPI.updateNote(noteId, updates);
      
      // Update note in our local state
      this._updateNotes(
        this.notes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      );
      
      // Update current note if this is the one being edited
      if (this.currentNote && this.currentNote.id === noteId) {
        this._updateCurrentNote(updatedNote);
      }
      
      return updatedNote;
    } catch (error) {
      console.error(`Error updating note ${noteId}:`, error);
      this._updateError(error.message || 'Failed to update note');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Delete a note
  async deleteNote(noteId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      await notesAPI.deleteNote(noteId);
      this._updateNotes(this.notes.filter(note => note.id !== noteId));
      
      // If the current note is the one being deleted, clear it
      if (this.currentNote && this.currentNote.id === noteId) {
        this._updateCurrentNote(null);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting note ${noteId}:`, error);
      this._updateError(error.message || 'Failed to delete note');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Generate AI study notes from a document
  async generateNotes(documentId, title, topic = "") {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const note = await notesAPI.generateNotes(documentId, title, topic);
      this._updateNotes([...this.notes, note]);
      return note;
    } catch (error) {
      console.error('Error generating notes:', error);
      this._updateError(error.message || 'Failed to generate notes');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Initialize service by fetching all notes
  initialize() {
    this.fetchNotes();
  }
}

// Export a singleton instance
const notesService = new NotesService();
notesService.initialize();
export default notesService;