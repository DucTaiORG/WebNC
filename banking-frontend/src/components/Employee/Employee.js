import React, {Component} from 'react';
import './Employee.css'
import { Link, Route } from 'react-router-dom';
import CreateCustomerAccount from '../Employee/CreateCustomerAccount';
import DepositMoney from '../Employee/DepositMoney';
import ViewHistory from '../Employee/ViewHistory';

export default class Employee extends Component{
    render(){
        return(
            <div className="auth-wrapper">
                <div className="sidenav">
                    <Link to='/employee/create-account'>Create customer account</Link>
                    <hr/>
                    <Link to="/employee/deposit">Deposit money</Link>
                    <hr/>
                    <Link to="/employee/view-history">View transaction history</Link>
                </div>
                <div className="main-content">
                    <Route path='/employee/create-account' component={CreateCustomerAccount}/>
                    <Route path="/employee/deposit" component={DepositMoney}/>
                    <Route path="/employee/view-history" component={ViewHistory}/>
                </div>
            </div>
        );
    }
}