import React, {Component} from 'react';
import AccountRow from './AccountRow';
import {Table, Dropdown, DropdownButton} from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './Customer.css';


const {userId} = jwt_decode(localStorage.getItem('accessToken'));

export default class AccountList extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountList:[
                {
                    accountNumber: 123456789,
                    balance: 10000
                }
            ],

            selectedType: 1,

            accountType: [
                {
                    id: 1,
                    name: 'Payment account'
                },

                {
                    id: 2,
                    name: 'Saving account'
                }
            ],

            selectedName: 'Payment account',
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

                axios.get('http://localhost:8080/account/payment/' + userId, config).then(response => {
                    console.log(response);
                    const responseList = [...response.data];
                    this.setState({accountList: responseList});
                }).catch(error=>{
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleTypeSelect = (eventKey, event) => {
        this.setState({selectedName: event.target.textContent});
        this.setState({selectedType: +eventKey});

        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        if(eventKey == 1){
            axios.get('http://localhost:8080/account/payment/' + userId, config).then(response => {
                console.log(response);
                const responseList = [...response.data];
                this.setState({accountList: responseList});
            }).catch(error=>{
                console.log(error);
            });
        }

        if(eventKey == 2){
            axios.get('http://localhost:8080/account/saving/' + userId, config).then(response => {
                console.log(response);
                const responseList = [...response.data];
                this.setState({accountList: responseList});
            }).catch(error=>{
                console.log(error);
            });
        }
    }

    render(){
        return(
            <div className="customer-content">
                <h1>Account list</h1>
                <div className="customer-inner">
                    <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title={this.state.selectedName}>
                        {
                            this.state.accountType.map((accountType, index)=>{
                                return <Dropdown.Item eventKey={accountType.id} key={index} onSelect={this.handleTypeSelect}>{accountType.name}</Dropdown.Item>
                            })
                        }
                    </DropdownButton>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Account Number</th>
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
                </div>
            </div>
        )
    }
}