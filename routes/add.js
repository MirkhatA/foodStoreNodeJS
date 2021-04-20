const {Router} = require('express')
const Food = require('../models/food')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add food',
        isAbout: true
    })
})


router.post('/', async (req, res) => {
    // console.log(req.body)
    const food = new Food(req.body.title, req.body.price, req.body.img)

    await food.save()

    res.redirect('/foods')
})

module.exports = router