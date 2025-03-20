import React, { createContext, useContext, useState } from 'react';

// Create the context
const LLMContext = createContext();

// Mock LLM service that returns predefined responses
const mockResponses = [
  "Welcome, adventurer! You find yourself at the entrance of a dark cave. What would you like to do?",
  "As you step into the cave, the air grows cold. You see faint glimmers of light reflecting off what appears to be crystals embedded in the walls.",
  "You hear a rustling sound from deeper within the cave. Something seems to be moving in the darkness ahead.",
  "You discover an old wooden chest tucked away in a corner. It appears to be locked.",
  "Rolling a perception check... You notice footprints in the dust. They seem to lead deeper into the cave."
];

// Provider component
export const LLMContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [responseIndex, setResponseIndex] = useState(0);

  // Mock function to generate responses
  const generateResponse = async (userInput, context) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock response and cycle through available responses
    const response = {
      text: mockResponses[responseIndex % mockResponses.length],
      gameStateChanges: null
    };
    
    setResponseIndex(prev => prev + 1);
    
    return response;
  };

  // Toggle connection status (for demo purposes)
  const toggleConnection = () => {
    setIsConnected(prev => !prev);
  };

  // Value to be provided by the context
  const contextValue = {
    isConnected,
    generateResponse,
    toggleConnection
  };

  return (
    <LLMContext.Provider value={contextValue}>
      {children}
    </LLMContext.Provider>
  );
};

// Custom hook for using this context
export const useLLM = () => {
  const context = useContext(LLMContext);
  
  if (!context) {
    throw new Error('useLLM must be used within an LLMContextProvider');
  }
  
  return context;
};

export default LLMContext;