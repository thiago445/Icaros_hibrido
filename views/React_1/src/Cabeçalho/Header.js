import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsHouse, BsPeople, BsPersonCircle,} from 'react-icons/bs';
import './Header.css';
import Logo from './Icaros-branco.png'; // Importa a logo

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Logo" className="logo-image" />
          Icaros
      </div>
      <div className="search-container">
        <input type="text" placeholder="Pesquisar..." className="search-input" />
      </div>
      <div className="nav">
        <div className="nav-item">
          <BsHouse size={24} />
          <span>Início</span>
        </div>
        <div className="nav-item">
            <BsPeople size={24} />
            <span><Link to="/feed">Feed</Link></span>
        </div>
      </div>
      <div className="profile" onClick={toggleDropdown}>
        <BsPersonCircle size={24} />
        <span>Usuário</span>
        {dropdownOpen && (
          <div className="dropdown">
            <div className="dropdown-item"><Link to="/profile">Perfil</Link></div>
            <div className="dropdown-item">Sair</div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

