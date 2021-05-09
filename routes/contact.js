const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('contact', {
        title: 'Contacts',
        isHome: true
    })
})


module.exports = router