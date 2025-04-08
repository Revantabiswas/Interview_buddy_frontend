import { useState, useEffect } from 'react';
import { api } from '../lib/api';

const useMindMapService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mindmaps, setMindmaps] = useState([]);
  const [currentMindmap, setCurrentMindmap] = useState(null);

  // Get all mind maps
  const getMindMaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/mindmaps/all');
      if (response.data && response.data.mindmaps) {
        setMindmaps(response.data.mindmaps);
      }
    } catch (err) {
      console.error('Error fetching mind maps:', err);
      setError('Failed to load mind maps. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get mind map by ID
  const getMindMapById = async (mindmapId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/mindmaps/${mindmapId}`);
      setCurrentMindmap(response.data);
      return response.data;
    } catch (err) {
      console.error(`Error fetching mind map ${mindmapId}:`, err);
      setError('Failed to load mind map. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new mind map
  const createMindMap = async (documentId, title, topic = null, maxDepth = 3) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/mindmaps/create', {
        document_id: documentId,
        title,
        topic,
        max_depth: maxDepth
      });
      
      // Refresh mind maps list after creating a new one
      await getMindMaps();
      
      // Set the newly created mind map as current
      setCurrentMindmap(response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating mind map:', err);
      setError(err.response?.data?.detail || 'Failed to create mind map. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a mind map
  const deleteMindMap = async (mindmapId) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/mindmaps/${mindmapId}`);
      
      // Remove from local state
      setMindmaps(mindmaps.filter(map => map.id !== mindmapId));
      
      // Clear current mind map if it's the one being deleted
      if (currentMindmap && currentMindmap.id === mindmapId) {
        setCurrentMindmap(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting mind map ${mindmapId}:`, err);
      setError('Failed to delete mind map. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load mind maps on initial render
  useEffect(() => {
    getMindMaps();
  }, []);

  return {
    loading,
    error,
    mindmaps,
    currentMindmap,
    getMindMaps,
    getMindMapById,
    createMindMap,
    deleteMindMap
  };
};

export default useMindMapService;