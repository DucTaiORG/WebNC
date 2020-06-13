import React, {Component} from 'react';
import axios from 'axios';

const refresh = () =>{
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const postBody = {
        accessToken,
        refreshToken
    }

    axios.post('http://localhost:8080/api/auth/refresh', postBody).then((response) => {
        if(response.data.accessToken){
            localStorage.setItem('accessToken', response.data.accessToken);
        }
    }).catch((error) => {
        console.log(error.response);
    })
}

export default class DepositMoney extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountNumber: "",
            moneyAmount: "",
        }
    }

    handleInputChange = e =>{
        e.preventDefault();
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmitForm = e => {
        e.preventDefault();
        const submitForm = this.state;
        const config = {
            headers: {
                'x-access-token' : localStorage.getItem('accessToken')
            }
        }

        refresh();
        axios.post('http://localhost:8080/deposit', submitForm, config).then((response)=>{
            console.log(response);
            if(response.data.success){
                alert('Deposit successful');
            }
        }).catch((error)=>{
            console.log(error.response);
            alert(`Deposit fail: ${error.response.data.error}`);
        });
        this.setState({
            accountNumber: "",
            moneyAmount: ""
        });
    }

    render(){
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Deposit Money</h3>

                    <div className="form-group">
                        <label>Account number</label>
                        <input type="number" name="accountNumber" value={this.state.accountNumber} className="form-control" placeholder="Enter account number" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Money amount</label>
                        <input type="number" name="moneyAmount" value={this.state.moneyAmount} className="form-control" placeholder="Enter money amount" onChange={this.handleInputChange}/>
                    </div>
                    
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        );
    }
} 