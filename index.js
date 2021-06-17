const express = require('express'); // express connection
const path = require('path'); // module path
const csrf = require('csurf')
const flash = require('connect-flash')

const mongoose = require('mongoose');
const exphbs = require('express-handlebars') // handlebars
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
const profileRoutes = require('./routes/profile')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')

const keys = require('./keys')
const app = express(); // app is result of function express is analogue of serve

const adminId = "60b88214971fde228000d466";

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

// add hbs into express
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'images')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
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
app.use('/profile', profileRoutes)

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'mirkhat.asen@bk.ru', // Change to your recipient
    from: 'asen.mirkhat@bk.ru', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

// port
const PORT = process.env.PORT || 4000

async function start() {
    try {
        //mongodb connection
        await mongoose.connect(keys.MONGODB_URI, {
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

//testtesttest


