import React, { Component } from 'react';

export default class Receiver extends Component {
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
                    {this.props.obj.fullname}
                </td>
                <td>
                    {this.props.obj.phoneNo}
                </td>
                <td>
                    {this.props.obj.dateOfBirth}
                </td>
            </tr>
        );
    }
}