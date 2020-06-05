import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer'

function App() {
  return (
      <div className="App-container">
        <header className="App-header">
          <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
          <h1>Welcome to my bank </h1>
        </header>
        <Navigation/>
        <div className="auth-wrapper">
          <div className="auth-inner">
          <Login/>
          </div>
        </div>
        <div className="footer-container">
          <Footer/>
        </div>
      </div>
  );
}

export default App;
