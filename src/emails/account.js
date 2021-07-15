const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxb62f1bb8c4dd4f37948cbd5517b3fec6.mailgun.org';
const API_KEY = process.env.MAILGUN_API_Key;
const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});

const sendWelcomeEmail = (email, name) => {
    mg.messages().send({
        from: 'toushif.haq@gmail.com',
        to: email,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }, function (error, body) {
        console.log(body);
    });
}

const sendCancellationEmail = (email, name) => {
    mg.messages().send({
        from: 'toushif.haq@gmail.com',
        to: email,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }, function (error, body) {
        console.log(body);
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}