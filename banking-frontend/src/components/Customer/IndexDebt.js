import React, {Component} from 'react';
import TableRow from './TableRow';
import axios from 'axios';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            persons: [
                {
                    id: 1,
                    fullname: 'Lâm Đức Tài',
                    username: 'employee',
                    email: 'ductai@gmail.com',
                    phoneNo: '0908960580',
                    dateOfBirth: '18/10/1998'
                }
            ]};
    }

    componentDidMount() {
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
                axios.get('http://localhost:8080/employee/all', config).then(response => {
                    console.log(response.data);
                    this.setState({persons: response.data});
                }).catch(function (error) {
                    console.log(error.response);
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleDelete = id => {
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
                        'x-access-token' : localStorage.getItem('accessToken')
                    }
                }
    
                axios.get('http://localhost:8080/employee/delete/' + id, config).then((response) =>{
                    console.log(response.data);
                    if(response.data.affectedRows){
                        alert('Delete success');
                        this.setState({persons: this.state.persons.filter(emp => emp.id !== id)});
                    }else{
                        alert('Can not edit');
                    }
                }).catch(function (error){
                    console.log(error);
                    alert(error)
                })
            }
        }).catch((error) => {
            console.log(error.response);
        })
      }

    render() {
        return (
            <div className="admin-content">
                <table className="table table-striped table-dark" style={{marginTop: 20}}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Date of birth</th>
                        <th colSpan="2">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.persons.map((object, index)=>{
                            return <TableRow obj={object} key={index} handelDel={this.handleDelete}/>
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}