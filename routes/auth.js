const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs') //encrypt pass

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true
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
                res.redirect('/auth/login#logi')
            }
        } else {
            res.redirect('/auth/login#logi')
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body

        //if such user is in db
        const candidate = await User.findOne({email});
        if (candidate) {
            res.redirect('/auth/login#register');
        } else {
            const hashPass = await bcrypt.hash(password, 8)
            const user = new User({
                email, name, password: hashPass, cart: {items: []}
            })
            // save user
            await user.save()
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router