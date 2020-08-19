import React, {Component} from 'react';
import axios from 'axios';
import AccountRow from './AccountRow2';
import {Table, Dropdown, DropdownButton, Alert} from 'react-bootstrap';
import Receiver from './Receiver';
import jwt_decode from 'jwt-decode';
import TransferModal from './TransferModal';
import './Customer.css';

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

export default class TransferMoneyExt extends Component{
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
            bankList:[
                {
                    id: 7,
                    bankName: 'Nhóm 25'
                },
                {
                    id: 8,
                    bankName: 'Nhóm 30'
                }
            ],
            receiver:{
                accountNumber: '',
                fullname: '',
                phoneNo: '',
                dateOfBirth: ''
            },
            selectedName: 'From list',
            selectedBank: {
                id: 0,
                name: 'Bank List'
            },
            toBank: 1,
            transferFeeType: 1,
            showModal: false,
            showAlert: false,
            alertMessage: ''
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

    handleInputChange = e =>{
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;

        switch(name){
            case "toAccount":
                if(value.length == 0){
                    formErrors.toAccount = "";
                }else{
                    if(value.length < 6){
                        formErrors.toAccount = "Invalid account number";
                    }else{
                        formErrors.toAccount = "";
                    }
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
        if(name == 'toAccount'){
            this.setState({
                receiver: null
            });
        }
        if(formValid(formErrors) && name == 'toAccount'){

            if(this.state.selectedBank.id == 7 && this.state.toAccount.length > 0){
                setTimeout(()=>{
                    axios.get('http://localhost:8080/client/rsa/check/' + this.state.toAccount).then(response => {
                        console.log(response);
                        const responseData = {...response.data};
                        this.setState({
                            receiver: {
                                accountNumber: '',
                                fullname: responseData.fullname,
                                phoneNo: '',
                                dateOfBirth: ''
                            }
                        });
                    }).catch(error=>{
                        console.log(error);
                    });
                }, 1000);   
            }

            if(this.state.selectedBank.id == 8 && this.state.toAccount.length > 0){
                setTimeout(()=>{
                    const body = {
                        toAccount: this.state.toAccount
                    }
                    axios.post('http://localhost:8080/client/pgp2/check', body).then(response => {
                        const responseData = {...response.data.data};
                        console.log(responseData);
                        this.setState({
                            receiver: {
                                accountNumber: responseData.account_number,
                                fullname: responseData.account_name,
                                phoneNo: '',
                                dateOfBirth: ''
                            }
                        });
                    }).catch(error=>{
                        console.log(error);
                    });
                }, 1000);   
            }

        }else if(name != 'moneyAmount'){
            this.setState({receiver: null});
        }
    }

    

    closeAlert = () => {
        this.setState({showAlert: false});
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
                        sender_account_number: state.loggedAccount.accountNumber,
                        receiver_account_number: state.toAccount,
                        money: state.moneyAmount,
                        type_fee: state.transferFeeType,
                        message: "Chuyen khoan"
                    };

                    const config = {
                        headers: {
                            'x-access-token' : localStorage.getItem('accessToken')
                        }
                    }

                    axios.post('http://localhost:8080/client/rsa/addHistory', submitForm, config).then((response)=>{
                        console.log(response);
                    }).catch((error)=>{
                        console.log(error.response);
                        this.setState({showAlert: true, alertMessage: error.response.data.error});
                    });
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }else{
            this.setState({showAlert: true, alertMessage: 'Invalid Form'});
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
    }

    handleBankSelect = (eventKey, event) =>{
        this.setState({toBank: eventKey});
        this.setState({
            selectedBank: {
                id: eventKey,
                name: event.target.textContent
            }
        });
        setTimeout(()=>{
            if(this.state.selectedBank.id == 7 && this.state.toAccount.length > 0){
                axios.get('http://localhost:8080/client/rsa/check/' + this.state.toAccount).then(response => {
                    console.log(response);
                    const responseData = {...response.data};
                    this.setState({
                        receiver: {
                            accountNumber: '',
                            fullname: responseData.fullname,
                            phoneNo: '',
                            dateOfBirth: ''
                        }
                    });
                }).catch(error=>{
                    console.log(error);
                }); 
            }

            if(this.state.selectedBank.id == 8 && this.state.toAccount.length > 0){
                const body = {
                    toAccount: this.state.toAccount
                }
                axios.post('http://localhost:8080/client/pgp2/check', body).then(response => {
                    const responseData = {...response.data.data};
                    console.log(responseData);
                    this.setState({
                        receiver: {
                            accountNumber: responseData.account_number,
                            fullname: responseData.account_name,
                            phoneNo: '',
                            dateOfBirth: ''
                        }
                    });
                }).catch(error=>{
                    console.log(error);
                }); 
            }
        }, 1000);
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
            sender_account_number: this.state.loggedAccount.accountNumber,
            receiver_account_number: this.state.toAccount,
            money: this.state.moneyAmount,
            type_fee: this.state.transferFeeType,
            message: "Gửi ăn mừng Hè 2020",
            otpNum: otp
        }

        const submitTransfer2 = {
            fromAccount: this.state.loggedAccount.accountNumber,
            sender: this.state.loggedAccount.accountNumber,
            toAccount: this.state.toAccount,
            moneyAmount: this.state.moneyAmount,
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
                console.log('Verify success');
                if(this.state.selectedBank.id == 7){
                    console.log('Transfer bank 7');
                    axios.post('http://localhost:8080/client/rsa/recharge', submitTransfer, config).then(response => {
                        if(response.data.status == "RSA success"){
                            axios.get('http://localhost:8080/user/byUserId/' + getUserId(), config).then(response => {
                                console.log(response);
                                const responseData = {...response.data};
                                this.setState({loggedAccount: responseData});
                            }).catch(error=>{
                                console.log(error);
                            });
                            this.setState({showAlert: true, alertMessage: 'Transfer successful'});
                        }
                    }).catch(error => {
                        console.log(error.response);
                    });
                }

                if(this.state.selectedBank.id == 8){
                    console.log('Transfer bank 8');
                    axios.post('http://localhost:8080/client/pgp2/recharge', submitTransfer2, config).then(response => {
                        if(response.data.message == "Success"){
                            axios.get('http://localhost:8080/user/byUserId/' + getUserId(), config).then(response => {
                                console.log(response);
                                const responseData = {...response.data};
                                this.setState({loggedAccount: responseData});
                            }).catch(error=>{
                                console.log(error);
                            });
                            this.setState({showAlert: true, alertMessage: 'Transfer successful'});
                        }
                    }).catch(error => {
                        console.log(error.response);
                    });
                }
                
            }else{
                this.setState({showAlert: true, alertMessage: 'OTP not match', showModal: false});
            }
        }).catch((error)=>{
            console.log(error);
            this.setState({showAlert: true, alertMessage: 'Transfer fail', showModal: false});
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
                <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="success" title={this.state.selectedBank.name}>
                    {
                        this.state.bankList.map((bank, index)=>{
                            return <Dropdown.Item eventKey={bank.id} key={index} onSelect={this.handleBankSelect}>{bank.bankName}</Dropdown.Item>
                        })
                    }
                </DropdownButton>
                {this.state.showAlert == true ? <Alert variant="danger" show={this.state.showAlert} onClose={this.closeAlert} dismissible>{this.state.alertMessage}</Alert> : null}
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
                            <Receiver obj={this.state.receiver}/>
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