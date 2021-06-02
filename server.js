const dotEnv = require('dotenv').config();
const dbConnection = require('./database/connection')();
const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const createError = require('http-errors'); // 404
const cookieParser = require('cookie-parser'); // alternative to localStorage jwt token

const app = express();
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

const nm_dependencies = ['jquery', 'popper.js', 'bootstrap', 'admin-lte']; // keep adding required node_modules 
nm_dependencies.forEach(dep => {
    app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

app.use('/', require('./routes/webRoutes'));
app.use('/api/user', require('./routes/userApiRoutes'));
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

app.get('/', (req, res, next) => {
    res.send('Hello from Node API Server');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
