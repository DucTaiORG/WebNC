import React, { Component } from "react";
import axios from 'axios';
import CustomModal from './CustomModal';
import { Alert } from "react-bootstrap";


const formValid = formErrors =>{
    let valid  = true;
    Object.values(formErrors).forEach(val=>val.length>0 && (valid=false));
    return valid;
};
export default class Forgot extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: '',
            password: '',
            repassword: '',
            formErrors:{
                username: '',
                password: '',
                repassword: ''
            },
            showModal: false
        }
    }
    
    handleSubmit = (event) => {
        event.preventDefault();

        if(formValid(this.state.formErrors)){
            axios.get('http://localhost:8080/forgot/sendEmail/' + this.state.username).then(response => {
                console.log(response.data);
                if(response.data.success){
                    this.setState({showModal: true});
                }

                if(response.status == 204){
                    alert('User name not found');
                }
            }).catch(function (error) {
                console.log(error.response);
                alert('Error occur');
            }); 
        }else{
            alert('Invalid form');
        }
        
    }

    handleInputChange = (e) => {
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;

        switch(name){
            case "username":
                if(value != undefined){
                    if(value.length < 6){
                        formErrors.username = "Minimum 6 characters require";
                    }else{
                        formErrors.username = "";
                    }
                }
                break;
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

    handleSubmitModal = (otp)=>{
        console.log('otp: '+ otp);
        const submitVerify = {
            username: this.state.username,
            otpNum: otp
        };

        const submitReset = {
            username: this.state.username,
            password: this.state.password,
            repassword: this.state.repassword
        }

        axios.post('http://localhost:8080/forgot/verify', submitVerify).then((response)=>{
            console.log(response);
            if(response.data.success){
                axios.post('http://localhost:8080/forgot/resetPassword', submitReset).then(response => {
                    if(response.data.success){
                        alert('Reset password success');
                    }
                }).catch(error => {
                    console.log(error.response);
                    alert('Reset fail!');
                });
            }else{
                alert('OTP not match!');
            }
        }).catch((error)=>{
            console.log(error.response);
            alert('Error occur!');
        });
        
        this.setState({
            username: "",
            password: "",
            repassword: '',
            showModal: false
        });
    }

    handleCloseModal = ()=>{
        this.setState({showModal: false});
    }

    render() {
        const {formErrors} = this.state;
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmit}>
                        <h3>Forgot password</h3>

                        <div className="form-group">
                            <label>User name</label>
                            <input type="text" name="username" value={this.state.username} className="form-control" placeholder="Enter user name" onChange={this.handleInputChange} />
                            {formErrors.username.length > 0 ? <span style={{color: 'red'}}>{formErrors.username}</span>:null}
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
                <CustomModal show={this.state.showModal} closemodal={this.handleCloseModal} submitmodal={this.handleSubmitModal}/>
            </div>
        );
    }
}