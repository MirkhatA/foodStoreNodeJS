const express = require('express'); // express connection
const path = require('path'); // module path
const exphbs = require('express-handlebars') // handlebars
const mongoose = require('mongoose');
const session = require('express-session');

const homeRoutes = require('./routes/home') //home route
const addRoutes = require('./routes/add')
const foodRoutes = require('./routes/foods')
const contactRoutes = require('./routes/contact')
const aboutRoutes = require('./routes/about')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const varMiddleware = require('./middleware/variables')

const User = require('./models/user')

const app = express(); // app is result of function express is analogue of server

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})




// add hbs into express
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(varMiddleware)

// render pages
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/foods', foodRoutes)
app.use('/contact',contactRoutes)
app.use('/about',aboutRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)



// port
const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://mirkhat:vSMJcE5TdYsFKg3@cluster0.hxsu9.mongodb.net/foodstore`;
        //mongodb connection
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        //is there users
        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'asen.mirkhat@bk.ru',
        //         name: 'Mirkhat',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }


        //run server
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();



