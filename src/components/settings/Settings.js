// src/components/settings/Settings.js
import React, { useState } from 'react';
import useLLM from '../../hooks/useLLM';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const { apiKey, model, updateApiKey, updateModel, isConnected } = useLLM();
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [newModel, setNewModel] = useState(model);

  const handleSave = () => {
    updateApiKey(newApiKey);
    updateModel(newModel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2>LLM Settings</h2>
        
        <div className="settings-group">
          <label htmlFor="api-key">API Key</label>
          <input 
            id="api-key"
            type="password"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            placeholder="Enter your Anthropic API key"
          />
          <p className="settings-help">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        
        <div className="settings-group">
          <label htmlFor="model">Model</label>
          <select 
            id="model"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          >
            <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Latest)</option>
            <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
            <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
            <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
          </select>
          <p className="settings-help">
            Newer models may provide better responses but could cost more tokens.
          </p>
        </div>
        
        <div className="connection-status">
          Status: <span className={isConnected ? "connected" : "disconnected"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        
        <div className="settings-buttons">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;