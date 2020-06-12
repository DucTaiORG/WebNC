import React, {Component} from 'react';

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
        console.log(this.state);
    }

    render(){
        return (
            <div className="auth-inner">
                <form onSubmit={this.handleSubmitForm}>
                    <h3>Deposit Money</h3>

                    <div className="form-group">
                        <label>Account number</label>
                        <input type="number" name="accountNumber" className="form-control" placeholder="Enter account number" onChange={this.handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Money amount</label>
                        <input type="number" name="moneyAmount" className="form-control" placeholder="Enter money amount" onChange={this.handleInputChange}/>
                    </div>
                    
                    <button className="submit-button" type="submit" className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        );
    }
} 