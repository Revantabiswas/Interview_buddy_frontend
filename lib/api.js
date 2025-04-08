const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Improved helper function for handling response errors
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    
    // Add specific handling for common status codes
    if (response.status === 404) {
      errorMessage = `API endpoint not found (404). Please check if the server is running and the endpoint is correct.`;
    } else if (response.status === 401) {
      errorMessage = `Authentication required (401). Please log in again.`;
    } else if (response.status === 403) {
      errorMessage = `Access denied (403). You don't have permission to access this resource.`;
    } else if (response.status === 500) {
      errorMessage = `Server error (500). Please try again later or contact support.`;
    }
    
    try {
      const errorData = await response.json();
      console.log('Error response data:', errorData);
      
      // Extract error message
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      console.log('Could not parse error response as JSON:', e);
    }
    
    // Log the full error information for debugging
    console.error(`API Error (${response.status}): ${errorMessage}`, {
      url: response.url,
      statusText: response.statusText
    });
    
    throw new Error(errorMessage);
  }
  
  // For successful responses, parse and return the JSON data
  return response.json();
};

// API Client for documents
export const documentsAPI = {
  getDocuments: async () => {
    const response = await fetch(`${API_URL}/v1/documents/all`);
    return handleResponse(response);
  },
  
  getDocument: async (documentId) => {
    const response = await fetch(`${API_URL}/v1/documents/${documentId}`);
    return handleResponse(response);
  },
  
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/v1/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
  
  deleteDocument: async (documentId) => {
    const response = await fetch(`${API_URL}/v1/documents/${documentId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};

// API Client for chat
export const chatAPI = {
  sendMessage: async (documentId, message, history = []) => {
    const response = await fetch(`${API_URL}/v1/chat/${documentId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });
    return handleResponse(response);
  },
  
  generateNotes: async (documentId, topic = null) => {
    const response = await fetch(`${API_URL}/v1/chat/${documentId}/generate-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    return handleResponse(response);
  }
};

// Notes API functions
export const notesAPI = {
  // Get all notes
  async getNotes() {
    const response = await fetch(`${API_URL}/notes/all`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  // Get a specific note
  async getNote(noteId) {
    const response = await fetch(`${API_URL}/notes/${noteId}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  // Create empty notes
  async createNotes(documentId, title, topic = "") {
    const response = await fetch(`${API_URL}/notes/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        title,
        topic
      }),
    });
    if (!response.ok) throw new Error('Failed to create notes');
    return response.json();
  },

  // Generate AI study notes
  async generateNotes(documentId, title, topic = "") {
    const response = await fetch(`${API_URL}/notes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        title,
        topic
      }),
    });
    if (!response.ok) throw new Error('Failed to generate notes');
    return response.json();
  },

  // Update a note
  async updateNote(noteId, updates) {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  // Delete a note
  async deleteNote(noteId) {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return response.json();
  },
};

// Export the API URL and response handler for direct use
export { API_URL, handleResponse };
