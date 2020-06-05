import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';

export default class Navigation extends Component{
    render(){
        return(
            <Navbar bg="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/">HOME</NavLink>
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/">ADMIN</NavLink>
                        <NavLink className="d-inline p-2 bg-dark text-white" to="/">CONTACT</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

