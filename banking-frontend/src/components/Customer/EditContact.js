import React, { Component } from 'react';
import axios from 'axios';

export default class EditContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountNumber: '',
            rememberName: ''
        }
    }

    componentDidMount(){
        console.log(this.state);
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
                axios.get('http://localhost:8080/contact/detail/' + this.props.match.params.id, config).then(response => {
                    console.log(response.data);
                    this.setState(response.data[0]);
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

        console.log(this.props.match.params.id);

        axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
            if(response.data.accessToken){
                localStorage.setItem('accessToken', response.data.accessToken);
                const config = {
                    headers: {
                        'x-access-token' : localStorage.getItem('accessToken')
                    }
                }

                axios.post(`http://localhost:8080/contact/update/${this.props.match.params.id}`, submitForm, config).then((response) =>{
                    console.log(response.data);
                    if(response.data.affectedRows){
                        alert('Edit success');
                        this.props.history.push('/customer/receiverList');
                        console.log(this.props.history);
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
            accountNumber: '',
            rememberName: ''
        });
    }

    render() {
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Edit Contact</h3>

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="accountNumber" value={this.state.accountNumber} className="form-control" placeholder="Enter user name" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label>Account Number</label>
                        <input type="text" name="rememberName" value={this.state.rememberName} className="form-control" placeholder="Enter customer name" onChange={this.handleInputChange}/>
                    </div>
                    
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        )
    }
}