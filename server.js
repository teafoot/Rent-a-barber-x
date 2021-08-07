const dotEnv = require('dotenv').config();
const dbConnection = require('./database/connection')();
const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const createError = require('http-errors'); // 404
const cookieParser = require('cookie-parser'); // alternative to localStorage jwt token
// const session = require('express-session'); // for flash
// const flash = require('connect-flash'); // flash messages
var morgan = require('morgan') // logs

const app = express();
app.use(morgan('dev'))
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout',
        helpers: require('./helper/handlebars'),
        handlebars: allowInsecurePrototypeAccess(Handlebars) // Solves Handlebars: Access has been denied to resolve the property "email" because it is not an "own property" of its parent.
    })
);
app.set('view engine', 'handlebars');
app.use(bodyParser.json());// support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true }));//support parsing of application/x-www-form-urlencoded post data
app.use(express.static(path.join(__dirname, 'public')));// static files

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// app.use(session({
    // cookie: { maxAge: 60000 },
    // secret: process.env.SESSION_SECRET_KEY,
    // resave: false,
    // saveUninitialized: false
// }));
// app.use(flash());

const nm_dependencies = ['jquery', 'popper.js', 'bootstrap', 'admin-lte', 'bootswatch', '@fortawesome', 'paginationjs', 'normalize.css', 'socket.io-client']; // keep adding required node_modules 
nm_dependencies.forEach(dep => {
    app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

app.use('/', require('./routes/webRoutes'));
// app.use('/api/home', require('./routes/homeApiRoutes')); // for pagination purposes
app.use('/api/user', require('./routes/userApiRoutes'));
app.use('/api/barbershop', require('./routes/barbershopApiRoutes'));
app.use('/api/messages', require('./routes/messageApiRoutes'));
app.use('/api/appointment', require('./routes/appointmentApiRoutes'));
app.use('/api/product', require('./routes/productRoutes'));
// 404 not found
app.use((req, res, next) => {
    next(createError(404, 'Page not found'));
})
// Custom Exception handling
app.use(function (err, req, res, next) {
    // console.error(err.stack);
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
});

const server = http.createServer(app);
const io = socketio(server);
//Allow Cross Domain Requests
io.set('transports', ['websocket']);
io.on('connection', socket => {
    console.log('socket.io connection was established')
    
    socket.on('disconnect', () => {// Runs when client disconnects (goes to another url)
    });
})
const messageService = require('./service/messageService')
messageService.sendMessageToUserSocket(io) // Socket.io - listen events in separate files

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
    // console.log(`Server listening on port ${PORT}`);
// });
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));