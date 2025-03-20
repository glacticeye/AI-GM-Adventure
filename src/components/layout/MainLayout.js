import React, { useState } from 'react';
import './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Header onMenuToggle={toggleSidebar} />
      
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
    </div>
  );
};

export default MainLayout;