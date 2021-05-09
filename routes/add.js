const {Router} = require('express')
const Food = require('../models/food')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add food',
        isAdd: true
    })
})

router.post('/', async(req, res) => {
    // create new obj
    // const food = new Food(req.body.title, req.body.price, req.body.img)
    const food = new Food({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
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