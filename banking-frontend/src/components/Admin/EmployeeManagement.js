import React, {Component} from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';
import IndexEmployee from './IndexEmployee'
import {Button} from 'react-bootstrap';
import './Admin.css';
export default class EmployeeManagement extends Component{
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
                    <Route exact path='/admin/management/create' component={ CreateEmployee } />
                    <Route path='/admin/management/edit/:id' component={ EditEmployee } />
                    <Route path='/admin/management/index' component={ IndexEmployee } />
                </Switch>
            </div>
        );
    }
}