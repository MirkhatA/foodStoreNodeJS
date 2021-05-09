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

//add to card 
userSchema.methods.addToCart = function(food) {
    //array of items
    const items =  [...this.cart.items]
    //find id of food in array
    const idx = items.findIndex(c => {
        return c.foodId.toString() === food._id.toString()
    })

    //is this food already in card
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } // such item is not in card
    else {
        items.push({
            foodId: food._id,
            count: 1
        })
    }

    this.cart = {items}
    return this.save()
}

module.exports = model('User', userSchema)