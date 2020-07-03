import React, { Component } from 'react';
import axios from 'axios';
import AccountRow from './AccountRow2';
import {Table, Dropdown, DropdownButton, Alert} from 'react-bootstrap';
import Receiver from './Receiver';
import jwt_decode from 'jwt-decode';

const getUserId = () =>{
    try {
        console.log(localStorage.getItem('accessToken'));
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
}


export default class CreateDebt extends Component {
    constructor(props){
        super(props);
        this.state = {
            toAccount: '',
            moneyAmount: '',
            content: '',
            formErrors:{
                toAccount: '',
                moneyAmount: ''
            },
            
            loggedAccount:{
                accountNumber: 123456789,
                balance: 10000
            },

            debtor:{
                accountNumber: '',
                fullname: '',
                phoneNo: '',
                dateOfBirth: ''
            },

            receiverList:[
                {
                    accountNumber: 123456789,
                    fullname: 'Tài Đức'
                },
                {
                    accountNumber: 112222222,
                    fullname: 'Bành Thị B'
                }
            ],

            selectedName: 'From list',
            showAlert: false,
            alertMessage: '',
            alertVariant: ''
        };
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

                axios.get('http://localhost:8080/user/byUserId/' + getUserId(), config).then(response => {
                    console.log(response);
                    const responseData = {...response.data};
                    this.setState({loggedAccount: responseData});
                }).catch(error=>{
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    closeAlert = () => {
        this.setState({showAlert: false});
    }

    handleSubmitForm = e =>{
        e.preventDefault();
        const state = this.state;
        console.log(state);
        
        if(formValid(this.state.formErrors)){
            this.setState({showModal: true});
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const postBody = {
                accessToken,
                refreshToken
            }

            axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
                if(response.data.accessToken){
                    localStorage.setItem('accessToken', response.data.accessToken);

                    const submitForm = {
                        fromAcc: state.loggedAccount.accountNumber,
                        toAcc: state.toAccount,
                        moneyAmount: state.moneyAmount,
                        content: state.content
                    };

                    const config = {
                        headers: {
                            'x-access-token' : localStorage.getItem('accessToken')
                        }
                    }

                    axios.post('http://localhost:8080/user/addDebt', submitForm, config).then((response)=>{
                        console.log(response);
                        if(response.data.success){
                            this.setState({showAlert: true, 
                                            alertMessage: 'Add debt successful', 
                                            alertVariant: 'success'});
                        }else{
                            this.setState({showAlert: true, 
                                            alertMessage: 'Account number not found', 
                                            alertVariant: 'danger'});
                        }
                    }).catch((error)=>{
                        console.log(error.response);
                        this.setState({showAlert: true, 
                                        alertMessage: `Error: ${error.response.data.error}`, 
                                        alertVariant: 'danger'});
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }else{
            this.setState({showAlert: true, 
                            alertMessage: `Invalid form`, 
                            alertVariant: 'danger'});
        }
        this.setState({toAccount: '',
                        moneyAmount: '',
                        content: '',});
    }

    handleInputChange = e =>{
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;

        switch(name){
            case "toAccount":
                if(value.length != 9 && value.length != 0){
                    formErrors.toAccount = "Must have 9 characters";
                }else{
                    formErrors.toAccount = "";
                }
                break;
            case "moneyAmount":
                if(value.length == 0){
                    formErrors.moneyAmount = "";
                }else{
                    if(Number(value) < 30000 || Number(value) > 500000000)
                    {
                        formErrors.moneyAmount = "Minimums is 30000, maximun is 500000000"
                    }else{
                        formErrors.moneyAmount = "";
                    }
                }
                break;
        }

        this.setState({formErrors, [name]: value});

        if(formValid(formErrors)){
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

                    axios.get('http://localhost:8080/user/byAccountNum/' + this.state.toAccount, config).then(response => {
                        console.log(response);
                        const responseData = {...response.data};
                        this.setState({debtor: responseData});
                    }).catch(error=>{
                        console.log(error);
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }else{
            this.setState({debtor: null});
        }
        
    }

    handleItemSelect = (eventKey, event)=>{
        this.setState({toAccount: eventKey});
        this.setState({selectedName: event.target.textContent});
        const config = {
            headers: {
                'x-access-token' : localStorage.getItem('accessToken')
            }
        }

        axios.get('http://localhost:8080/user/byAccountNum/' + eventKey, config).then(response => {
            console.log(response);
            const responseData = {...response.data};
            this.setState({debtor: responseData});
        }).catch(error=>{
            console.log(error);
        });
    }
    
    render() {
        const {formErrors} = this.state;
        return (
            <div className="customer-content">
                <h1>Create debt reminder</h1>
                <div className="customer-inner">
                {this.state.showAlert == true ? <Alert variant={this.state.alertVariant} show={this.state.showAlert} onClose={this.closeAlert} dismissible>{this.state.alertMessage}</Alert> : null}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Your account number</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.loggedAccount !== null ? <AccountRow obj={this.state.loggedAccount}/> : null}
                        </tbody>
                    </Table>
                    <Table striped bordered hover style={{marginTopL: 10}}>
                        <thead>
                            <tr>
                                <th>Receiver account number</th>
                                <th>Full name</th>
                                <th>Phone number</th>
                                <th>Date of birth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.debtor !== null ? <Receiver obj={this.state.debtor}/> : null}
                        </tbody>
                    </Table>
                    <form onSubmit={this.handleSubmitForm}>
                        <div className="form-group">
                            <label>Account number</label>
                            <div className="customer-form-input">
                                <input type="number" name="toAccount" value={this.state.toAccount} className="form-control customer-input" placeholder="Enter account number" onChange={this.handleInputChange}/>
                                <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title={this.state.selectedName}>
                                    {
                                        this.state.receiverList.map((receiver, index)=>{
                                            return <Dropdown.Item eventKey={receiver.accountNumber} key={index} onSelect={this.handleItemSelect}>{receiver.fullname}</Dropdown.Item>
                                        })
                                    }
                                </DropdownButton>
                            </div>
                            {formErrors.toAccount.length > 0 ? <span style={{color: 'red'}}>{formErrors.toAccount}</span>:null}
                        </div>

                        <div className="form-group">
                            <label>Money amount</label>
                            <input type="number" name="moneyAmount" value={this.state.moneyAmount} className="form-control customer-input" placeholder="Enter money amount" onChange={this.handleInputChange}/>
                            {formErrors.moneyAmount.length > 0 ? <span style={{color: 'red'}}>{formErrors.moneyAmount}</span>:null}
                        </div>

                        <div className="form-group">
                            <label>Debt content</label>
                            <input type="text" name="content" value={this.state.content} className="form-control customer-input" placeholder="Enter money amount" onChange={this.handleInputChange}/>
                        </div>
                        
                        <button type="submit" className="btn btn-primary btn-block submit-button-customer">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}