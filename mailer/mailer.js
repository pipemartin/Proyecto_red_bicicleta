const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
/*
info mail
NB! these credentials are shown only once. If you do not write these down then you have to create a new account.
Name	Ottis Wintheiser
Username	ottis.wintheiser87@ethereal.email (also works as a real inbound email address)
Password	1zSt4GsVY5jWGJSCaz
*/

/* let mailConfig;
if (process.env.NODE_ENV === 'production'){
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);

} else {
    if (process.env.NODE_ENV === 'staging'){
        console.log('XXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }
        mailConfig = sgTransport(options);

    } else {
        // all emails are catched by ethereal.email

        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pwd
            }
        };
    }
}
 */

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'alda.kuhlman@ethereal.email',
        pass: 'v5RSFS8xnvUXPeAyAx'
    }
};


module.exports = nodemailer.createTransport(mailConfig);