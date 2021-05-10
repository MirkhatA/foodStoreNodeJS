const {Router} = require('express')
const Food = require('../models/food')
const router = Router()

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.foodId._doc, 
        id: c.foodId.id,
        count: c.count
    }))
}

function computePrice(foods){
    return foods.reduce((total, food) => {
        return total += food.price * food.count;
    }, 0)
}


router.post('/add', async(req, res) => {
    const food = await Food.findById(req.body.id)
    await req.user.addToCart(food)

    // redirect
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id) //send id of food
    const user = await req.user.populate('cart.items.foodId').execPopulate()

    const foods = mapCartItems(user.cart)
    const cart = {
        foods, price: computePrice(foods)
    }

    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user
    .populate('cart.items.foodId')
    .execPopulate()

    const foods = mapCartItems(user.cart)

    res.render('card', {
        title: 'Card',
        isCard: true,
        foods: foods,
        price: computePrice(foods)
    })
})

module.exports = router