const dotEnv = require('dotenv').config();
const dbConnection = require('./database/connection')();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        status: 500,
        message: err.message,
        body: {}
    });
});

app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/product', require('./routes/productRoutes'));

app.get('/', (req, res, next) => {
    res.send('Hello from Node API Server');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
