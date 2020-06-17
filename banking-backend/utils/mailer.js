const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth:{
        type: "OAuth2",
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD,
        accessToken: "ya29.a0AfH6SMADO_MTOeyofIiRrtxRgIxfCn_fZ6VtjV9zFteGNe05dVylFiXfmFAaEHP71sbjT-wU0J-EZIX6mC7uNzCsEn4XRZgGfPhusyt8eRWvEicV_WUnbXg-tdlxFPF9wl_yFe9UqtVTiNT3TBBV5LE5VEKGz-OYlYU",
        refreshToken: "1//04R8hjiMFJBDDCgYIARAAGAQSNwF-L9Ir6Bu-eA7-k4g7wtIoAqKA51AB9hIKgFtKtW1hxncuY3t-DoEDez-U4qMDa-PkWoZcZSQ",
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