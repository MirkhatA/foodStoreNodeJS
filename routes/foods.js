const {Router} = require('express')
const Food = require('../models/food')
const { route } = require('./add')
const auth = require('../middleware/auth')
const router = Router()

//get all foods from db
router.get('/', async (req, res) => {
    try {
        const foods = await Food.find()
            .populate('userId', 'email name')
            .select('price title img')

        res.render('foods', {
            title: 'Food',
            isFood: true,
            userId: req.user ? req.user._id.toString() : null,
            foods
        })
    } catch (e) {
        console.log(e);
    }
    

})

//get food
router.get('/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
        res.render('food', {
            layout: 'empty',
            title: `Food ${food.title}`,
            food
        })
    } catch(e) {
        console.log(e);
    }
})

//edit food by id
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const food = await Food.findById(req.params.id)

        if (food.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/foods')
        }

        res.render('food-edit', {
            title: `Edit ${food.title}`,
            food
        })
    } catch (e) {
        console.log(e);
    }



})

//update
router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body;
        delete req.body.id;

        const food = await Food.findById(id)

        if (food.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/foods')
        }
        Object.assign(food, req.body)
        await food.save()
        res.redirect('/foods');
    } catch (e) {
        console.log(e);
    }

})

// delete method
router.post('/remove', auth, async (req, res) => {
    try {
        await Food.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/foods');
    } catch(e) {
        console.log(e);
    }
})

module.exports = router