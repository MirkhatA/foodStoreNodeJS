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
    password: {
        type: String,
        required: true
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
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
    const cItems =  [...this.cart.items]
    //find id of food in array
    const idx = cItems.findIndex(c => {
        return c.foodId.toString() === food._id.toString()
    })

    //is this food already in card
    if (idx >= 0) {
        cItems[idx].count = cItems[idx].count + 1
    } // such item is not in card
    else {
        cItems.push({
            foodId: food._id,
            count: 1
        })
    }

    this.cart = {items: cItems}
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => c.foodId.toString() === id.toString());

    if (items[idx].count === 1) {
        items = items.filter(c => c.foodId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)