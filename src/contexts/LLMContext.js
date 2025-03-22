// src/contexts/LLMContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const LLMContext = createContext();

// Provider component
export const LLMContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('llmApiKey') || '');
  const [model, setModel] = useState(localStorage.getItem('llmModel') || 'claude-3-opus-20240229');

  // Function to generate responses using an actual API
  const generateResponse = async (userInput, context) => {
    try {
      // Check if we have an API key
      if (!apiKey) {
        setIsConnected(false);
        throw new Error('API key not configured');
      }

      setIsConnected(true);
      
      // Create the system prompt for the GM
      const systemPrompt = `You are an experienced Dungeons & Dragons Game Master. 
Your task is to provide immersive, engaging, and responsive storytelling for the player.
Follow D&D 5e rules accurately but prioritize fun and narrative flow over strict rule adherence.
Respond in a narrative style, describing scenes vividly and roleplaying NPCs with distinct personalities.

Current game state:
Location: ${context.gameState.location.name} - ${context.gameState.location.description}
Active quests: ${context.gameState.quests.map(q => q.name).join(', ')}

${context.memories.length > 0 ? 'Relevant memories:\n' + context.memories.map(m => `- ${m.content}`).join('\n') : ''}
`;

      // Prepare the conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...context.conversation.map(msg => ({ 
          role: msg.role, 
          content: msg.content 
        })),
        { role: 'user', content: userInput }
      ];

      // Call the Anthropic API (or whatever API you're using)
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey,
          model,
          messages,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error communicating with LLM service');
      }

      const data = await response.json();
      
      // Extract any state changes from the response
      // We'll assume the LLM might include state changes in a JSON format within the response
      let gameStateChanges = null;
      try {
        const stateChangeMatch = data.content[0].text.match(/\{\{GAME_STATE\}\}(.*?)\{\{\/GAME_STATE\}\}/s);
        if (stateChangeMatch && stateChangeMatch[1]) {
          gameStateChanges = JSON.parse(stateChangeMatch[1]);
          // Remove the state change block from the response
          data.content[0].text = data.content[0].text.replace(/\{\{GAME_STATE\}\}(.*?)\{\{\/GAME_STATE\}\}/s, '');
        }
      } catch (e) {
        console.warn('Failed to parse game state changes:', e);
      }

      return {
        text: data.content[0].text.trim(),
        gameStateChanges: gameStateChanges
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        text: `I'm currently having trouble connecting to my thinking module. Please check your connection settings or try again later. Error: ${error.message}`,
        gameStateChanges: null
      };
    }
  };

  // Update the API key
  const updateApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('llmApiKey', newKey);
    setIsConnected(!!newKey);
  };

  // Update the model
  const updateModel = (newModel) => {
    setModel(newModel);
    localStorage.setItem('llmModel', newModel);
  };

  // Value to be provided by the context
  const contextValue = {
    isConnected,
    generateResponse,
    updateApiKey,
    updateModel,
    apiKey,
    model
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