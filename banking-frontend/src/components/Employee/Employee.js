import React, {Component} from 'react';
import './Employee.css'
import { Link } from 'react-router-dom';

export default class Employee extends Component{
    render(){
        return(
            <div class="sidenav">
                <Link to="/employee/create-account">Create customer account</Link>
                <hr/>
                <Link to="/employee/deposit">Deposit money into account</Link>
                <hr/>
                <Link to="/employee/view-history">View transaction history</Link>
            </div>
        );
    }
}