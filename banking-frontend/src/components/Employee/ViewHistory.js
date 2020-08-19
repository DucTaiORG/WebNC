import React, {Component} from 'react';
import {Table, Dropdown, DropdownButton, Button} from 'react-bootstrap';
import axios from 'axios';
import Receiver from './Receiver';

class HistoryRow extends Component{
    render(){
        if(this.props.obj == null || this.props.obj == undefined){
            return <tr>
                    <td colSpan='5' style={{textAlign: 'center'}}>
                      Not thing to show
                    </td>
                  </tr>
          }
        return(
            <tr>
                <td>{this.props.position}</td>
                <td>{this.props.obj.money_amount}</td>
                <td>{this.props.obj.from_account || this.props.obj.lender}</td>
                <td>{this.props.obj.account_num || this.props.obj.to_account || this.props.obj.debtor}</td>
                <td>{this.props.obj.time}</td>
            </tr>
        )
    }
}

export default class ViewHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            historyArray: [],
            
            viewType: 'Deposit',

            accountNumber: '',

            userInfo:{}
        }
    }

    

    handleTypeChange = (e) => {
        this.setState({viewType: e});

        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        axios.get('http://localhost:8080/deposit/getUserId/' + this.state.accountNumber, config).then((response)=>{
            const data = {...response.data};
            console.log(data.id);
            const postBody = {
                userId: data.id
            };
            axios.post('http://localhost:8080/deposit/' + e, postBody, config).then((response)=>{
                console.log(response);
                const list = [...response.data];
                this.setState({historyArray: list});
            }).catch((error)=>{
                console.log(error.response);
                alert(error.response.data.error);
            });
        }).catch((error)=>{
            console.log(error);
            return 0
        });
    }

    handleInputChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleButtonClick = (e) => {
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
                const config = {
                    headers: {
                        'x-access-token': localStorage.getItem('accessToken')
                    }
                };
        
                const postBody = {
                    accountNumber: state.accountNumber
                };
        
                axios.post('http://localhost:8080/deposit/history', postBody, config).then((response)=>{
                    console.log(response);
                    const list = [...response.data];
                    this.setState({historyArray: list});
                }).catch((error)=>{
                    console.log(error.response);
                    alert(error.response.data.error);
                });

                axios.get('http://localhost:8080/deposit/byAccountNum/' + state.accountNumber, config).then((response)=>{
                    console.log(response);
                    const data = {...response.data};
                    this.setState({userInfo: data});
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    render(){
        return (
            <div className="history-inner">
                <div className="account-input">
                    <input className="custom-input" name="accountNumber" placeholder="Enter account number" onChange={this.handleInputChange}/>
                    <Button className="custom-button" variant="danger" onClick={this.handleButtonClick}>Confirm</Button>
                </div>
                <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title={this.state.viewType}>
                    <Dropdown.Item eventKey="Deposit" onSelect={this.handleTypeChange}>Deposit history</Dropdown.Item>
                    <Dropdown.Item eventKey="Transfer" onSelect={this.handleTypeChange}>Transfer history</Dropdown.Item>
                    <Dropdown.Item eventKey="Debt" onSelect={this.handleTypeChange}>Pay debt history</Dropdown.Item>
                </DropdownButton>
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
                            <Receiver obj={this.state.userInfo}/>
                        </tbody>
                    </Table>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Money Amount</th>
                            <th>{this.state.historyType == 'paydebtHistory'? 'Lender' : 'From account'}</th>
                            <th>{this.state.historyType == 'paydebtHistory'? 'Debtor' : 'To account'}</th>
                            <th>{this.state.historyType == 'paydebtHistory'? 'Pay time' : 'Time'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.historyArray.length == 0 ? <HistoryRow amount={null}/>:
                            this.state.historyArray.map((row,index) => (
                                <HistoryRow position={index + 1} obj={row} key={index}/>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
} 