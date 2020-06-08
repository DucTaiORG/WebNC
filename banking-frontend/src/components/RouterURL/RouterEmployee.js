import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import CreateCustomerAccount from '../Employee/CreateCustomerAccount';
import DepositMoney from '../Employee/DepositMoney';
import ViewHistory from '../Employee/ViewHistory';
import './RouterEmployee.css'

export default class RouterEmployee extends Component{
    render(){
        return(
            <div className="main-content">
                <Route exact path="/employee/create-account" component={CreateCustomerAccount}/>
                <Route exact path="/employee/deposit" component={DepositMoney}/>
                <Route exact path="/employee/view-history" component={ViewHistory}/>
            </div>
        );
    }
}