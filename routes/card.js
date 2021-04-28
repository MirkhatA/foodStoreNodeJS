const {Router} = require('express')
const Card = require('../models/card')
const Food = require('../models/food')
const router = Router()

router.post('/add', async (req, res) => {
    const food = await Food.getById(req.body.id)
    await Card.add(food)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const card = await Card.fetch()
    res.render('card', {
        title: 'Card',
        isCard: true,
        foods: card.foods,
        price: card.price
    })
})

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id)
    res.status(200).json(card)
})

module.exports = router