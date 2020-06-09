import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Switch, Route} from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin';
import Employee from './components/Employee/Employee';
import Customer from './components/Customer/Customer';
import {ProtectedRoute} from './components/RouterURL/ProtectedRoute';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      userRole: 'public',
    }
  }

  checkLogin = (name) =>{
    if(name === 'admin'){
      this.setState({userRole: 'admin'});
    }

    if(name === 'customer'){
      this.setState({userRole: 'customer'});
    }

    if(name === 'employee'){
      this.setState({userRole: 'employee'});
    }
  }

  render() {
    return(
      <div className="App-container">
        <header className="App-header">
          <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
          <h1>Welcome to my bank </h1>
        </header>
        <Navigation/>
        <Switch>
          <Route exact path="/" component={Login}/>
          
          <ProtectedRoute 
            path="/customer"
            component={Customer}/>
          
          <ProtectedRoute 
            path="/employee"
            component={Employee}/>
          
          <ProtectedRoute 
            path="/admin"
            component={Admin}/>

          <Route path="*" component={()=>"404 NOT FOUND"}/>
        </Switch>
        <div className="footer-container">
          <Footer/>
        </div>
      </div>
    );
    /*switch(this.state.userRole){
      case 'public':{
        return  <div className="App-container">
                  <header className="App-header">
                    <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
                    <h1>Welcome to my bank </h1>
                  </header>
                  <Navigation/>
                  <div className="auth-wrapper">
                    <div className="auth-inner">
                      <Login submitLogin={this.checkLogin}/>
                    </div>
                  </div>
                  <div className="footer-container">
                  <Footer/>
                  </div>
                </div>
      }
      case 'admin':{
        return  <div className="App-container">
                  <header className="App-header">
                    <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
                    <h1>Welcome to my bank </h1>
                  </header>
                  <Navigation/>
                  <div className="auth-wrapper">
                      <Admin/>
                  </div>
                  <div className="footer-container">
                  <Footer/>
                  </div>
                </div>
      }
      case 'employee':{
        return  <div className="App-container">
                  <header className="App-header">
                    <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
                    <h1>Welcome to my bank </h1>
                  </header>
                  <div className="auth-wrapper" style={{marginTop: 0}}>
                      <Employee/>
                      <RouterEmployee/>
                  </div>
                  <div className="footer-container">
                  <Footer/>
                  </div>
                </div>
      }
      case 'customer':{
        return  <div className="App-container">
                  <header className="App-header">
                    <img src={logo} alt="logo" width="150" height="150" className="App-logo"/>
                    <h1>Welcome to my bank </h1>
                  </header>
                  <Navigation/>
                  <div className="auth-wrapper">
                    <Customer/>
                  </div>
                  <div className="footer-container">
                    <Footer/>
                  </div>
                </div>
      }
    }*/
  }
}

export default App;
