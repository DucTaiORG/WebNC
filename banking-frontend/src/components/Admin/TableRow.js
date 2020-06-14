import React, { Component } from 'react';

export default class TableRow extends Component {
  render() {
    return (
        <tr>
          <td>
            {this.props.obj.fullname}
          </td>
          <td>
            {this.props.obj.username}
          </td>
          <td>
            {this.props.obj.email}
          </td>
          <td>
            {this.props.obj.phoneNo}
          </td>
          <td>
            {this.props.obj.dateOfBirth}
          </td>
          <td>
            <button className="btn btn-primary">Edit</button>
          </td>
          <td>
            <button className="btn btn-danger">Delete</button>
          </td>
        </tr>
    );
  }
}