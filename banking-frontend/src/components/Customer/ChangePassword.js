import React, { Component } from "react";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {Alert} from 'react-bootstrap';

const getUserId = () =>{
    try {
        const {userId} = jwt_decode(localStorage.getItem('accessToken'));
        return userId;
    } catch (error) {
        console.log(error);
    }
};

const formValid = formErrors =>{
    let valid  = true;
    Object.values(formErrors).forEach(val=>val.length>0 && (valid=false));
    return valid;
};
export default class Forgot extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            oldPassword: '',
            password: '',
            repassword: '',
            formErrors:{
                password: '',
                repassword: ''
            },
            showModal: false,
            showAlert: false,
            alertMessage: '',
            alertVariant: ''
        }
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        const state = this.state;
        const self = this;
        if(formValid(this.state.formErrors)){
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            const postBody = {
                accessToken,
                refreshToken
            }

            axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
                if(response.data.accessToken){
                    localStorage.setItem('accessToken', response.data.accessToken);

                    const config = {
                        headers: {
                            'x-access-token': localStorage.getItem('accessToken')
                        }
                    };

                    const submitBody = {
                        userId: getUserId(),
                        oldPass: state.oldPassword,
                        newPass: state.password
                    }
                    
                    axios.post('http://localhost:8080/user/changePassword', submitBody, config).then(response => {
                        console.log(response);
                        if(response.data.success){
                            this.setState({showAlert: true, 
                                alertMessage: 'Change password success', 
                                alertVariant: 'success'});
                        }else{
                            this.setState({showAlert: true, 
                                alertMessage: response.data.message, 
                                alertVariant: 'danger'});
                        }
                    }).catch(error=>{
                        console.log(error.response);
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            }); 
        }else{
            this.setState({showAlert: true, 
                alertMessage: 'Invalid form', 
                alertVariant: 'danger'});
        }
        this.setState({oldPassword: '',
                        password: '',
                        repassword: '',});
    }

    closeAlert = () => {
        this.setState({showAlert: false});
    }

    handleInputChange = (e) => {
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;

        switch(name){
            case "password":
                if(value != undefined){
                    if(value.length < 6){
                        formErrors.password = "Minimum 6 characters require";
                    }else{
                        formErrors.password = "";
                    }
                }
                break;
            case "repassword":
                if(value != undefined){
                    if(value !== this.state.password){
                        formErrors.repassword = "Repassword not match";
                    }else{
                        formErrors.repassword = "";
                    }
                }
                break;
        }

        this.setState({ [e.target.name]: e.target.value })
    }

    handleCloseModal = ()=>{
        this.setState({showModal: false});
    }

    render() {
        const {formErrors} = this.state;
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                {this.state.showAlert == true ? <Alert variant={this.state.alertVariant} show={this.state.showAlert} onClose={this.closeAlert} dismissible>{this.state.alertMessage}</Alert> : null}
                    <form onSubmit={this.handleSubmit}>
                        <h3>Change password</h3>

                        <div className="form-group">
                            <label>Old password</label>
                            <input type="password" name="oldPassword" value={this.state.oldPassword} className="form-control" placeholder="Enter password" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" onChange={this.handleInputChange} />
                            {formErrors.password.length > 0 ? <span style={{color: 'red'}}>{formErrors.password}</span>:null}
                        </div>

                        <div className="form-group">
                            <label>Repassword</label>
                            <input type="password" name="repassword" value={this.state.repassword} className="form-control" placeholder="Re enter password" onChange={this.handleInputChange} />
                            {formErrors.repassword.length > 0 ? <span style={{color: 'red'}}>{formErrors.repassword}</span>:null}
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}