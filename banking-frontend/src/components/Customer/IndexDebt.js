import React, {Component} from 'react';
import TableRow from './TableRow';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import TransferModal from './TransferModal';

try {
    console.log(localStorage.getItem('accessToken'));
    var {userId} = jwt_decode(localStorage.getItem('accessToken'));
} catch (error) {
    console.log(error);
}

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debts: [
                {
                    id: 1,
                    lender: 'Lâm Đức Tài',
                    debtor: 'employee',
                    moneyAmount: 'ductai@gmail.com',
                    content: '0908960580',
                    time: '18/10/1998',
                    status: 'Not yet paid'
                }
            ],
            currentId: 0,
            showModal: false
        };
    }

    componentDidMount() {
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
                axios.get('http://localhost:8080/user/getDebt/' + userId, config).then(response => {
                    console.log(response.data);
                    this.setState({debts: response.data});
                }).catch(function (error) {
                    console.log(error.response);
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleDelete = id => {
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
    
            }
        }).catch((error) => {
            console.log(error.response);
        })
    }

    handlePay = id =>{
        this.setState({currentId: id});
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

                const body = {
                    id,
                    userId,
                }
    
                axios.post('http://localhost:8080/user/addPaydebtHistory', body, config).then((response) =>{
                    console.log(response.data);
                    this.setState({showModal: true});
                }).catch(function (error){
                    console.log(error);
                    alert(error)
                })
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleCloseModal = ()=>{
        this.setState({showModal: false});
    }

    handleSubmitModal = (otp)=>{
        console.log('otp: '+ otp);
        const state = this.state;
        const submitVerify = {
            otpNum: otp
        };

        const submitTransfer = {
            debtId: state.currentId,
            userId,
            otp,
        }

        const config = {
            headers: {
                'x-access-token' : localStorage.getItem('accessToken')
            }
        }

        axios.post('http://localhost:8080/user/verifyPayOTP', submitVerify, config).then((response)=>{
            console.log(response);
            if(response.data.success){
                axios.post('http://localhost:8080/user/payDebt', submitTransfer, config).then(response => {
                    if(response.data.success){
                        axios.get('http://localhost:8080/user/getDebt/' + userId, config).then(response => {
                            console.log(response.data);
                            this.setState({debts: response.data});
                        }).catch(function (error) {
                            console.log(error.response);
                        });
                        alert('Pay debt successful');
                    }
                }).catch(error => {
                    console.log(error.response);
                });
            }else{
                alert('Verify fail!');
            }
        }).catch((error)=>{
            console.log(error.response);
            alert(`Pay debt fail`);
        });
        
        this.setState({
            showModal: false
        });
    }

    render() {
        return (
            <div className="admin-content">
                <table className="table table-striped table-dark" style={{marginTop: 20}}>
                    <thead>
                    <tr>
                        <th>Lender</th>
                        <th>Debtor</th>
                        <th>Money amount</th>
                        <th>Content</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th colSpan="2">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.debts.map((object, index)=>{
                            return <TableRow obj={object} key={index} handelDel={this.handleDelete} handlePay={this.handlePay}/>
                        })
                    }
                    </tbody>
                </table>
                <TransferModal show={this.state.showModal} closemodal={this.handleCloseModal} submitmodal={this.handleSubmitModal}/>
            </div>
        );
    }
}