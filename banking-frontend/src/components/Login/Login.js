import React, { Component } from "react";
import Auth from '../../auth';
import './Login.css';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    handleSubmitLogin = (event) => { 
        event.preventDefault();
        Auth.login(this.state, 
            ()=>{
                console.log(`isLogin: ${Auth.isAuthenticated()}`);
                this.props.history.push(`/${Auth.getUserRole()}`)
            });
    }

    handleInputChange = (e) =>{        
        this.setState({[e.target.name]: e.target.value})
    }
    
    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmitLogin}>
                        <h3>Sign In</h3>

                        <div className="form-group">
                            <label>User name</label>
                            <input type="text" name="username" className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange}/>
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
                </div>
            </div>
        );
    }
}