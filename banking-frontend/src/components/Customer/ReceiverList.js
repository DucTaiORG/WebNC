import React, { Component } from 'react';
import Receiver from './Receiver';
import Auth from '../../auth';
import axios from 'axios';
import moment from 'moment';

export default class ReceiverList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rememberName: '',
      accountNumber: 0,
    }
  }

  handleAddContact = () => {
    const userId = localStorage.getItem('userId');

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const postBody = {
      accessToken,
      refreshToken
    }



    axios.post(`http://localhost:8080/contact/${userId}/add`, this.state).then((response) => {
      console.log(response.data);
      alert("Added Successfully");
    })


  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>

        <h3>Add Contact</h3>
        <form onSubmit={this.handleAddContact}>
          <div className="form-group">
            <label>Remember Name:  </label>
            <input name="rememberName" type="text" className="form-control" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Account Number: </label>
            <input name="accountNumber" type="text" className="form-control" onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <input type="submit" value="Add" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}