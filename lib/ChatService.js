// ChatService.js - Direct service for chat functionality
import { chatAPI } from './api';

class ChatService {
  constructor() {
    this.messages = [];
    this.isLoading = false;
    this.error = null;
    this.messageListeners = [];
    this.loadingListeners = [];
    this.errorListeners = [];
  }

  // Subscribe to messages updates
  onMessagesChange(callback) {
    this.messageListeners.push(callback);
    callback(this.messages);
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
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

  // Update messages and notify listeners
  _updateMessages(newMessages) {
    this.messages = newMessages;
    this.messageListeners.forEach(callback => callback(this.messages));
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

  // Format message for display
  _formatMessage(role, content, htmlContent = null) {
    return {
      role,
      content,
      htmlContent,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now().toString()
    };
  }

  // Send a message to the chat API
  async sendMessage(documentId, message, history = this.messages) {
    if (!documentId || !message.trim()) {
      this._updateError("Document ID and message are required");
      return;
    }

    try {
      // Add user message to messages
      const userMessage = this._formatMessage("user", message);
      const updatedMessages = [...this.messages, userMessage];
      this._updateMessages(updatedMessages);
      
      // Set loading state
      this._updateLoading(true);
      this._updateError(null);

      // Format history for API
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Send message to API
      const response = await chatAPI.sendMessage(documentId, message, formattedHistory);
      
      // Add AI response to messages
      const aiMessage = this._formatMessage(
        "assistant", 
        response.response || response.text || response.content || "Sorry, I couldn't process that request.",
        response.htmlContent
      );
      
      // Update messages with AI response
      this._updateMessages([...updatedMessages, aiMessage]);
      
      return aiMessage;
    } catch (error) {
      this._updateError(error.message || "Failed to send message");
      console.error("Chat error:", error);
    } finally {
      this._updateLoading(false);
    }
  }

  // Generate study notes
  async generateNotes(documentId, topic = null) {
    if (!documentId) {
      this._updateError("Document ID is required");
      return;
    }

    try {
      this._updateLoading(true);
      this._updateError(null);
      
      const response = await chatAPI.generateNotes(documentId, topic);
      return response.notes;
    } catch (error) {
      this._updateError(error.message || "Failed to generate notes");
      console.error("Notes generation error:", error);
      return null;
    } finally {
      this._updateLoading(false);
    }
  }

  // Clear chat messages
  clearChat() {
    this._updateMessages([]);
    this._updateError(null);
  }
}

// Export a singleton instance
const chatService = new ChatService();
export default chatService;