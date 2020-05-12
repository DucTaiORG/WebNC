const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', function(req, res){
    res.json({
        msg: 'hello from nodejs'
    });
})

const PORT = 3000;
app.listen(PORT, _=>{
    console.log("API is running on port 3000");
})