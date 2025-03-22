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

  // Load conversation from localStorage on initial load
  useEffect(() => {
    const savedConversation = localStorage.getItem('conversation');
    if (savedConversation) {
      try {
        setConversation(JSON.parse(savedConversation));
      } catch (e) {
        console.error('Failed to parse saved conversation:', e);
      }
    }
  }, []);

  // Save conversation to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('conversation', JSON.stringify(conversation));
  }, [conversation]);
  
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
  
  const handleDiceRoll = (rollResult) => {
    // Add a system message to the conversation showing the dice roll
    const diceMessage = {
      role: 'system',
      content: `🎲 ${rollResult.dice}: ${rollResult.values.join(', ')}${
        rollResult.modifier ? ` ${rollResult.modifier > 0 ? '+' : ''}${rollResult.modifier}` : ''
      } = ${rollResult.total}`,
      timestamp: new Date().toISOString(),
      isDiceRoll: true
    };
    
    setConversation(prev => [...prev, diceMessage]);
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
  
  const handleClearConversation = () => {
    if (window.confirm('Are you sure you want to clear the entire conversation? This cannot be undone.')) {
      setConversation([]);
    }
  };
  
  const handleExportConversation = () => {
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dnd-adventure-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="game-master-panel">
      <div className="game-master-header">
        <h2>Game Master</h2>
        <div className="header-actions">
          {conversation.length > 0 && (
            <>
              <button 
                className="clear-conversation-button" 
                onClick={handleClearConversation}
                title="Clear conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button 
                className="export-conversation-button" 
                onClick={handleExportConversation}
                title="Export conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </>
          )}
          <DiceRoller onRollResult={handleDiceRoll} />
        </div>
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
              className={`message ${message.role} ${message.isError ? 'error' : ''} ${message.isDiceRoll ? 'dice-roll' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '🧙‍♂️' : message.role === 'assistant' ? '📜' : message.isDiceRoll ? '🎲' : '⚠️'}
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