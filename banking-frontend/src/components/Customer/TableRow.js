import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class TableRow extends Component {
  constructor(props){
    super(props);
  }
  delete = () => {
    this.props.handleDel(this.props.obj.id);
  }

  pay = () => {
    console.log(this.props.obj.id);
    this.props.handlePay(this.props.obj.id);
  }

  render() {
    return (
        <tr>
          <td>
            {this.props.obj.lender}
          </td>
          <td>
            {this.props.obj.debtor}
          </td>
          <td>
            {this.props.obj.money_amount}
          </td>
          <td>
            {this.props.obj.content}
          </td>
          <td>
            {this.props.obj.time}
          </td>
          <td>
            {this.props.obj.status == 0 ? 'Not paid yet' : 'Paid'}
          </td>
          <td>
            {this.props.obj.status == 0 ? <button className="btn btn-primary" onClick={this.pay}>Pay debt</button> : null}
          </td>
          <td>
            <button className="btn btn-danger" onClick={this.delete}>Delete</button>
          </td>
        </tr>
    );
  }
}