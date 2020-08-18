import React, { Component } from 'react';

export default class Receiver extends Component {
    constructor(props){
      super(props);
    }

    render() {
        if(this.props.obj == null || this.props.obj == undefined){
            return <tr>
                <td colSpan='4' style={{textAlign: 'center'}}>
                No information
                </td>
                </tr>
        }else if(this.props.obj.fullname == undefined){
            return <tr>
                <td colSpan='4' style={{textAlign: 'center'}}>
                No information
                </td>
                </tr>
        }else if(this.props.obj.fullname.length == 0){
            return <tr>
                <td colSpan='4' style={{textAlign: 'center'}}>
                No information
                </td>
                </tr>
        }
        return (
            <tr>
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