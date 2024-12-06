import React, { useState } from 'react';
import '../CSS/Footer.css'; // Assurez-vous d'avoir un fichier CSS pour le footer

function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const links = [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Contact', url: '/contact' },
  ];

  const socialLinks = [
    { url: 'https://facebook.com', icon: 'fab fa-facebook-f' },
    { url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { url: 'https://linkedin.com', icon: 'fab fa-linkedin-in' },
    { url: 'https://instagram.com', icon: 'fab fa-instagram' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <button className="footer__burger" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <nav className={`footer__nav ${isMenuOpen ? 'footer__nav--open' : ''}`}>
          <ul className="footer__menu">
            {links.map((link, index) => (
              <li key={index} className="footer__menu-item">
                <a href={link.url} className="footer__menu-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__social">
          {socialLinks.map((social, index) => (
            <a key={index} href={social.url} className="footer__social-link" target="_blank" rel="noopener noreferrer">
              <i className={`footer__social-icon ${social.icon}`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
