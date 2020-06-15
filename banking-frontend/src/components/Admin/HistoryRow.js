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
                    {this.props.obj.name}
                </td>
                <td>
                    {this.props.obj.money_amount}
                </td>
                <td>
                    {this.props.obj.transfer_time}
                </td>
            </tr>
        );
    }
}