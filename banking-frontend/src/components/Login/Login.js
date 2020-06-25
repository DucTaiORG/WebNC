import React, { Component } from "react";
import Auth from '../../auth';
import './Login.css';
import { ReCaptcha } from 'react-recaptcha-google'

export default class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: '',
            password: '',
            disableSubmit: true
        }
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
    }

    componentDidMount() {
        if (this.captchaDemo) {
            console.log("started, just a second...")
            this.captchaDemo.reset();
        }
    }
    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }
    verifyCallback(recaptchaToken) {
        if (recaptchaToken) {
            this.setState({ disableSubmit: false });
        } else {
            this.setState({ disableSubmit: true });
        }
        console.log(recaptchaToken, "<= your recaptcha token")
    }

    handleSubmitLogin = (event) => {
        event.preventDefault();
        Auth.login(this.state,
            () => {
                console.log(`isLogin: ${Auth.isAuthenticated()}`);
                this.props.history.push(`/${Auth.getUserRole()}`)
            });
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmitLogin}>
                        <h3>Sign In</h3>

                        <div className="form-group">
                            <label>User name</label>
                            <input type="text" name="username" className="form-control" placeholder="Enter user name" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <button disabled={this.state.disableSubmit} type="submit" className="btn btn-primary btn-block">Submit</button>
                        <p className="forgot-password text-right">
                            Forgot <a href="#">password?</a>
                        </p>

                        <br />

                        <ReCaptcha
                            ref={(el) => { this.captchaDemo = el; }}
                            size="normal"
                            data-theme="dark"
                            render="explicit"
                            sitekey="6LcMCKgZAAAAAOcDeGi0CZQkzteLpqC_2ICzn26n"
                            onloadCallback={this.onLoadRecaptcha}
                            verifyCallback={this.verifyCallback}
                        />
                    </form>
                </div>
            </div>
        );
    }
}