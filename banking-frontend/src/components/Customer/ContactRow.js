import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import EditContact from './EditContact';

export default class ContactRow extends Component {
    constructor(props) {
        super(props);
    }

    delete = () => {
        this.props.handleDel(this.props.obj.receiveUserID);
    }


    render() {
        return (
            
                <tr>
                    <td>
                        {this.props.position}
                    </td>
                    <td>
                        {this.props.obj.accountNumber}
                    </td>
                    <td>
                        {this.props.obj.rememberName}
                    </td>
                    <td>
                        <Link to={'/customer/edit/' + this.props.obj.receiveUserID} className="btn btn-primary">Edit</Link>
                    </td>
                    <Route exact path='/customer/edit/:id' component={EditContact} />
                    <td>
                        <button className="btn btn-danger" onClick={this.delete}>Delete</button>
                    </td>
                    
                </tr>
                
        );
    }
}
