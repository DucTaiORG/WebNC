/* eslint-disable no-unused-expressions */
import axios from 'axios';

class Auth{
    constructor(){
        this.authenticated = false,
        this.userRole = '',
        this.userId = 0
    }

    login(entity, cb, cb2){
        axios.post('http://localhost:8080/api/auth/login', entity).then((response) => {
            if(response.data.authenticated === true){
                console.log(response);
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userId', response.data.userId);
                this.authenticated = true;
                const authen = response.data.userRole;
                if(authen === 1){
                    this.userRole = 'customer';
                }
                if(authen === 2){
                    this.userRole = 'employee';
                    this.userId = response.data.userId;
                }
                if(authen === 3){
                    this.userRole = 'admin';
                }
                cb();
            }else{
                cb2();
            }
        }).catch(function(error){
            console.log(error);
            cb2();
        });
    }

    logout(cb){
        this.userRole = '';
        this.authenticated = false;
        cb();
    }

    isAuthenticated(){
        return this.authenticated;
    }

    getUserRole(){
        return this.userRole;
    }

    getUserId(){
        return this.userId;
    }
}

export default new Auth();