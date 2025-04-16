import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {currentYear} Route Tracker App. All rights reserved.</p>
          <div className="footer-links">
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/contact" className="footer-link">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;