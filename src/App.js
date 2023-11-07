import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Profile from './Pages/Profile';
import Main from './Pages/Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
