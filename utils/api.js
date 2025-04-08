const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function for handling response errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }
  return response.json();
};

// Document-related API calls
export const documentsAPI = {
  // Upload a document
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  // Get all documents
  getDocuments: async () => {
    const response = await fetch(`${API_URL}/documents/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  // Get a specific document
  getDocument: async (documentId) => {
    const response = await fetch(`${API_URL}/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  // Delete a document
  deleteDocument: async (documentId) => {
    const response = await fetch(`${API_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  }
};

// Chat-related API calls
export const chatAPI = {
  // Send a message to chat with a document
  sendMessage: async (documentId, message) => {
    const response = await fetch(`${API_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        message: message
      }),
      credentials: 'include',
    });
    
    return handleResponse(response);
  }
};

