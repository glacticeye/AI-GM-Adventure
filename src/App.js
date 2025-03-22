// src/App.js
import React, { useState } from 'react';
import './App.css';
import MainLayout from './components/layout/MainLayout';
import GameMasterPanel from './components/gameMaster/GameMasterPanel';
import CharacterSheet from './components/character/CharacterSheet';
import MemoryPanel from './components/memory/MemoryPanel';
import Settings from './components/settings/Settings';
import { GameContextProvider } from './contexts/GameContext';
import { CharacterContextProvider } from './contexts/CharacterContext';
import { LLMContextProvider } from './contexts/LLMContext';

function App() {
  const [activeTab, setActiveTab] = useState('game-master');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'game-master':
        return <GameMasterPanel />;
      case 'character':
        return <CharacterSheet />;
      case 'memory':
        return <MemoryPanel />;
      default:
        return <GameMasterPanel />;
    }
  };
  
  return (
    <div className="app">
      <LLMContextProvider>
        <GameContextProvider>
          <CharacterContextProvider>
            <MainLayout
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSettingsClick={() => setIsSettingsOpen(true)}
            >
              {renderContent()}
            </MainLayout>
            <Settings 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          </CharacterContextProvider>
        </GameContextProvider>
      </LLMContextProvider>
    </div>
  );
}

export default App;