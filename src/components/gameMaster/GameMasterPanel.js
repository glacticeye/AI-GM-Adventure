import React, { useState, useRef, useEffect } from 'react';
import './GameMasterPanel.css';
import useLLM from '../../hooks/useLLM';
import useGameState from '../../hooks/useGameState';
import useMemory from '../../hooks/useMemory';
import ResponseControls from './ResponseControls';
import NarrativeDisplay from './NarrativeDisplay';
import DiceRoller from '../common/DiceRoller';
import Loading from '../common/Loading';

const GameMasterPanel = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');
  
  const conversationEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { generateResponse, isConnected } = useLLM();
  const { gameState, updateGameState } = useGameState();
  const { addToMemory, retrieveRelevantMemories } = useMemory();
  
  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Focus the input field when the component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;
    
    // Add user message to conversation
    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    setIsGenerating(true);
    
    try {
      // Retrieve relevant memories for context
      const relevantMemories = await retrieveRelevantMemories(userInput);
      
      // Generate AI response
      const response = await generateResponse(userInput, {
        gameState,
        memories: relevantMemories,
        conversation: conversation
      });
      
      // Add GM response to conversation
      const gmResponse = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
        gameStateChanges: response.gameStateChanges || null
      };
      
      setConversation(prev => [...prev, gmResponse]);
      
      // Update game state if needed
      if (response.gameStateChanges) {
        updateGameState(response.gameStateChanges);
      }
      
      // Add to memory system
      addToMemory({
        userMessage: userInput,
        gmResponse: response.text,
        gameStateChanges: response.gameStateChanges
      });
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message to conversation
      setConversation(prev => [...prev, {
        role: 'system',
        content: 'Sorry, there was an error communicating with the Game Master. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRetry = async () => {
    if (conversation.length < 1) return;
    
    // Remove the last GM response
    const newConversation = [...conversation];
    const lastUserMessageIndex = newConversation.map(m => m.role).lastIndexOf('user');
    
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = newConversation[lastUserMessageIndex];
      setConversation(newConversation.slice(0, lastUserMessageIndex + 1));
      setIsGenerating(true);
      
      try {
        // Retrieve relevant memories for context
        const relevantMemories = await retrieveRelevantMemories(lastUserMessage.content);
        
        // Generate new AI response
        const response = await generateResponse(lastUserMessage.content, {
          gameState,
          memories: relevantMemories,
          conversation: newConversation.slice(0, lastUserMessageIndex)
        });
        
        // Add GM response to conversation
        const gmResponse = {
          role: 'assistant',
          content: response.text,
          timestamp: new Date().toISOString(),
          gameStateChanges: response.gameStateChanges || null
        };
        
        setConversation(prev => [...prev, gmResponse]);
        
        // Update game state if needed
        if (response.gameStateChanges) {
          updateGameState(response.gameStateChanges);
        }
        
        // Add to memory system
        addToMemory({
          userMessage: lastUserMessage.content,
          gmResponse: response.text,
          gameStateChanges: response.gameStateChanges
        });
        
      } catch (error) {
        console.error('Error regenerating response:', error);
        
        // Add error message to conversation
        setConversation(prev => [...prev, {
          role: 'system',
          content: 'Sorry, there was an error communicating with the Game Master. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true
        }]);
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  const handleEdit = () => {
    if (conversation.length < 1) return;
    
    const lastGMResponse = [...conversation].reverse().find(m => m.role === 'assistant');
    
    if (lastGMResponse) {
      setEditedResponse(lastGMResponse.content);
      setIsEditingResponse(true);
    }
  };
  
  const handleSaveEdit = () => {
    if (!editedResponse.trim()) return;
    
    const newConversation = [...conversation];
    const lastGMResponseIndex = newConversation.map(m => m.role).lastIndexOf('assistant');
    
    if (lastGMResponseIndex !== -1) {
      newConversation[lastGMResponseIndex] = {
        ...newConversation[lastGMResponseIndex],
        content: editedResponse,
        isEdited: true
      };
      
      setConversation(newConversation);
      setIsEditingResponse(false);
      setEditedResponse('');
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditingResponse(false);
    setEditedResponse('');
  };
  
  return (
    <div className="game-master-panel">
      <div className="game-master-header">
        <h2>Game Master</h2>
        <DiceRoller />
      </div>
      
      <div className="conversation-container">
        {conversation.length === 0 ? (
          <div className="empty-conversation">
            <p>Your adventure awaits! Talk to the Game Master to begin...</p>
          </div>
        ) : (
          conversation.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '🧙‍♂️' : message.role === 'assistant' ? '📜' : '⚠️'}
              </div>
              <div className="message-content">
                <NarrativeDisplay content={message.content} />
                {message.isEdited && <span className="edited-tag">(edited)</span>}
              </div>
            </div>
          ))
        )}
        
        {isGenerating && (
          <div className="message assistant generating">
            <div className="message-avatar">📜</div>
            <div className="message-content">
              <Loading text="The Game Master is thinking..." />
            </div>
          </div>
        )}
        
        <div ref={conversationEndRef} />
      </div>
      
      {isEditingResponse ? (
        <div className="response-edit-container">
          <textarea
            value={editedResponse}
            onChange={(e) => setEditedResponse(e.target.value)}
            placeholder="Edit the Game Master's response..."
            rows={4}
          />
          <div className="edit-buttons">
            <button onClick={handleCancelEdit}>Cancel</button>
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <ResponseControls 
            onRetry={handleRetry} 
            onEdit={handleEdit} 
            isGenerating={isGenerating} 
          />
          
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tell the Game Master what you want to do..."
              rows={2}
              disabled={isGenerating || !isConnected}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!userInput.trim() || isGenerating || !isConnected}
            >
              Send
            </button>
          </div>
          
          {!isConnected && (
            <div className="connection-warning">
              Not connected to LLM service. Check your connection settings.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameMasterPanel;