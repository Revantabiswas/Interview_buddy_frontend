import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useCrewService = () => {
  const [crews, setCrews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCrews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/crews`);
      setCrews(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching crews:', error);
      setError(error.message || 'Failed to fetch crews');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createCrew = async (name, description) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/crews`, { name, description });
      setCrews(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating crew:', error);
      setError(error.message || 'Failed to create crew');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCrew = async (crewId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/crews/${crewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching crew ${crewId}:`, error);
      setError(error.message || 'Failed to fetch crew');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addDocumentToCrew = async (crewId, documentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/crews/${crewId}/documents`, { document_id: documentId });
      // Update the crew in the local state
      setCrews(prev => prev.map(crew => 
        crew.id === crewId ? { ...crew, documents: [...crew.documents, documentId] } : crew
      ));
      return response.data;
    } catch (error) {
      console.error('Error adding document to crew:', error);
      setError(error.message || 'Failed to add document to crew');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addMemberToCrew = async (crewId, username, role = 'member') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/crews/${crewId}/members`, { username, role });
      return response.data;
    } catch (error) {
      console.error('Error adding member to crew:', error);
      setError(error.message || 'Failed to add member to crew');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createStudySession = async (crewId, topic, documentId, taskType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/crews/${crewId}/study`, {
        topic,
        document_id: documentId,
        task_type: taskType
      });
      return response.data;
    } catch (error) {
      console.error('Error creating study session:', error);
      setError(error.message || 'Failed to create study session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCrews();
  }, []);

  return {
    crews,
    isLoading,
    error,
    fetchCrews,
    createCrew,
    getCrew,
    addDocumentToCrew,
    addMemberToCrew,
    createStudySession
  };
};