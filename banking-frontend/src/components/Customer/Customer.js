import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import AccountList from './AccountList';
import ReceiverList from './ReceiverList';
import TransferMoney from './TransferMoney';
import CustomerHistory from './CustomerHistory';
import DebtManagement from './DebtManagement';
import ChangePassword from './ChangePassword';
import TransferMoneyExt from './TransferMoneyExt';

export default class Customer extends Component{
    render(){
        return(
            <div className="auth-wrapper">
                <div className="sidenav">
                    <Link to='/customer/account'>Account list</Link>
                    <hr/>
                    <Link to="/customer/receiverList">Receiver List</Link>
                    <hr/>
                    <Link to="/customer/transfer">Transfer Money</Link>
                    <hr/>
                    <Link to="/customer/transferext">Transfer Money External</Link>
                    <hr/>
                    <Link to="/customer/history">Transaction History</Link>
                    <hr/>
                    <Link to="/customer/debt/index">Debt Management</Link>
                    <hr/>
                    <Link to="/customer/changePassword">Change password</Link>
                </div>
                
                <Route path='/customer/account' component={AccountList}/>
                <Route path='/customer/receiverList' component={ReceiverList}/>
                <Route path='/customer/transfer' component={TransferMoney}/>
                <Route path='/customer/transferext' component={TransferMoneyExt}/>
                <Route path='/customer/history' component={CustomerHistory}/>
                <Route path='/customer/debt' component={DebtManagement}/>
                <Route path='/customer/changePassword' component={ChangePassword}/>
            </div>
        );
    }
}