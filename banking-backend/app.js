const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const cors = require('cors');
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
})

app.use('/api/taikhoan', require('./routes/taikhoan.route'));
app.use('/api/noptien', require('./routes/noptien.route'));
app.use('/client/rsa', require('./routes/linkrsa.route'))

app.use((req, res, next) => {
    res.status(404).send('RESOURCE NOT FOUND!');
})

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('View error on console log');
    next();
})


app.listen(process.env.PORT || 8080, _=>{
    console.log("API is running");
})