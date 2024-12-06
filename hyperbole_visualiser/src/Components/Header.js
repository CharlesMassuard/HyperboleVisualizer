import React, { useState } from 'react';
import '../CSS/Header.css';

function Header({ title = "Hyperbole Visualiser", links = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">{title}</h1>

        <ul className="header__burger" onClick={toggleMenu}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </ul>
      </div>

      <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
        <ul className="header__menu">
          {links.map((link, index) => (
            <li key={index} className="header__menu-item">
              <a href={link.url} className="header__menu-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;