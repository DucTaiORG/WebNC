import React, { Component } from 'react';

export default class ContactRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }
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
                    <div className="col-sm-6">
                        {this.props.obj.rememberName}
                    </div>
                    <div className="col-sm-6">
                        <button>abc</button>
                    </div>

                </td>
            </tr>

        );
    }
}