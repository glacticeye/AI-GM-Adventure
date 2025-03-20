import React, { useState } from 'react';
import useMemory from '../../hooks/useMemory';
import './MemoryPanel.css';

const MemoryPanel = () => {
  const { memories, deleteMemory, updateMemory } = useMemory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter memories based on search term and type filter
  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || memory.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Format timestamp to a readable date/time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get appropriate icon for memory type
  const getMemoryIcon = (type) => {
    switch (type) {
      case 'location':
        return '🗺️';
      case 'npc':
        return '👤';
      case 'item':
        return '🔮';
      case 'quest':
        return '📜';
      case 'conversation':
        return '💬';
      default:
        return '📝';
    }
  };

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <h2>Adventure Memory</h2>
        <p>Your adventure journal maintains important information for continuity.</p>
      </div>
      
      <div className="memory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="memory-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="location">Locations</option>
            <option value="npc">NPCs</option>
            <option value="item">Items</option>
            <option value="quest">Quests</option>
            <option value="conversation">Conversations</option>
          </select>
        </div>
      </div>
      
      <div className="memories-list">
        {filteredMemories.length > 0 ? (
          filteredMemories.map(memory => (
            <div 
              key={memory.id} 
              className={`memory-item importance-${memory.importance}`}
            >
              <div className="memory-icon">
                {getMemoryIcon(memory.type)}
              </div>
              <div className="memory-content">
                <div className="memory-text">{memory.content}</div>
                <div className="memory-meta">
                  <span className="memory-type">{memory.type}</span>
                  <span className="memory-time">{formatTimestamp(memory.timestamp)}</span>
                </div>
              </div>
              <div className="memory-actions">
                <button 
                  className="edit-memory"
                  title="Edit memory"
                  onClick={() => {
                    const newContent = prompt('Edit memory:', memory.content);
                    if (newContent && newContent !== memory.content) {
                      updateMemory(memory.id, { content: newContent });
                    }
                  }}
                >
                  ✏️
                </button>
                <button 
                  className="delete-memory"
                  title="Delete memory"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this memory?')) {
                      deleteMemory(memory.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-memories">
            <p>No memories match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPanel;