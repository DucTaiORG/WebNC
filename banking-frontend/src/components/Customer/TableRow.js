import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class TableRow extends Component {
  constructor(props){
    super(props);
  }
  delete = () => {
    this.props.handelDel(this.props.obj.id);
  }

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
            <Link to={'/admin/management/edit/' + this.props.obj.id} className="btn btn-primary">Edit</Link>
          </td>
          <td>
            <button className="btn btn-danger" onClick={this.delete}>Delete</button>
          </td>
        </tr>
    );
  }
}