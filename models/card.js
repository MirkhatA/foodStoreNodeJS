const path = require('path')
const fs = require('fs')

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data',
    'card.json'
)

class Card {
    static async add(food) {
        const card = await Card.fetch()

        const idx = card.foods.findIndex(c => c.id === food.id)
        const candidate = card.foods[idx]

        if (candidate) {
            // food added
            candidate.count++
            card.foods[idx] = candidate
        } else {
            // need to add
            food.count = 1
            card.foods.push(food)          
        }

        card.price += +food.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err=> {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const card = await Card.fetch()

        const idx = card.foods.findIndex(c => c.id === id)
        const food = card.foods[idx]

        if (food.count === 1) {
            // delete
            card.foods = card.foods.filter(c => c.id !== id)
        } 
        else {
            card.foods[idx].count--
        }

        card.price -= food.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err=> {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}

module.exports = Card