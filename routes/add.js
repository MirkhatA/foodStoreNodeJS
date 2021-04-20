const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add food',
        isAbout: true
    })
})


router.post('/', (req, res) => {
    console.log(req.body)

    res.redirect('/menu')
})

module.exports = router