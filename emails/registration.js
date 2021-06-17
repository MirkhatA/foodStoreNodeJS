const keys = require('../keys')

const sgMail = require('@sendgrid/mail')
const sgMailApiKey = keys.SENDGRID_API_KEY

sgMail.setApiKey(sgMailApiKey)

module.exports.sendEmail = (email) => {
    const msg = {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'registration form',
        text: 'test',
        html: '<p>test text</p>'
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
}

