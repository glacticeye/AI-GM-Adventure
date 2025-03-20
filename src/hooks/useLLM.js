import { useContext } from 'react';
import LLMContext from '../contexts/LLMContext';

// Custom hook for using the LLM context
const useLLM = () => {
  const context = useContext(LLMContext);
  
  if (!context) {
    throw new Error('useLLM must be used within an LLMContextProvider');
  }
  
  return context;
};

export default useLLM;