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
}

module.exports = Food