import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react';
import Registration from './Pages/Registration';
import Login from './Pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
