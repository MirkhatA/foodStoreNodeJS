const {body} = require('express-validator/check')

exports.registerValidators = [
    body('email').isEmail().withMessage('email is incorrect!'),
    body('password', 'your password must contain more than 6 elements').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are not same')
        }
        return true;
    }),
    body('name').isLength({min: 3}).withMessage('min 3 symbols')
]

