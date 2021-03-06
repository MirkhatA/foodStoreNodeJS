const {Router} = require('express')
const Food = require('../models/food')
const auth = require('../middleware/auth')
const router = Router()

// add middleware for private pages
router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add food',
        isAdd: true
    })
})


// add food
router.post('/', async(req, res) => {
    // create new obj
    const food = new Food({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        // save model in db
        await food.save()
        res.redirect('/foods') //redirect
    } catch (e) {
        console.log(e)
    } 
})

module.exports = router