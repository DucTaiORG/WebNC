import React, {Component} from 'react';
import {Table, Dropdown, DropdownButton} from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
class HistoryRow extends Component{
    render(){
        return(
            <tr>
                <td>{this.props.obj.position}</td>
                <td>{this.props.obj.money_amount}</td>
                <td>{this.props.obj.account_num || this.props.obj.from_account}</td>
                <td>{this.props.obj.to_account}</td>
                <td>{this.props.obj.time}</td>
            </tr>
        )
    }
}

try {
    console.log(localStorage.getItem('accessToken'));
    var {userId} = jwt_decode(localStorage.getItem('accessToken'));
} catch (error) {
    console.log(error);
}

export default class CustomerHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            historyArray: [],
            
            viewType: 'Deposit History',

            historyType: 'depositHistory'
        }
    }

    componentDidMount(){
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const postRefreshBody = {
            accessToken,
            refreshToken
        }
        axios.post('http://localhost:8080/api/auth/refresh', postRefreshBody).then((response) => {
            if(response.data.accessToken){
                localStorage.setItem('accessToken', response.data.accessToken);
                const config = {
                    headers: {
                        'x-access-token': localStorage.getItem('accessToken')
                    }
                };
        
                const postBody = {
                    userId
                };
        
                axios.post('http://localhost:8080/user/depositHistory', postBody, config).then((response)=>{
                    console.log(response);
                    const list = [...response.data];
                    this.setState({historyArray: list});
                }).catch((error)=>{
                    console.log(error.response);
                    alert(error.response.data.error);
                });
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    handleTypeChange = (evenyKey, event) => {
        this.setState({viewType: event.target.textContent});
        this.setState({historyType: evenyKey});
        
        const config = {
            headers: {
                'x-access-token': localStorage.getItem('accessToken')
            }
        };

        const postBody = {
            userId
        };

        axios.post('http://localhost:8080/user/' + evenyKey, postBody, config).then((response)=>{
            console.log(response);
            const list = [...response.data];
            this.setState({historyArray: list});
        }).catch((error)=>{
            console.log(error.response);
            alert(error.response.data.error);
        });
    }

    render(){
        return (
            <div className="customer-content">
                <div className="customer-inner">
                    <DropdownButton className="custom-dropdown" id="dropdown-basic-button" variant="warning" title={this.state.viewType}>
                        <Dropdown.Item eventKey="depositHistory" onSelect={this.handleTypeChange}>Deposit History</Dropdown.Item>
                        <Dropdown.Item eventKey="transferHistory" onSelect={this.handleTypeChange}>Transfer History</Dropdown.Item>
                        <Dropdown.Item eventKey="Something else" onSelect={this.handleTypeChange}>Something else</Dropdown.Item>
                    </DropdownButton>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Money Amount</th>
                                <th>From account</th>
                                <th>To account</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.historyArray.map((history,index) => (
                                    <HistoryRow position={index + 1} obj={history} key={index}/>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
} 