import { useState } from 'react';
import { chatAPI } from '@/utils/api';

export function useAgentService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAgent = async (message, documentId) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending message to agent:', { message, documentId });
      const response = await chatAPI.sendMessage(documentId, message);
      return { answer: response.message.content };
    } catch (err) {
      console.error('Agent service error:', err);
      setError(err.message || 'Failed to get response from the AI');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    runAgent,
    loading,
    error
  };
}
