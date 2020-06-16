import React, { Component } from 'react';

export default class HistoryRow extends Component {
    constructor(props){
      super(props);
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
                    {this.props.obj.balance}
                </td>
            </tr>
        );
    }
}