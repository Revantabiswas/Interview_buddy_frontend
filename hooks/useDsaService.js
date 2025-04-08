import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useDsaService = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProblems = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.company) params.append('company', filters.company);
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await axios.get(`${API_URL}/dsa/problems?${params.toString()}`);
      setProblems(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching DSA problems:', error);
      setError(error.message || 'Failed to fetch DSA problems');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getProblem = async (problemId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/dsa/problems/${problemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching problem ${problemId}:`, error);
      setError(error.message || 'Failed to fetch problem');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitSolution = async (problemId, code, language) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/dsa/problems/${problemId}/submit`, {
        code,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError(error.message || 'Failed to submit solution');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendations = async (userProfile, targetCompanies, difficultyLevel, topics) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/dsa/recommend`, {
        user_profile: userProfile,
        target_companies: targetCompanies,
        difficulty_level: difficultyLevel,
        topics: topics
      });
      return response.data;
    } catch (error) {
      console.error('Error getting DSA recommendations:', error);
      setError(error.message || 'Failed to get recommendations');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeProblemPattern = async (problemDescription, similarProblems = []) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/dsa/analyze-pattern`, {
        problem_description: problemDescription,
        similar_problems: similarProblems
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing problem pattern:', error);
      setError(error.message || 'Failed to analyze problem pattern');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of problems
  useEffect(() => {
    fetchProblems();
  }, []);

  return {
    problems,
    isLoading,
    error,
    fetchProblems,
    getProblem,
    submitSolution,
    getRecommendations,
    analyzeProblemPattern
  };
};