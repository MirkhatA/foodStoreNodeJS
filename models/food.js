const {Schema, model} = require('mongoose')

const foodSchema = new Schema({
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
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

foodSchema.method('toClient', function() {
    const food = this.toObject()

    food.id = food._id
    delete food._id

    return food
})

module.exports = model('Food', foodSchema)