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
import { loadReCaptcha } from 'react-recaptcha-google'
import EditContact from './components/Customer/EditContact';
import Forgot from './components/ForgotPassword/Forgot';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      userRole: 'public',
    }
  }

  componentDidMount(){
    loadReCaptcha();
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
          <img src={logo} alt="logo" width="90" height="90" className="App-logo"/>
          <h1>Welcome to my bank </h1>
        </header>
        <Navigation/>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/forgot" component={Forgot}/>
          <Route path="/customer/edit/:id" component={EditContact} />

          {/* <Route path="/customer/receiverList" component={EditContact} /> */}

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
  }
}

export default App;
