const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth:{
        type: "OAuth2",
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD,
        accessToken: "ya29.a0AfH6SMDV4PUxcOljs4coNmFScp38AuCZz8Sn50uxOn2frIlJvEElmoPC4G6slgc7ld8zEIes2oYevsV-lk0sj_25zZojhvOELmWHbn2bGfEanJh5A3gNZknG3l20gYIOTNECDdrh5pT-EDGziv7a28FGZRl7feOsQlo",
        refreshToken: "1//04C5QYVnqQU4MCgYIARAAGAQSNwF-L9Irulg4iIqy8jk-xUR39R1YgFG3CeV35Er1XEOoKlvxucsurc36xEB4sk67PFLJmm2azTY",
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