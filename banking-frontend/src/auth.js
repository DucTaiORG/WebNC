/* eslint-disable no-unused-expressions */
class Auth{
    constructor(){
        this.authenticated = false,
        this.userRole = ''
    }
    
    login(userName, cb){
        if(userName === 'customer'){
            this.userRole = 'customer';
            this.authenticated = true;
        }

        if(userName === 'employee'){
            this.userRole = 'employee';
            this.authenticated = true;
        }
        
        if(userName === 'admin'){
            this.userRole = 'admin';
            this.authenticated = true;
        }
        cb();
    }

    logout(cb){
        this.userRole = 0;
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