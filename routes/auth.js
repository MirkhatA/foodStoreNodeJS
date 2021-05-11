const {Router} = require('express')
const router = Router()
const User = require('../models/user')

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
    const user = await User.findById('60982b51f2313757d08b4564')

    req.session.user = user
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    })
})

module.exports = router