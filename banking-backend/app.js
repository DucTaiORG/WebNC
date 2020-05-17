const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
require('express-async-error');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', function(req, res){
    res.json({
        msg: 'hello from nodejs',
        now: moment().valueOf()
    });
})

app.use('/api/taikhoan', require('./routes/taikhoan.route'));

app.use((req, res, next) => {
    res.status(404).send('RESOURCE NOT FOUND!');
})

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('View error on console log');
})

const PORT = 3000;
app.listen(PORT, _=>{
    console.log("API is running on port 3000");
})