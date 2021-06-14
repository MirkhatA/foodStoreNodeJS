const keys = require('../keys')

const sgMail = require('@sendgrid/mail')
const sgMailApiKey = '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'

sgMail.setApiKey(sgMailApiKey)

module.exports.sendEmail = (email) => {
    const msg = {
        to: email,
        from: 'mirkhat.a@gmail.com',
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

