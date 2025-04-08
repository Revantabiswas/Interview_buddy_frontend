import { useState, useCallback } from 'react';
import { chatAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export const useChatService = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (documentId, content, previousMessages = []) => {
    if (!documentId || !content.trim()) {
      setError("Document ID and message content are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to chat history
      const timestamp = new Date().toLocaleTimeString();
      const userMessage = { role: "user", content, timestamp };
      setMessages((prev) => [...prev, userMessage]);

      // Convert existing messages to expected format for API
      const history = previousMessages.length > 0 ? previousMessages : messages;
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call API with the proper history parameter
      const response = await chatAPI.sendMessage(documentId, content, formattedHistory);
      
      // Add response to chat history
      const assistantMessage = {
        role: "assistant",
        content: response.text || response.markdown || "Sorry, I couldn't generate a response.",
        htmlContent: response.html,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      console.error("Error in chat service:", err);
      const errorMessage = err.message || "Failed to send message";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};