const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth:{
        type: "OAuth2",
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD,
        accessToken: "ya29.a0AfH6SMD7NyJumeCX4ffF58yrrXD0SdWKwfN8tjt9aran9jR6Eu8II0uzGw3IHbHFPPIOXfJIhbNYxzzEafgSc1j8jTCOMqBOK3_0XVev-GyL031g_FS5GYPPbb9Xo8xGhtlWf7hznCQHQSF4EIITTzjLAbVfJgRmFq0",
        refreshToken: "1//04DFELocT_c6iCgYIARAAGAQSNwF-L9IrxgnI2KWpBhgXFoFs1jur4ud6VY34Ii_HwUlZng50Oq3JwxU_shphhn8aUQnTxL-MK1A",
        clientId: "350798295911-af0qginemf9jvs1tvpuoquiamh3kt4fk.apps.googleusercontent.com",
        clientSecret: "g7GmqXtK8GMoJz9CFubTmWG2",
        accessUrl: "http://oauth2.googleapis.com/token"
    },
    tls:{
        rejectUnauthorized: false
    }
});

module.exports = {
    sendEmail: (from, to, subject, html)=>{
        return new Promise((resolve, reject)=>{
            transport.sendMail({
                from,
                subject,
                to,
                html
            }, (err, info)=>{
                if(err) reject(err);

                resolve(info);
            });
        });
    }
}