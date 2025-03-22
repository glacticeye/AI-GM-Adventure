// src/components/layout/MainLayout.js
import React, { useState } from 'react';
import './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Settings from '../settings/Settings'; // Add this import

const MainLayout = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Add this state
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Header 
        onMenuToggle={toggleSidebar} 
        onSettingsClick={() => setIsSettingsOpen(true)} // Add this prop
      />
      
      <div className="main-content">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        
        <div className="content-area">
          {children}
        </div>
      </div>
      
      <Footer />
      
      {/* Add the Settings component */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;