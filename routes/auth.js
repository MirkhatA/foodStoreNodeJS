const {Router} = require('express')
const bcrypt = require('bcryptjs') //encrypt pass
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')

const User = require('../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')

const {registerValidators} = require('../utils/validators')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        logError: req.flash('logError'),
        regError: req.flash('regError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({ email })
        const admin_id = "60b88214971fde228000d466";
        // is there such email
        if (candidate) {
            //compare pass
            const samePass = await bcrypt.compare(password, candidate.password);

            if (samePass) {
                req.session.user = candidate
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                })
            } else {
                req.flash('logError', 'password is incorrect')
                res.redirect('/auth/login#logi')
            }
        } else {
            req.flash('logError', 'Such user is not created')
            res.redirect('/auth/login#logi')
        }
    } catch (e) {
        console.log(e);
    }
})



router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body
        //if such user is in db
        const candidate = await User.findOne({email});

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        if (candidate) {
            req.flash('regError', 'User is already created')
            res.redirect('/auth/login#register');
        } else {
            const hashPass = await bcrypt.hash(password, 8)
            const user = new User({
                email, name, password: hashPass, cart: {items: []}
            })
            // save user
            await user.save()

            // send email
            await regEmail.sendEmail(email)

            res.redirect('/auth/login#login');


        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router