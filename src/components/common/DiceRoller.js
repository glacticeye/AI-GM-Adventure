// src/components/common/DiceRoller.js
import React, { useState, useEffect } from 'react';
import './DiceRoller.css';

// Dice types available in D&D
const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

const DiceRoller = ({ onRollResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rolls, setRolls] = useState([]);
  const [customDice, setCustomDice] = useState('');
  const [customQuantity, setCustomQuantity] = useState(1);
  
  // Load rolls from localStorage on mount
  useEffect(() => {
    const savedRolls = localStorage.getItem('diceRolls');
    if (savedRolls) {
      try {
        setRolls(JSON.parse(savedRolls).slice(0, 10));
      } catch (e) {
        console.error('Failed to parse saved dice rolls:', e);
      }
    }
  }, []);
  
  // Save rolls to localStorage when they change
  useEffect(() => {
    localStorage.setItem('diceRolls', JSON.stringify(rolls.slice(0, 10)));
  }, [rolls]);

  // Roll a die of the given number of sides
  const rollDie = (sides, quantity = 1) => {
    const newRolls = [];
    let total = 0;
    
    for (let i = 0; i < quantity; i++) {
      const value = Math.floor(Math.random() * sides) + 1;
      newRolls.push(value);
      total += value;
    }
    
    const rollResult = {
      id: Date.now(),
      dice: `${quantity}d${sides}`,
      values: newRolls,
      total: total
    };
    
    // Add the roll to the history
    setRolls(prev => [rollResult, ...prev.slice(0, 9)]);
    
    // Call the callback if provided
    if (onRollResult) {
      onRollResult(rollResult);
    }
    
    return rollResult;
  };

  // Handle the custom dice roll
  const handleCustomRoll = (e) => {
    e.preventDefault();
    
    // Parse the dice notation (e.g., "2d6+3")
    const diceRegex = /^(\d+)?d(\d+)([+-]\d+)?$/i;
    const match = customDice.match(diceRegex);
    
    if (match) {
      const quantity = match[1] ? parseInt(match[1]) : 1;
      const sides = parseInt(match[2]);
      const modifier = match[3] ? parseInt(match[3]) : 0;
      
      const newRolls = [];
      let total = modifier;
      
      for (let i = 0; i < quantity; i++) {
        const value = Math.floor(Math.random() * sides) + 1;
        newRolls.push(value);
        total += value;
      }
      
      const rollResult = {
        id: Date.now(),
        dice: customDice,
        values: newRolls,
        total: total,
        modifier: modifier
      };
      
      // Add the roll to the history
      setRolls(prev => [rollResult, ...prev.slice(0, 9)]);
      
      // Call the callback if provided
      if (onRollResult) {
        onRollResult(rollResult);
      }
      
      // Reset the custom dice input
      setCustomDice('');
      
      return rollResult;
    }
  };

  // Toggle the dice roller panel
  const toggleDiceRoller = () => {
    setIsOpen(!isOpen);
  };

  // Function to clear all rolls
  const clearRolls = () => {
    setRolls([]);
  };

  return (
    <div className={`dice-roller ${isOpen ? 'open' : ''}`}>
      <button 
        className="dice-roller-toggle" 
        onClick={toggleDiceRoller}
        title="Dice Roller"
      >
        <span role="img" aria-label="Dice">🎲</span>
      </button>
      
      {isOpen && (
        <div className="dice-roller-panel">
          <h3>Dice Roller</h3>
          
          <div className="common-dice">
            {DICE_TYPES.map(sides => (
              <button 
                key={sides} 
                className="dice-button"
                onClick={() => rollDie(sides, customQuantity)}
              >
                {`d${sides}`}
              </button>
            ))}
          </div>
          
          <div className="dice-quantity">
            <label htmlFor="dice-quantity">Quantity:</label>
            <input
              id="dice-quantity"
              type="number"
              min="1"
              max="100"
              value={customQuantity}
              onChange={e => setCustomQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <form className="custom-dice-form" onSubmit={handleCustomRoll}>
            <input
              type="text"
              placeholder="e.g., 2d6+3"
              value={customDice}
              onChange={e => setCustomDice(e.target.value)}
            />
            <button type="submit">Roll</button>
          </form>
          
          <div className="dice-history">
            <div className="dice-history-header">
              <h4>Roll History</h4>
              {rolls.length > 0 && (
                <button className="clear-history" onClick={clearRolls} title="Clear history">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
            {rolls.length > 0 ? (
              <ul>
                {rolls.map(roll => (
                  <li key={roll.id}>
                    <strong>{roll.dice}:</strong> {roll.values.join(', ')}
                    {roll.modifier ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''}
                    {' = '}<span className="roll-total">{roll.total}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-rolls">No dice rolled yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;