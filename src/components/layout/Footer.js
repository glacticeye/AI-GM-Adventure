import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p className="footer-text">
        D&D LLM Game Master &copy; {new Date().getFullYear()}
      </p>
      <div className="footer-links">
        <a href="#" className="footer-link">Privacy</a>
        <a href="#" className="footer-link">Terms</a>
        <a href="#" className="footer-link">Help</a>
      </div>
    </footer>
  );
};

export default Footer;