import React, {Component} from 'react';
import {Table, Dropdown, DropdownButton} from 'react-bootstrap';
import HistoryRow from './HistoryRow';
import axios from 'axios';

export default class HistoryAdmin extends Component{
    constructor(props){
        super(props);
        this.state = {
            historyArray: [
                {
                    bankName: 'Ngân Hàng A',
                    moneyAmount: 1000000,
                    transferTime: '0:0:23 1/1/2020'
                }
            ],

            bankList:[
                {
                    id: 0,
                    name: 'All'
                }
            ],

            selectedBank: 0
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

                axios.get('http://localhost:8080/partner/allBank', config).then(response => {
                    console.log(response);
                    this.setState(state => {
                        const bankList = [...state.bankList, ...response.data];
                        console.log(bankList);
                        return {
                            bankList
                        }
                    });
                }).catch(error=>{
                    console.log(error);
                });

                axios.get('http://localhost:8080/partner/allHistory', config).then(response => {
                    console.log(response);
                    const list = [...response.data]; 
                    this.setState({historyArray: list});
                }).catch(error=>{
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleBankSelect = (e) => {
        this.setState({selectedBank: e});
        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        axios.get('http://localhost:8080/partner/history/' + e, config).then(response => {
            console.log(response);
            const list = [...response.data]; 
            this.setState({historyArray: list});
        }).catch(error=>{
            console.log(error);
        });
    }   
    render(){
        return(
            <div className="admin-content">
                <div className="admin-inner">
                    <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title="Select Bank">
                        {
                            this.state.bankList.map((bank, index)=>{
                                return <Dropdown.Item eventKey={bank.id} key={index} onSelect={this.handleBankSelect}>{bank.name}</Dropdown.Item>
                            })
                        }
                    </DropdownButton>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Bank name</th>
                                <th>Money amount</th>
                                <th>Transfer time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.historyArray.map((object,index) => (
                                    <HistoryRow position={index + 1} obj={object} key={index}/>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}