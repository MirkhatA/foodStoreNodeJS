const {Schema, model} = require('mongoose')

const food = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String
    }
})



module.exports = model('Food', food)