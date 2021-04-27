const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')

class Food {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img 
        this.id = uuid()
    }

    toJSON() {
        return{
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    // update method
    static async update(food) {
        const foods = await Food.getAll()

        const idx = foods.findIndex(c => c.id === food.id)
        foods[idx] = food

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'foods.json'),
                JSON.stringify(foods),
                (err) => {
                    if (err) {
                       reject(err) 
                    }
                    else {
                        resolve()
                    }
                }
            )    
        })
    }

    // save method
    async save() {
        const foods = await Food.getAll();
        foods.push(this.toJSON())
        
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'foods.json'),
                JSON.stringify(foods),
                (err) => {
                    if (err) {
                       reject(err) 
                    }
                    else {
                        resolve()
                    }
                }
            )    
        })

        console.log('Foods', foods)
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'foods.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(JSON.parse(content))
                    }                    
                }
            )
        })
    }

    static async getById(id) {
        const foods = await Food.getAll()
        return foods.find(c => c.id === id)
    }
}

module.exports = Food