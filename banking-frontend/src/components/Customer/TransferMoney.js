import React, {Component} from 'react';
import axios from 'axios';
import AccountRow from './AccountRow2';
import {Table, Dropdown, DropdownButton} from 'react-bootstrap';
import Receiver from './Receiver';
import jwt_decode from 'jwt-decode';
import TransferModal from './TransferModal';
import './Customer.css';

try {
    console.log(localStorage.getItem('accessToken'));
    var {userId} = jwt_decode(localStorage.getItem('accessToken'));
} catch (error) {
    console.log(error);
}

const formValid = formErrors =>{
    let valid  = true;
    Object.values(formErrors).forEach(val=>val.length>0 && (valid=false));
    return valid;
};

export default class DepositMoney extends Component{
    constructor(props){
        super(props);
        this.state = {
            toAccount: '',
            moneyAmount: '',
            formErrors:{
                toAccount: '',
                moneyAmount: ''
            },
            loggedAccount:{
                accountNumber: 123456789,
                balance: 10000
            },
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
            receiver:{
                accountNumber: '',
                fullname: '',
                phoneNo: '',
                dateOfBirth: ''
            },
            selectedName: 'From list',
            transferFeeType: 1,
            showModal: false
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

                axios.get('http://localhost:8080/user/byUserId/' + userId, config).then(response => {
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

    /*handleMoneyChange = e => {
        e.preventDefault();
        this.setState({moneyAmount: e.target.value});
    }*/

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
                        formErrors.moneyAmount = "Minimums is 10000, maximun is 500000000"
                    }else{
                        formErrors.moneyAmount = "";
                    }
                }
                
                break;
        }
        this.setState({formErrors, [name]: value}, ()=>console.log(this.state.formErrors));

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
                        this.setState({receiver: responseData});
                    }).catch(error=>{
                        console.log(error);
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }else{
            this.setState({receiver: null});
        }
    }

    handleSubmitForm = e => {
        e.preventDefault();
        const state = this.state;
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
                        transferFeeType: state.transferFeeType
                    };

                    const config = {
                        headers: {
                            'x-access-token' : localStorage.getItem('accessToken')
                        }
                    }

                    axios.post('http://localhost:8080/transfer/addHistory', submitForm, config).then((response)=>{
                        console.log(response);
                    }).catch((error)=>{
                        console.log(error.response);
                        alert(`Transfer fail: ${error.response.data.error}`);
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }else{
            alert("Invalid form");
        }
    }

    handleItemSelect = (eventKey, event)=>{
        this.setState({toAccount: eventKey});
        this.setState({selectedName: event.target.textContent});
    }

    handleRadioButton = (event)=>{
        this.setState({transferFeeType: event.target.value}, ()=>console.log(this.state.transferFeeType));
    }

    handleCloseModal = ()=>{
        this.setState({showModal: false});
    }

    handleSubmitModal = (otp)=>{
        console.log('otp: '+ otp);
        const state = this.state;
        const submitVerify = {
            fromAcc: state.loggedAccount.accountNumber,
            otpNum: otp
        };

        const submitTransfer = {
            fromAcc: this.state.loggedAccount.accountNumber,
            toAcc: this.state.toAccount,
            moneyAmount: this.state.moneyAmount,
            transferFeeType: this.state.transferFeeType,
            otpNum: otp
        }

        const config = {
            headers: {
                'x-access-token' : localStorage.getItem('accessToken')
            }
        }

        axios.post('http://localhost:8080/transfer/verify', submitVerify, config).then((response)=>{
            console.log(response);
            if(response.data.success){
                axios.post('http://localhost:8080/transfer', submitTransfer, config).then(response => {
                    if(response.data.success){
                        axios.get('http://localhost:8080/user/byUserId/' + userId, config).then(response => {
                            console.log(response);
                            const responseData = {...response.data};
                            this.setState({loggedAccount: responseData});
                        }).catch(error=>{
                            console.log(error);
                        });
                        alert('Transfer successful');
                    }
                }).catch(error => {
                    console.log(error.response);
                });
            }else{
                alert('Verify fail!');
            }
        }).catch((error)=>{
            console.log(error.response);
            alert(`Transfer fail`);
        });
        
        this.setState({
            toAccount: "",
            moneyAmount: "",
            showModal: false
        });
    }

    render(){
        const {formErrors} = this.state;
        return (
            <div className="customer-content">
                <h1>Transfer Money</h1>
                <div className="customer-inner">
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
                            {this.state.receiver !== null ? <Receiver obj={this.state.receiver}/> : null}
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

                        <div>
                            <div className="radio">
                                <label><input type="radio" name="feeType" value={1} defaultChecked onClick={this.handleRadioButton} style={{marginRight: 10}}/>Sender bear fee</label>
                            </div>

                            <div className="radio">
                                <label><input type="radio" name="feeType" value={2} onClick={this.handleRadioButton} style={{marginRight: 10}}/>Receiver bear fee</label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block submit-button-customer">Submit</button>
                    </form>
                </div>

                <TransferModal show={this.state.showModal} closemodal={this.handleCloseModal} submitmodal={this.handleSubmitModal}/>
            </div>
        );
    }
} 