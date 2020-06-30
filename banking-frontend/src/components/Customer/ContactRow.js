import React, { Component } from 'react';
import {Link} from 'react-router-dom';

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
                    <Link to={'/contact/management/edit/' + this.props.obj.receiveUserID} className="btn btn-primary">Edit</Link>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={this.delete}>Delete</button>
                </td>
            </tr>

        );
    }
}