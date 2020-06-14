const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const userModel = require('./models/users.model');
const cors = require('cors');
const {verify, verifyEmployee} = require('./middlewares/auth.mdw');
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

app.use('/api/user', require('./routes/users.route'));
app.use('/api/transfer', require('./routes/transferMoney.route'));
app.use('/client/rsa', require('./routes/linkrsa.route'));
app.use('/client/pgp', require('./routes/linkpgp.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/user', verify, require('./routes/users.internal.route'));
app.use('/deposit', verifyEmployee, require('./routes/deposit.route'));

//api register
app.post('/user/register', verifyEmployee, async (req, res)=>{
    console.log(req.body);
    const result = await userModel.add(req.body);
    const ret = {
        id: result.insertId,
        ...req.body
    }

    delete ret.password;
    res.status(201).json(ret); 
});

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