import { useContext } from 'react';
import GameContext from '../contexts/GameContext';

// Custom hook for using the game state context
const useGameState = () => {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGameState must be used within a GameContextProvider');
  }
  
  return context;
};

export default useGameState;