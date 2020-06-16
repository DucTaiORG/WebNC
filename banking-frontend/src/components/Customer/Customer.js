import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import AccountList from './AccountList';
import ReceiverList from './ReceiverList';

export default class Customer extends Component{
    render(){
        return(
            <div className="auth-wrapper">
                <div className="sidenav">
                    <Link to='/customer/account'>Account list</Link>
                    <hr/>
                    <Link to="/customer/receiverList">Receiver List</Link>
                </div>
                
                <Route path='/customer/account' component={AccountList}/>
                <Route path='/customer/receiverList' component={ReceiverList}/>
            </div>
        );
    }
}