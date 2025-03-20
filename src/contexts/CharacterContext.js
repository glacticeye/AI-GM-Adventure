import React, { createContext, useContext, useState } from 'react';

// Create the context
const CharacterContext = createContext();

// Sample character data
const sampleCharacter = {
  name: "Tharion Nightblade",
  race: "Half-Elf",
  class: "Rogue",
  level: 3,
  alignment: "Chaotic Good",
  background: "Criminal",
  
  abilityScores: {
    strength: 12,
    dexterity: 16,
    constitution: 14,
    intelligence: 14,
    wisdom: 10,
    charisma: 14
  },
  
  combatStats: {
    hitPoints: {
      max: 24,
      current: 24,
      temporary: 0
    },
    armorClass: 15,
    initiative: 3,
    speed: 30,
    hitDice: {
      total: 3,
      used: 0,
      type: "d8"
    }
  },
  
  skills: {
    acrobatics: { proficient: true, expertise: false },
    animalHandling: { proficient: false, expertise: false },
    arcana: { proficient: false, expertise: false },
    athletics: { proficient: false, expertise: false },
    deception: { proficient: true, expertise: true },
    history: { proficient: false, expertise: false },
    insight: { proficient: false, expertise: false },
    intimidation: { proficient: false, expertise: false },
    investigation: { proficient: true, expertise: false },
    medicine: { proficient: false, expertise: false },
    nature: { proficient: false, expertise: false },
    perception: { proficient: true, expertise: false },
    performance: { proficient: false, expertise: false },
    persuasion: { proficient: true, expertise: false },
    religion: { proficient: false, expertise: false },
    sleightOfHand: { proficient: true, expertise: true },
    stealth: { proficient: true, expertise: true },
    survival: { proficient: false, expertise: false }
  },
  
  inventory: [
    { id: "item-1", name: "Shortsword", type: "Weapon", quantity: 1, weight: 2, description: "Finesse, light" },
    { id: "item-2", name: "Dagger", type: "Weapon", quantity: 2, weight: 1, description: "Finesse, light, thrown (range 20/60)" },
    { id: "item-3", name: "Thieves' Tools", type: "Tool", quantity: 1, weight: 1, description: "Proficiency allows you to add your proficiency bonus to any ability checks made to disarm traps or open locks." },
    { id: "item-4", name: "Potion of Healing", type: "Potion", quantity: 3, weight: 0.5, description: "Regains 2d4+2 hit points when consumed." }
  ],
  
  spells: [],
  
  features: [
    { name: "Sneak Attack", description: "Once per turn, you can deal an extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll." },
    { name: "Cunning Action", description: "You can use a bonus action to take the Dash, Disengage, or Hide action." },
    { name: "Thieves' Cant", description: "You know the secret language of thieves." }
  ],
  
  proficiencies: {
    languages: ["Common", "Elvish", "Thieves' Cant"],
    weapons: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    armor: ["Light armor"],
    tools: ["Thieves' tools", "Playing cards"]
  }
};

// Provider component
export const CharacterContextProvider = ({ children }) => {
  const [character, setCharacter] = useState(sampleCharacter);

  // Update character (can be partial updates)
  const updateCharacter = (updates) => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      ...updates
    }));
  };

  // Update a specific ability score
  const updateAbilityScore = (ability, value) => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      abilityScores: {
        ...prevCharacter.abilityScores,
        [ability]: value
      }
    }));
  };

  // Update hit points
  const updateHitPoints = (current, max, temporary) => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      combatStats: {
        ...prevCharacter.combatStats,
        hitPoints: {
          current: current !== undefined ? current : prevCharacter.combatStats.hitPoints.current,
          max: max !== undefined ? max : prevCharacter.combatStats.hitPoints.max,
          temporary: temporary !== undefined ? temporary : prevCharacter.combatStats.hitPoints.temporary
        }
      }
    }));
  };

  // Add item to inventory
  const addInventoryItem = (item) => {
    // Check if item already exists
    const existingItemIndex = character.inventory.findIndex(i => 
      i.name.toLowerCase() === item.name.toLowerCase() && i.type === item.type
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedInventory = [...character.inventory];
      updatedInventory[existingItemIndex] = {
        ...updatedInventory[existingItemIndex],
        quantity: updatedInventory[existingItemIndex].quantity + (item.quantity || 1)
      };

      setCharacter(prevCharacter => ({
        ...prevCharacter,
        inventory: updatedInventory
      }));
    } else {
      // Add new item
      setCharacter(prevCharacter => ({
        ...prevCharacter,
        inventory: [...prevCharacter.inventory, {
          id: `item-${Date.now()}`,
          ...item
        }]
      }));
    }
  };

  // Remove item from inventory
  const removeInventoryItem = (itemId, quantity = 1) => {
    const itemIndex = character.inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      const item = character.inventory[itemIndex];
      
      if (item.quantity <= quantity) {
        // Remove the item entirely
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          inventory: prevCharacter.inventory.filter(item => item.id !== itemId)
        }));
      } else {
        // Decrease the quantity
        const updatedInventory = [...character.inventory];
        updatedInventory[itemIndex] = {
          ...updatedInventory[itemIndex],
          quantity: updatedInventory[itemIndex].quantity - quantity
        };
        
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          inventory: updatedInventory
        }));
      }
    }
  };

  // Value to be provided by the context
  const contextValue = {
    character,
    updateCharacter,
    updateAbilityScore,
    updateHitPoints,
    addInventoryItem,
    removeInventoryItem
  };

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
};

// Custom hook for using this context
export const useCharacter = () => {
  const context = useContext(CharacterContext);
  
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterContextProvider');
  }
  
  return context;
};

export default CharacterContext;