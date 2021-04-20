const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const app = express()

const aboutRoutes = require('./routes/about')
const menuRoutes = require('./routes/menu')
const contactsRoutes = require('./routes/contacts')
const addRoutes = require('./routes/add')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) //register hbs in engine
app.set('view engine', 'hbs') //use it
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/menu', menuRoutes)
app.use('/about', aboutRoutes)
app.use('/contacts', contactsRoutes)
app.use('/add', addRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})