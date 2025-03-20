import { useContext } from 'react';
import CharacterContext from '../contexts/CharacterContext';

// Custom hook for using the character context
const useCharacter = () => {
  const context = useContext(CharacterContext);
  
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterContextProvider');
  }
  
  return context;
};

export default useCharacter;