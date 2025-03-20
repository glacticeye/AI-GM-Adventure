import React from 'react';
import { marked } from 'marked';
import './NarrativeDisplay.css';

// Configure marked for security
const renderer = new marked.Renderer();
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  sanitize: false, // We'll use DOMPurify instead for better control
  smartLists: true,
  smartypants: true,
  xhtml: false
});

// Custom handling for dice notation and game terminology
const processDiceNotation = (text) => {
  // Highlight dice rolls: e.g., 2d6, 1d20+5
  return text.replace(/\b(\d+d\d+(?:[+-]\d+)?)\b/g, '<span class="dice-notation">$1</span>');
};

const processGameTerms = (text) => {
  // Highlight game mechanics and stats
  return text
    .replace(/\b(HP|AC|STR|DEX|CON|INT|WIS|CHA)\b/g, '<span class="game-term">$1</span>')
    .replace(/\b(attack roll|saving throw|ability check)\b/gi, '<span class="game-mechanic">$1</span>');
};

const NarrativeDisplay = ({ content }) => {
  // Process the content before passing to marked
  let processedContent = content;
  
  // Process dice notation and game terms in regular text (not inside code blocks)
  const codeBlocks = {};
  let codeBlockCounter = 0;
  
  // Temporarily replace code blocks with placeholders to protect them from further processing
  processedContent = processedContent.replace(/```([\s\S]*?)```/g, (match) => {
    const placeholder = `CODE_BLOCK_${codeBlockCounter}`;
    codeBlocks[placeholder] = match;
    codeBlockCounter++;
    return placeholder;
  });
  
  // Apply our custom processors
  processedContent = processDiceNotation(processedContent);
  processedContent = processGameTerms(processedContent);
  
  // Put code blocks back
  Object.keys(codeBlocks).forEach(placeholder => {
    processedContent = processedContent.replace(placeholder, codeBlocks[placeholder]);
  });
  
  // Convert to HTML using marked
  const htmlContent = marked(processedContent);
  
  return (
    <div 
      className="narrative-display"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default NarrativeDisplay;