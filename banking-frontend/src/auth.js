/* eslint-disable no-unused-expressions */
import axios from 'axios';

class Auth{
    constructor(){
        this.authenticated = false,
        this.userRole = ''
    }

    login(entity, cb){
        axios.post('http://localhost:8080/api/auth/login', entity).then((response) => {
            if(response.data.authenticated === true){
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                this.authenticated = true;
                const authen = response.data.userRole;
                if(authen === 1){
                    this.userRole = 'customer';
                }
                if(authen === 2){
                    this.userRole = 'employee';
                }
                if(authen === 3){
                    this.userRole = 'admin';
                }
                cb();
            }else{
                alert('Login fail');
            }
        }).catch(function(error){
            console.log(error);
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
}

export default new Auth();