import React, {Component} from 'react';
import axios from 'axios';
import AccountRow from './AccountRow';
import {Table, Dropdown, DropdownButton} from 'react-bootstrap';
import Receiver from './Receiver';
import './Customer.css'

export default class DepositMoney extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountNumber: '',
            moneyAmount: '',
            accountList:[
                {
                    accountNumber: 123456789,
                    balance: 10000
                }
            ],
            receiverList:[
                {
                    accountNumber: 113333333,
                    fullname: 'Bành Thị A'
                },
                {
                    accountNumber: 112222222,
                    fullname: 'Bành Thị B'
                }
            ],
            receiver:[
                {
                    accountNumber: 114444444,
                    fullname: 'Nguyễn Văn A',
                    phoneNo: '0123456789',
                    dateOfBirth: '2020-10-10'
                }
            ],

            selectedName: 'From list'
        }
    }

    handleInputChange = e =>{
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmitForm = e => {
        e.preventDefault();
        const state = this.state;
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
                const config = {
                    headers: {
                        'x-access-token' : localStorage.getItem('accessToken')
                    }
                }

                axios.post('http://localhost:8080/deposit', submitForm, config).then((response)=>{
                    console.log(response);
                    if(response.data.success){
                        alert('Deposit successful');
                    }
                }).catch((error)=>{
                    console.log(error.response);
                    alert(`Deposit fail: ${error.response.data.error}`);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
        
        this.setState({
            accountNumber: "",
            moneyAmount: ""
        });
    }

    handleItemSelect = (eventKey, event)=>{
        this.setState({accountNumber: eventKey});
        this.setState({selectedName: event.target.textContent});
    }

    render(){
        return (
            <div className="customer-content">
                <h1>Transfer Money</h1>
                <div className="customer-inner">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Your account number</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.accountList.map((object,index) => (
                                    <AccountRow position={index + 1} obj={object} key={index}/>
                                ))
                            }
                        </tbody>
                    </Table>
                    <Table striped bordered hover style={{marginTopL: 10}}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Receiver account number</th>
                                <th>Full name</th>
                                <th>Phone number</th>
                                <th>Date of birth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.receiver.map((object,index) => (
                                    <Receiver position={index + 1} obj={object} key={index}/>
                                ))
                            }
                        </tbody>
                    </Table>
                    <form onSubmit={this.handleSubmitForm}>
                        <div className="form-group">
                            <label>Account number</label>
                            <div className="customer-form-input">
                                <input type="number" name="accountNumber" value={this.state.accountNumber} className="form-control customer-input" placeholder="Enter account number" onChange={this.handleInputChange}/>
                                <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title={this.state.selectedName}>
                                    {
                                        this.state.receiverList.map((receiver, index)=>{
                                            return <Dropdown.Item eventKey={receiver.accountNumber} key={index} onSelect={this.handleItemSelect}>{receiver.fullname}</Dropdown.Item>
                                        })
                                    }
                                </DropdownButton>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Money amount</label>
                            <input type="number" name="moneyAmount" value={this.state.moneyAmount} className="form-control customer-input" placeholder="Enter money amount" onChange={this.handleInputChange}/>
                        </div>
                        
                        <button type="submit" className="btn btn-primary btn-block submit-button-customer">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
} 