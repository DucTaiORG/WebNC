import React, { Component } from 'react';

export default class AccountRow extends Component {
    constructor(props){
      super(props);
    }

    render() {
        return (
            <tr>
                <td>
                    {this.props.obj.accountNumber}
                </td>
                <td>
                    {this.props.obj.balance}
                </td>
            </tr>
        );
    }
}