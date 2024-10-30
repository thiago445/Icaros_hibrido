// src/pages/Profile.js 
import React, { useState, useEffect, useCallback } from 'react';
import { BsPersonCircle, BsShare, BsPencil, BsNewspaper, BsFillGeoAltFill, BsFillInfoCircleFill, BsChatFill } from 'react-icons/bs'; // Adicionando novos ícones
import './Profile.css';

const Profile = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const handleConnect = () => {
    setIsConnected(true);
    alert("Solicitação de conexão enviada!");
  };

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newPosts = Array.from({ length: 5 }, (_, index) => `Postagem ${index + 1 + (page - 1) * 5}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setLoading(false);

    if (newPosts.length === 0) {
      setHasMore(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="body-container">
      <div className="profile-page" onScroll={handleScroll}>
        <div className="profile-info">
          <div className="profile-background"></div>
          <div className="profile-details">
            <img
              className="profile-photo"
              src="https://via.placeholder.com/150"
              alt="User Profile"
            />
            <div className="profile-meta">
              <h1 className="profile-name">Nome do Usuário</h1>
              <p className="profile-title">Cargo | Empresa</p>
              <p className="profile-location">
                <BsFillGeoAltFill style={{ marginRight: '8px' }} />
                Localização
              </p>
              <div className="profile-actions">
                <button className="profile-button" onClick={handleConnect}>
                  {isConnected ? "Conectado" : "Conectar"}
                </button>
                <button className="profile-button share-button">
                  <BsShare size={16} />
                  Compartilhar
                </button>
                <button className="profile-button edit-button">
                  <BsPencil size={16} />
                  Editar Perfil
                </button>
                <button className="profile-button message-button">
                  <BsChatFill size={16} />
                  Mensagem
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-summary">
          <h2>
            <BsFillInfoCircleFill style={{ marginRight: '8px' }} />
            Sobre
          </h2>
          <p>
            Este é o resumo do perfil. Aqui você pode escrever sobre a experiência,
            habilidades e interesses do usuário, de forma breve e objetiva.
          </p>
        </div>

        <div className="profile-experience">
          <h2>Experiência</h2>
          <div className="experience-item">
            <h3>Cargo</h3>
            <p>Empresa - Período</p>
            <p>
              Descrição das atividades realizadas, projetos conduzidos e
              responsabilidades.
            </p>
          </div>
        </div>

        <div className="feed">
          <h2><BsNewspaper style={{ marginRight: '8px' }} />Postagens</h2>
          {posts.map((post, index) => (
            <div className="post" key={index}>
              <BsPersonCircle style={{ marginRight: '8px' }} />
              <p>{post}</p>
            </div>
          ))}
          {loading && <p>Carregando mais postagens...</p>}
          {!hasMore && <p>Você chegou ao fim das postagens.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
