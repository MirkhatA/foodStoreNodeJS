const {Router} = require('express')
const bcrypt = require('bcryptjs') //encrypt pass
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const User = require('../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')

const {registerValidators} = require('../utils/validators')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

const resetEmail = require('../emails/reset')

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

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot a pass',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Recover password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(20, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/auth/reset');
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600
                await candidate.save()

                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'No such user found')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExpiration: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExpiration = undefined
            await user.save()
            res.redirect('/auth/login')

        } else {
            req.flash('loginError', 'Token is overdue')
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router