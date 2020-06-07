import React, { Component } from "react";

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            userName: '',
        }
    }

    handleSubmit = event => {
        this.props.submitLogin(this.state.userName);
    }

    handleInputChange = (e) =>{
        this.setState({
            userName: e.target.value
        })
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>User name</label>
                    <input type="text" className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}