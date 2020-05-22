const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const openpgp = require('openpgp');
const config = require('./config/default.json');
require('express-async-error');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', function(req, res){
    res.json({
        msg: 'hello from nodejs',
        now: moment().valueOf()
    });

    (async () => {
        const privateKeyArmored =  config.privatePGPArmored; // encrypted private key
        console.log(privateKeyArmored);
        
        const publicKeyArmored = config.publicPGPArmored;
        const passphrase = config.passpharse; // what the private key is encrypted with
     
        const { keys: [privateKey] } =  await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(passphrase);

        const { data: cleartext } = await openpgp.sign({
            message: openpgp.cleartext.fromText('Hello, World!'), // CleartextMessage or Message object
            privateKeys: [privateKey]                             // for signing
        });
        console.log(cleartext);

        const verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(cleartext),              // CleartextMessage or Message object
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys // for verification
        });

        const { valid } = verified.signatures[0];
        if (valid) {
            console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
        } else {
            throw new Error('signature could not be verified');
        }
    })();
})

app.use('/api/taikhoan', require('./routes/taikhoan.route'));
app.use('/api/noptien', require('./routes/noptien.route'));

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