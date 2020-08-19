const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const userModel = require('./models/users.model');

const cors = require('cors');
const {verifyUser, verifyEmployee, verifyAdmin} = require('./middlewares/auth.mdw');
require('express-async-error');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', function(req, res){
    res.json({
        msg: 'hello from nodejs',
        now: moment().valueOf()
    });
});

app.use('/api/user', require('./routes/users.external.route'));
app.use('/api/transfer', require('./routes/transfer.external.route'));
app.use('/client/rsa', require('./routes/linkrsa.route'));
app.use('/client/pgp', require('./routes/linkpgp.route'));
app.use('/client/pgp2', require('./routes/linkpgp2.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/user', verifyUser, require('./routes/users.internal.route'));
app.use('/deposit', verifyEmployee, require('./routes/deposit.route'));
app.use('/employee', verifyAdmin, require('./routes/employee.route'));
app.use('/partner', verifyAdmin, require('./routes/partner.route'));
app.use('/account', verifyUser, require('./routes/account.route'));
app.use('/transfer', verifyUser, require('./routes/transfer.internal.route'));
app.use('/transferExt', require('./routes/transfer.external.route'));
app.use('/contact', require('./routes/contact.route'));
/*app.get('/test', (req, res)=>{
    return res.json({rand: randToken.generator({
        chars: '123456789'
    }).generate(9)});
})*/

//api register
app.post('/register', verifyEmployee, async (req, res)=>{
    console.log(req.body);
    const rows = await userModel.singleByUserName(req.body.username);
    if(rows.length){
        return res.status(400).json({error: 'Username exist'});
    }
    const result = await userModel.add(req.body);
    if(result !== null){
        const ret = {
            id: result.insertId,
            ...req.body
        }
    
        delete ret.password;
        return res.status(201).json(ret); 
    }else{
        const error = "Can not create payment account";
        return res.status(500).json({error});
    }
});

app.use('/forgot', require('./routes/forgot.route'));

app.use((req, res, next) => {
    res.status(404).send('RESOURCE NOT FOUND!');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).send('View error on console log');
    next();
});

app.listen(process.env.PORT || 8080, _=>{
    console.log("API is running");
});