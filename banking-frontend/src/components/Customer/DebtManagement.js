import React, {Component} from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import CreateDebt from './CreateDebt';
import IndexDebt from './IndexDebt'
import {Button} from 'react-bootstrap';
import './Customer.css';
export default class DebtManagement extends Component{
    constructor(props){
        super(props);
    }

    handleCreate = (e) => {
        e.preventDefault();
        this.props.history.push('/customer/debt/create');
    }

    handleIndex = (e) => {
        e.preventDefault();
        this.props.history.push('/customer/debt/index');
    }

    render(){
        return(
            <div className="customer-content">
                <div className="management-button">
                    <Button className="custom-button" variant="danger" onClick={this.handleCreate}>Create</Button>
                    <Button className="custom-button" variant="danger" onClick={this.handleIndex}>Index</Button>
                </div>
                <Switch>
                    <Route exact path='/customer/debt/create' component={ CreateDebt } />
                    <Route path='/customer/debt/index' component={ IndexDebt } />
                </Switch>
            </div>
        );
    }
}