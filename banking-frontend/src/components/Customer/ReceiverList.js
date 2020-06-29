import React, { Component } from 'react';
import AccountRow from './AccountRow';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import ContactRow from './ContactRow';

export default class ReceiverList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rememberName: '',
      accountNumber: 0,
      list: [{
        mRememberName: '',
        mAccountNumber: 0,
      }]
    }
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:8080/contact/${userId}`).then((response) => {
      const contactList = [...response.data];
      this.setState({ list: contactList });
    }).catch(error => {
      console.log(error);
    });
  }

  handleAddContact = e => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const postBody = {
      accessToken,
      refreshToken
    }


    const submitForm = this.state;
    const rememberName = submitForm.rememberName;
    const accountNumber = submitForm.accountNumber;
    const entity = {
      rememberName,
      accountNumber
    }
    axios.post(`http://localhost:8080/contact/${userId}/add`, entity).then((response) => {
      console.log(response.data);
      alert("Added Successfully");
      axios.get(`http://localhost:8080/contact/${userId}`).then((response) => {
        const contactList = [...response.data];
        this.setState({ list: contactList });
      }).catch(error => {
        console.log(error);
      });
    })
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div className="customer-content">

        <h3>Add Contact</h3>
        <div className="customer-content">
          <form onSubmit={this.handleAddContact} className="customer-inner">
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

          <div className="admin-content">
          
            <Table className="table table-striped table-dark" style={{marginTop: 20}}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Remember Name</th>
                  <th>Account Number</th>
                </tr>
              </thead>
              <tbody>
                {
                  
                  this.state.list.map((object, index) => (
                    
                    <ContactRow position={index + 1} obj={object} key={index} />
                  ))
                }
              </tbody>
            </Table>
          </div>

        </div>
      </div>
    )
  }
}