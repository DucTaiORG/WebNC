const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth:{
        type: "OAuth2",
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD,
        accessToken: "ya29.a0AfH6SMCijjr_UsF7GG8q4-PUqfpcm7bMoQgKmh_FXdBySCyksghc0DfEqqidSEXiMGhHQoP2FmK4jZ6WJZuEyoDLpcSjzEZz4x-6r-zSKQeLAJavnlfLMqVv9DztrMgM4oN-S13041VtVqyJm5s4VXfVO-UVjURW2jc",
        refreshToken: "1//04ehz45CYMRqfCgYIARAAGAQSNwF-L9IruBxx-M628yXBjALlf_cKSczLWdaJ5RMqMNAvavjJ2-Mem4J_GC1ThvJNNYu_CKnKqcE",
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