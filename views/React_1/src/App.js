import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Cabeçalho/Header';
import Feed from './Feed';
import Profile from './Profile';
import ProfileDinamico from './ProfileDinamico';

function App() {
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/"></Route>
          <Route path="/feed" element={<Feed/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/profiledinamico" element={<ProfileDinamico/>}></Route>
          <Route path="/ThiagoMagalhaes"></Route>
          <Route path="/LieberteFerreira"></Route>
          <Route path="/GustavoPorto"></Route>
          <Route path="/FelipeDionizio"></Route>
          <Route path="/CristianoSilveira"></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
