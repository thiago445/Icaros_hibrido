import React from 'react';
import { BsHouse, BsPeople, BsFillBriefcaseFill, BsBell, BsPersonCircle } from 'react-icons/bs';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">Logo</div>
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
          <span>Rede</span>
        </div>
        <div className="nav-item">
          <BsFillBriefcaseFill size={24} />
          <span>Empregos</span>
        </div>
        <div className="nav-item">
          <BsBell size={24} />
          <span>Notificações</span>
        </div>
      </div>
      <div className="profile">
        <BsPersonCircle size={24} />
        <span>Usuário</span> {/* Substitua "Usuário" pelo nome desejado */}
      </div>
    </header>
  );
}

export default Header;
