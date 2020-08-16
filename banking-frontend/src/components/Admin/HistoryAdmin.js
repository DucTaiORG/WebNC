import React, { Component } from 'react';
import { Table, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import HistoryRow from './HistoryRow';
import axios from 'axios';
import moment from 'moment';
import { SingleDatePicker, DateRangePicker } from 'react-date-range';
import { DatePicker } from 'antd';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'antd/dist/antd.css';

const { RangePicker } = DatePicker;

export default class HistoryAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyArray: [
                {
                    bankName: 'Ngân Hàng A',
                    moneyAmount: 1000000,
                    transferTime: '0:0:23 1/1/2020'
                }
            ],
            total: 0,

            bankList: [
                {
                    id: 0,
                    name: 'All'
                }
            ],

            startDate: "",
            endDate: ""
        }
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const postBody = {
            accessToken,
            refreshToken
        }

        axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
            if (response.data.accessToken) {
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
                }).catch(error => {
                    console.log(error);
                });

                axios.get('http://localhost:8080/partner/allHistory', config).then(response => {
                    console.log(response);
                    const list = [...response.data];
                    this.setState({ historyArray: list });
                }).catch(error => {
                    console.log(error);
                });
                axios.get('http://localhost:8080/partner/totalMoney', config).then(response => {
                    console.log("total", response);
                    const list = response.data[0].total_money;
                    console.log("list", list);
                    this.setState({ total: list });
                }).catch(error => {
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleBankSelect = (e) => {
        this.setState({ selectedBank: e });
        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        axios.get('http://localhost:8080/partner/history/' + e, config).then(response => {
            console.log(response);
            const list = [...response.data];
            this.setState({ historyArray: list });
        }).catch(error => {
            console.log(error);
        });
    }

    handleDateSelect = (range) => {
        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };
        if (range != null) {
            const valueOfInput1 = range[0].format();
            const valueOfInput2 = range[1].format();
            const body = {
                startDate: valueOfInput1.slice(0, 10),
                endDate: valueOfInput2.slice(0, 10)
            }
            console.log(body);
            axios.post('http://localhost:8080/partner/filteredDate', body, config).then((response)=>{
                const list = [...response.data];
                console.log(list);
                this.setState({ historyArray: list });
            }).catch((error)=>{
                console.log(error);
            })
        } else{
            axios.get('http://localhost:8080/partner/allBank', config).then(response => {
                    console.log(response);
                    this.setState(state => {
                        const bankList = [...state.bankList, ...response.data];
                        console.log(bankList);
                        return {
                            bankList
                        }
                    });
                }).catch(error => {
                    console.log(error);
                });

                axios.get('http://localhost:8080/partner/allHistory', config).then(response => {
                    console.log(response);
                    const list = [...response.data];
                    this.setState({ historyArray: list });
                }).catch(error => {
                    console.log(error);
                });
                axios.get('http://localhost:8080/partner/totalMoney', config).then(response => {
                    console.log("total", response);
                    const list = response.data[0].total_money;
                    console.log("list", list);
                    this.setState({ total: list });
                }).catch(error => {
                    console.log(error);
                });
        }
    }


    render() {
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
        return (
            <div className="admin-content">
                <div className="admin-inner">
                    <div className="row">
                        <div className="col-md-4">
                            <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title="Select Bank">
                                {
                                    this.state.bankList.map((bank, index) => {
                                        return <Dropdown.Item eventKey={bank.id} key={index} onSelect={this.handleBankSelect}>{bank.name}</Dropdown.Item>
                                    })
                                }
                            </DropdownButton>
                        </div>
                        <div className="col-md-5">
                            <RangePicker onChange={this.handleDateSelect} />
                        </div>


                    </div>
                    <div className="col-md-4"><strong>Total:</strong> {this.state.total}</div>
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
                                this.state.historyArray.map((object, index) => (
                                    <HistoryRow position={index + 1} obj={object} key={index} />
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}