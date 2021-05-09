const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String, 
        required: true
    },
    name: { 
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    reqiured: true,
                    default: 1
                },
                foodId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Food',
                    required: true
                }
            }
        ]
    }
})

module.exports = model('User', userSchema)