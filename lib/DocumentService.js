// DocumentService.js - Direct service for document management
import { documentsAPI } from './api';

class DocumentService {
  constructor() {
    this.documents = [];
    this.currentDocument = null;
    this.isLoading = false;
    this.error = null;
    this.uploadProgress = 0;
    
    this.documentsListeners = [];
    this.currentDocumentListeners = [];
    this.loadingListeners = [];
    this.errorListeners = [];
    this.uploadProgressListeners = [];
  }

  // Subscribe to documents updates
  onDocumentsChange(callback) {
    this.documentsListeners.push(callback);
    callback(this.documents);
    return () => {
      this.documentsListeners = this.documentsListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to current document updates
  onCurrentDocumentChange(callback) {
    this.currentDocumentListeners.push(callback);
    callback(this.currentDocument);
    return () => {
      this.currentDocumentListeners = this.currentDocumentListeners.filter(cb => cb !== callback);
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

  // Subscribe to upload progress updates
  onUploadProgressChange(callback) {
    this.uploadProgressListeners.push(callback);
    callback(this.uploadProgress);
    return () => {
      this.uploadProgressListeners = this.uploadProgressListeners.filter(cb => cb !== callback);
    };
  }

  // Update documents and notify listeners
  _updateDocuments(newDocuments) {
    this.documents = newDocuments;
    this.documentsListeners.forEach(callback => callback(this.documents));
  }

  // Update current document and notify listeners
  _updateCurrentDocument(document) {
    this.currentDocument = document;
    this.currentDocumentListeners.forEach(callback => callback(this.currentDocument));
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

  // Update upload progress and notify listeners
  _updateUploadProgress(progress) {
    this.uploadProgress = progress;
    this.uploadProgressListeners.forEach(callback => callback(this.uploadProgress));
  }

  // Fetch all documents
  async fetchDocuments() {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const data = await documentsAPI.getDocuments();
      this._updateDocuments(data.documents || []);
      return data.documents || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      this._updateError(error.message || 'Failed to fetch documents');
      return [];
    } finally {
      this._updateLoading(false);
    }
  }

  // Fetch a specific document
  async fetchDocument(documentId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const document = await documentsAPI.getDocument(documentId);
      this._updateCurrentDocument(document);
      return document;
    } catch (error) {
      console.error(`Error fetching document ${documentId}:`, error);
      this._updateError(error.message || 'Failed to fetch document');
      return null;
    } finally {
      this._updateLoading(false);
    }
  }

  // Upload a document with progress tracking
  async uploadDocument(file) {
    this._updateLoading(true);
    this._updateError(null);
    this._updateUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const onProgress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          this._updateUploadProgress(percentCompleted);
        }
      };
      
      const document = await documentsAPI.uploadDocument(formData, onProgress);
      this._updateDocuments([...this.documents, document]);
      this._updateUploadProgress(100);
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      this._updateError(error.message || 'Failed to upload document');
      throw error;
    } finally {
      this._updateLoading(false);
      // Reset progress after a short delay
      setTimeout(() => this._updateUploadProgress(0), 3000);
    }
  }

  // Delete a document
  async deleteDocument(documentId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      await documentsAPI.deleteDocument(documentId);
      this._updateDocuments(this.documents.filter(doc => doc.id !== documentId));
      
      // If the current document is the one being deleted, clear it
      if (this.currentDocument && this.currentDocument.id === documentId) {
        this._updateCurrentDocument(null);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      this._updateError(error.message || 'Failed to delete document');
      throw error;
    } finally {
      this._updateLoading(false);
    }
  }

  // Get document text
  async getDocumentText(documentId) {
    this._updateLoading(true);
    this._updateError(null);
    
    try {
      const text = await documentsAPI.getDocumentText(documentId);
      return text;
    } catch (error) {
      console.error(`Error fetching document text for ${documentId}:`, error);
      this._updateError(error.message || 'Failed to fetch document text');
      return null;
    } finally {
      this._updateLoading(false);
    }
  }

  // Initialize service by fetching all documents
  initialize() {
    this.fetchDocuments();
  }
}

// Export a singleton instance
const documentService = new DocumentService();
documentService.initialize();
export default documentService;