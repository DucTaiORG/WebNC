import React, { Component } from 'react';
import axios from 'axios';

export default class EditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            username: '',
            email: '',
            phoneNo: '',
            dateOfBirth: ''
        }
    }

    componentDidMount(){
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
                axios.get('http://localhost:8080/employee/' + this.props.match.params.id, config).then(response => {
                    console.log(response);
                    this.setState(response.data);
                    console.log(this.state);
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleInputChange = e =>{
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmitForm = e => {
        e.preventDefault();
        const submitForm = this.state;
        submitForm.id = this.props.match.params.id;
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
                        'x-access-token' : localStorage.getItem('accessToken')
                    }
                }

                axios.post('http://localhost:8080/employee/update', submitForm, config).then((response) =>{
                    console.log(response.data);
                    if(response.data.affectedRows){
                        alert('Edit success');
                        this.props.history.push('/admin/management/index');
                    }else{
                        alert('Can not edit');
                    }
                }).catch(function (error){
                    console.log(error.response);
                    alert(error.response.data)
                })
            }
        }).catch((error) => {
            console.log(error.response);
        })
        this.setState({
            fullname: '',
            username: '',
            email: '',
            phoneNo: '',
            dateOfBirth: ''
        });
    }

    render() {
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Edit Employee</h3>

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" value={this.state.username} className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Employee name</label>
                        <input type="text" name="fullname" value={this.state.fullname} className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Phone number</label>
                        <input type="text" name="phoneNo" value={this.state.phoneNo} className="form-control" placeholder="Enter phone number" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={this.state.email} className="form-control" placeholder="Enter email" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Date of birth</label>
                        <input type="date" name="dateOfBirth" value={this.state.dateOfBirth} className="form-control" onChange={this.handleInputChange}/>
                    </div>
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        )
    }
}