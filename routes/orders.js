const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
    try {
        // list of orders
        const orders = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.foods.reduce((total, c) => {
                        return total += c.count * c.food.price
                    }, 0)
                }
            })
        })
    } catch(e) {
        console.log(e)
    }
})



router.post('/', async (req, res) => {
    try {
        const user = await req.user
        .populate('cart.items.foodId')
        .execPopulate();
    
        const food = user.cart.items.map(i => ({
            count: i.count,
            food: {...i.foodId._doc}
        }))
    
        const orders = new Order({
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