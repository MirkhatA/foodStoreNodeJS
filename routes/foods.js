const {Router} = require('express')
const Food = require('../models/food')
const router = Router()

router.get('/', async (req, res) => {
    const foods = await Food.getAll()
    res.render('foods', {
        title: 'Menu',
        isFoods: true,
        foods
    })
})

router.get('/:id', (req, res) => {
    res.render('food')
})

module.exports = router