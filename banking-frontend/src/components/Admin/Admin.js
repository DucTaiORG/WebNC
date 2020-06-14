import React, {Component} from 'react';
import HistoryAdmin from './HistoryAdmin';
import EmployeeManagement from './EmployeeManagement'
import { Route, Link } from 'react-router-dom';
import './Admin.css'

export default class Admin extends Component{
    render(){
        return(
            <div className="auth-wrapper">
                <div className="sidenav">
                    <Link to='/admin/management/index'>Employee Management</Link>
                    <hr/>
                    <Link to="/admin/history">View transaction history</Link>
                </div>
                
                <Route path='/admin/management' component={EmployeeManagement}/>
                <Route path='/admin/history' component={HistoryAdmin}/>
                
            </div>
        );
    }
}