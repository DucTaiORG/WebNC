const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth:{
        type: "OAuth2",
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD,
        accessToken: "ya29.a0AfH6SMC8jnFypS5Vwqm-c7GMdkvyhhhQlYgOx8T2IU0yNMWYO1OdarBlpEK7HQld5cbxBLL7NKMSnvvxwQpHFOjU9aM_RJQnxJPUVveqBIDdhD_8vu6TzDivFycY3_8-lGFPvlFvt2prehxfjNCq0dvx3rc1fqoolT8",
        refreshToken: "1//04sEs2OpM2U_ZCgYIARAAGAQSNwF-L9Ir5mV_roTsSJMq9K1mtgN15PM-nHoGL0YxVwFFEPHpPUmAhBgGwvsjK0GrPkaP5SdRyZw",
        clientId: "350798295911-af0qginemf9jvs1tvpuoquiamh3kt4fk.apps.googleusercontent.com",
        clientSecret: "g7GmqXtK8GMoJz9CFubTmWG2"
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