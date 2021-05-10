const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
    res.render('orders', {
        isOrder: true,
        title: 'Orders'
    })
})



router.post('/', async (req, res) => {
    try {
        const user = await req.user
        .populate('cart.items.foodId')
        .execPopulate();
    
        const foods = user.cart.items.map(i => ({
            count: i.count,
            food: {...i.foodId._doc}
        }))
    
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            foods: foods
        })
    
        await order.save()
        await req.user.clearCart()
    
        res.redirect('/orders')
    } catch(e) {
        console.log(e);
    }
})

module.exports = router