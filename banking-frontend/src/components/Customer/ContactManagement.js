import React, {Component} from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import EditContact from './EditContact';
import EditEmployee from '../Admin/EditEmployee';
import IndexEmployee from './IndexEmployee'
import {Button} from 'react-bootstrap';
import './Admin.css';
export default class ContactManagement extends Component{
    constructor(props){
        super(props);
    }

    handleCreate = (e) => {
        e.preventDefault();
        this.props.history.push('/admin/management/create');
    }

    handleIndex = (e) => {
        e.preventDefault();
        this.props.history.push('/admin/management/index');
    }

    render(){
        return(
            <div className="admin-content">
                <div className="management-button">
                    <Button className="custom-button" variant="danger" onClick={this.handleCreate}>Create</Button>
                    <Button className="custom-button" variant="danger" onClick={this.handleIndex}>Index</Button>
                </div>
                <Switch>
                    <Route path='/contact/management/edit/:id' component={ EditContact } />
                    <Route path='/admin/management/index' component={ IndexEmployee } />
                </Switch>
            </div>
        );
    }
}