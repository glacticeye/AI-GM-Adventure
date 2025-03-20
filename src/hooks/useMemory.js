import { useState, useCallback } from 'react';

// A simple hook for memory management in the game
const useMemory = () => {
  // Store memories as an array of objects
  const [memories, setMemories] = useState([
    {
      id: 'm1',
      type: 'location',
      content: 'The adventure began at the entrance to a mysterious cave system known for its glowing crystals.',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      importance: 'high'
    },
    {
      id: 'm2',
      type: 'npc',
      content: 'Met an old hermit named Gareth who warned about strange noises coming from deep within the cave.',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      importance: 'medium'
    },
    {
      id: 'm3',
      type: 'item',
      content: 'Found a rusty key that might open something important.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      importance: 'low'
    },
    {
      id: 'm4',
      type: 'quest',
      content: 'Accepted a quest to discover the source of the glowing crystals and their magical properties.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      importance: 'high'
    }
  ]);

  // Add a new memory
  const addToMemory = useCallback((memoryData) => {
    const { userMessage, gmResponse, gameStateChanges } = memoryData;
    
    // Create a summary of the interaction
    const content = `Player: "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}" - GM: "${gmResponse.slice(0, 50)}${gmResponse.length > 50 ? '...' : ''}"`;
    
    // Determine memory importance based on game state changes
    const importance = gameStateChanges ? 'high' : 'medium';
    
    // Create a new memory object
    const newMemory = {
      id: `m${Date.now()}`,
      type: 'conversation',
      content,
      timestamp: new Date().toISOString(),
      importance,
      details: {
        userMessage,
        gmResponse,
        gameStateChanges
      }
    };
    
    // Add the new memory to the state
    setMemories(prevMemories => [newMemory, ...prevMemories]);
    
    return newMemory;
  }, []);

  // Retrieve relevant memories based on a query
  const retrieveRelevantMemories = useCallback((query) => {
    // This is a very simple relevance algorithm for demo purposes
    // In a real implementation, this would use more sophisticated techniques
    
    // Convert query to lowercase for case-insensitive matching
    const queryLower = query.toLowerCase();
    
    // Filter memories based on content matching and sort by importance
    const relevantMemories = memories
      .filter(memory => memory.content.toLowerCase().includes(queryLower))
      .sort((a, b) => {
        // Sort by importance (high, medium, low)
        const importanceRank = { high: 3, medium: 2, low: 1 };
        const importanceDiff = importanceRank[b.importance] - importanceRank[a.importance];
        
        if (importanceDiff !== 0) return importanceDiff;
        
        // If importance is the same, sort by recency (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, 5); // Limit to 5 most relevant memories
    
    return Promise.resolve(relevantMemories);
  }, [memories]);

  // Delete a memory
  const deleteMemory = useCallback((memoryId) => {
    setMemories(prevMemories => prevMemories.filter(memory => memory.id !== memoryId));
  }, []);

  // Update a memory
  const updateMemory = useCallback((memoryId, updates) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === memoryId ? { ...memory, ...updates } : memory
      )
    );
  }, []);

  return {
    memories,
    addToMemory,
    retrieveRelevantMemories,
    deleteMemory,
    updateMemory
  };
};

export default useMemory;