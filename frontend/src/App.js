import React from 'react';
import "./App.css";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/Home';



const App = () => {

  return (
      <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
      </div>
  )
}

export default App