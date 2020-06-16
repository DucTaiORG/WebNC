import React, {Component} from 'react';
import axios from 'axios'
import './Employee.css';

const formValid = formErrors =>{
    let valid  = true;
    Object.values(formErrors).forEach(val=>val.length>0 && (valid=false));
    return valid;
}

export default class CreateCustomerAccount extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            fullname: "",
            phoneNo: "",
            formErrors:{
                username: "",
                password: "",
                repassword: "",
                fullname: "",
                phoneNo: "",
            }
        };
    }

    
    handleSubmitForm = e =>{
        e.preventDefault();
        const state = this.state;
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
                    const submitForm = state;
                    submitForm.userRole = 1;
                    delete submitForm.formErrors;
                    delete submitForm.repassword;

                    const config = {
                        headers: {
                            'x-access-token' : localStorage.getItem('accessToken')
                        }
                    }
                    axios.post('http://localhost:8080/user/register', submitForm, config).then(function (response) {
                        console.log(response.data);
                        alert('Register success');
                    }).catch(function (error){
                        console.log(error);
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
            this.setState({
                username: "",
                password: "",
                repassword: "",
                email: "",
                fullname: "",
                phoneNo: "",
                formErrors:{
                    username: "",
                    password: "",
                    repassword: "",
                    email: "",
                    fullname: "",
                    phoneNo: "",
                }
            });
        }else{
            alert('Invalid Information');
        }
    }

    handleInputChange = e =>{
        e.preventDefault();
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

        this.setState({formErrors, [name]: value});
    }

    render(){
        const {formErrors} = this.state;
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Register Customer</h3>

                    <div className="form-group">
                        <label>Account name</label>
                        <input type="text" name="username" value={this.state.username} className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                        {formErrors.username.length > 0 ? <span style={{color: 'red'}}>{formErrors.username}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" onChange={this.handleInputChange}/>
                        {formErrors.password.length > 0 ? <span style={{color: 'red'}}>{formErrors.password}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Re-password</label>
                        <input type="password" name="repassword" value={this.state.repassword} className="form-control" placeholder="Re-enter password" onChange={this.handleInputChange}/>
                        {formErrors.repassword.length > 0 ? <span style={{color: 'red'}}>{formErrors.repassword}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Customer name</label>
                        <input type="text" name="email" value={this.state.email} className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Customer name</label>
                        <input type="text" name="fullname" value={this.state.fullname} className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Phone number</label>
                        <input type="text" name="phoneNo" value={this.state.phoneNo} className="form-control" placeholder="Enter customer phone number" onChange={this.handleInputChange}/>
                    </div>
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        );
    }
} 