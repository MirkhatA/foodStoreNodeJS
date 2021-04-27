const {Router} = require('express')
const Food = require('../models/food')
const router = Router()

// menu page
router.get('/', async (req, res) => {
    const foods = await Food.getAll()
    res.render('foods', {
        title: 'Menu',
        isFoods: true,
        foods
    })
})

// food edit page
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const food = await Food.getById(req.params.id)

    res.render('food-edit', {
        title: 'Edit ${food.title}',
        food
    })
})

router.post('/edit', async (req, res) => {
    await Food.update(req.body)
    res.redirect('/foods')
})

// food detail
router.get('/:id', async (req, res) => {
    const food = await Food.getById(req.params.id)
    res.render('food', {
        layout: 'empty',
        title: 'Food ${food.title}',
        food
    })
})

module.exports = router