import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page2" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
