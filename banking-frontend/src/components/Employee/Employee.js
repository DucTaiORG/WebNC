import React, {Component} from 'react';
import './Employee.css'

export default class Employee extends Component{
    render(){
        return(
            <div class="sidenav">
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#">Contact</a>
            </div>
        );
    }
}