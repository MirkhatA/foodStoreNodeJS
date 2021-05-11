const express = require('express'); // express connection
const path = require('path'); // module path
const exphbs = require('express-handlebars') // handlebars
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)

const homeRoutes = require('./routes/home') //home route
const addRoutes = require('./routes/add')
const foodRoutes = require('./routes/foods')
const contactRoutes = require('./routes/contact')
const aboutRoutes = require('./routes/about')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const User = require('./models/user')
const MONGODB_URI = `mongodb+srv://mirkhat:vSMJcE5TdYsFKg3@cluster0.hxsu9.mongodb.net/foodstore`;
const app = express(); // app is result of function express is analogue of server

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
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
    saveUninitialized: false,
    store: store
}))

app.use(varMiddleware)
app.use(userMiddleware)

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
        //mongodb connection
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        //run server
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();



