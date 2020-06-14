import React, {Component} from 'react';
import {Table, Dropdown, DropdownButton, Button} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const refresh = (cb) =>{
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const postBody = {
        accessToken,
        refreshToken
    }

    axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
        if(response.data.accessToken){
            localStorage.setItem('accessToken', response.data.accessToken);
            cb();
        }
    }).catch((error) => {
        console.log(error);
    });
}

class HistoryRow extends Component{
    render(){
        return(
            <tr>
                <td>{this.props.position}</td>
                <td>{this.props.amount}</td>
                <td>{this.props.time}</td>
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
        }
    }

    handleTypeChange = (e) => {
        this.setState({viewType: e});
    }

    handleInputChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleButtonClick = (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        const postBody = {
            accountNumber: this.state.accountNumber
        };

        const getHistoryAPI = axios.post('http://localhost:8080/deposit/history', postBody, config).then((response)=>{
            const list = [...response.data];
            list.forEach((item)=>{
                const time = moment(item.deposit_time).format('HH:mm:ss DD/MM/YYYY');
                item.deposit_time = time;
            });
            this.setState({historyArray: list});
        }).catch((response)=>{
            console.log(response.response);
            alert(response.response.data.error)
        });

        refresh(getHistoryAPI);
    }

    render(){
        return (
            <div className="history-inner">
                <div className="account-input">
                    <input className="custom-input" name="accountNumber" placeholder="Enter account number" onChange={this.handleInputChange}/>
                    <Button className="custom-button" variant="danger" onClick={this.handleButtonClick}>Confirm</Button>
                </div>
                <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title="Select Type">
                    <Dropdown.Item eventKey="Deposit" onSelect={this.handleTypeChange}>Deposit History</Dropdown.Item>
                    <Dropdown.Item eventKey="Transfer" onSelect={this.handleTypeChange}>Transfer History</Dropdown.Item>
                    <Dropdown.Item eventKey="Option-3" onSelect={this.handleTypeChange}>Something else</Dropdown.Item>
                </DropdownButton>
                <span>{this.state.viewType}</span> 
                <Table striped bordered hover>
                    <thead>
                        <th>#</th>
                        <th>Deposit Money</th>
                        <th>Time</th>
                    </thead>
                    <tbody>
                        {
                            this.state.historyArray.map((row,index) => (
                                <HistoryRow position={index + 1} amount={row.money_amount} time={row.deposit_time}/>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
} 