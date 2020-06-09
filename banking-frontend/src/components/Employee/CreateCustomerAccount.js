import React, {Component} from 'react';
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
            username: null,
            password: null,
            customerName: null,
            phoneNo: null,
            formErrors:{
                username: "",
                password: "",
                repassword: "",
                customerName: "",
                phoneNo: "",
            }
        };
    }

    
    handleSubmitForm = e =>{
        e.preventDefault();

        if(formValid(this.state.formErrors)){
            console.log(`
            --Submitting
            Username: ${this.state.username}
            Password: ${this.state.password}
            Customer Name: ${this.state.customerName}
            Phone No: ${this.state.phoneNo}
            `);
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
                }else{
                    console.log(typeof value);
                }
                
                break;
            case "password":
                if(value != undefined){
                    if(value.length < 6){
                        formErrors.password = "Minimum 6 characters require";
                    }else{
                        formErrors.password = "";
                    }
                }else{
                    console.log(typeof value);
                }
                break;
            case "repassword":
                console.log(value);
                console.log(this.state.password);
                if(value != undefined){
                    if(value !== this.state.password){
                        formErrors.repassword = "Repassword not match";
                    }else{
                        formErrors.repassword = "";
                    }
                }else{
                    console.log(typeof value);
                }
                
                break;
        }

        this.setState({formErrors, [name]: value}, () => console.log(this.state));
    }

    render(){
        const {formErrors} = this.state;
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Register Customer</h3>

                    <div className="form-group">
                        <label>Account name</label>
                        <input type="text" name="username" className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                        {formErrors.username.length > 0 ? <span style={{color: 'red'}}>{formErrors.username}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Enter password" onChange={this.handleInputChange}/>
                        {formErrors.password.length > 0 ? <span style={{color: 'red'}}>{formErrors.password}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Re-password</label>
                        <input type="password" name="repassword" className="form-control" placeholder="Re-enter password" onChange={this.handleInputChange}/>
                        {formErrors.repassword.length > 0 ? <span style={{color: 'red'}}>{formErrors.repassword}</span>:null}
                    </div>

                    <div className="form-group">
                        <label>Customer name</label>
                        <input type="text" name="customerName" className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Phone number</label>
                        <input type="text" name="phoneNo" className="form-control" placeholder="Enter customer phone number" onChange={this.handleInputChange}/>
                    </div>
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        );
    }
} 