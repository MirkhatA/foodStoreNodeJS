const {Router} = require('express')
const Food = require('../models/food')
const { route } = require('./add')
const router = Router()

//get all foods from db
router.get('/', async (req, res) => {
    const foods = await Food.find()
    res.render('foods', {
        title: 'Food',
        isFood: true,
        foods
    })
})

//get food
router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id)
    res.render('food', {
        layout: 'empty',
        title: `Food ${food.title}`,
        food
    })
})

//edit food by id
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const food = await Food.findById(req.params.id)

    res.render('food-edit', {
        title: `Edit ${food.title}`,
        food
    })
})

//update
router.post('/edit', async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    await Food.findByIdAndUpdate(id, req.body);
    res.redirect('/foods');
})

module.exports = router