import React, {Component} from 'react';
import './Employee.css';

export default class CreateCustomerAccount extends Component{
    render(){
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmit}>
                    <h3>Register Customer</h3>

                    <div className="form-group">
                        <label>Account name</label>
                        <input type="text" className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Re-password</label>
                        <input type="password" className="form-control" placeholder="Re-enter password" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Customer name</label>
                        <input type="text" className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Phone number</label>
                        <input type="text" className="form-control" placeholder="Enter customer phone number" onChange={this.handleInputChange}/>
                    </div>

                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        );
    }
} 