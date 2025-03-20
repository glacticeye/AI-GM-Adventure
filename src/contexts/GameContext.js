import React, { createContext, useContext, useState } from 'react';

// Create the context
const GameContext = createContext();

// Initial game state
const initialGameState = {
  location: {
    name: "Cave Entrance",
    description: "A dark cave mouth looms before you, a chill wind emanating from its depths."
  },
  npcs: [
    {
      id: "npc-1",
      name: "Old Hermit",
      description: "A weathered old man with a long gray beard.",
      disposition: "Friendly",
      location: "Cave Entrance"
    }
  ],
  quests: [
    {
      id: "quest-1",
      name: "The Crystal Cavern",
      description: "Explore the cave and discover its secrets.",
      status: "Active",
      objectives: [
        {
          id: "obj-1",
          description: "Enter the cave",
          completed: false
        },
        {
          id: "obj-2",
          description: "Find the source of the crystals",
          completed: false
        }
      ]
    }
  ],
  inventory: [],
  combatActive: false,
  combatants: []
};

// Provider component
export const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);

  // Update game state (can be partial updates)
  const updateGameState = (updates) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  // Reset game state to initial values
  const resetGameState = () => {
    setGameState(initialGameState);
  };

  // Complete an objective in a quest
  const completeObjective = (questId, objectiveId) => {
    setGameState(prevState => {
      const updatedQuests = prevState.quests.map(quest => {
        if (quest.id === questId) {
          const updatedObjectives = quest.objectives.map(obj => {
            if (obj.id === objectiveId) {
              return { ...obj, completed: true };
            }
            return obj;
          });
          
          return { ...quest, objectives: updatedObjectives };
        }
        return quest;
      });
      
      return { ...prevState, quests: updatedQuests };
    });
  };

  // Add item to inventory
  const addToInventory = (item) => {
    setGameState(prevState => ({
      ...prevState,
      inventory: [...prevState.inventory, item]
    }));
  };

  // Value to be provided by the context
  const contextValue = {
    gameState,
    updateGameState,
    resetGameState,
    completeObjective,
    addToInventory
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using this context
export const useGameState = () => {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGameState must be used within a GameContextProvider');
  }
  
  return context;
};

export default GameContext;