const keys = require('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'password recovery',
        text: 'test',
        html: `
                <p>Recover password</p>
                <p><a href="${keys.BASE_URL}/auth/password/${token}">Recover</a></p>
                `
    }
}