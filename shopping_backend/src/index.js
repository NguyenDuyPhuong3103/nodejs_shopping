const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const port = 3000

//Route init
const baseRouter = require('./routes/index.route');

//MongoDB
const db = require('./config/db/index.db');
const { Console } = require('console');

//Connect to DB
db.connect();

app.use(morgan('combined'));

app.use(cors())

//Static file
app.use(express.static(path.join(__dirname, '../../shopping_frontend/assets')));

//middelware dung de xu ly du lieu tu form submit len
app.use(
    express.urlencoded({
        extended: true,
    }),
);

//su dung thu vien js hay code js de submit
app.use(express.json());

//Routes init
app.use('/api', baseRouter);

app.listen(port, () => { 
    console.log(`App listening at http://localhost:${port}`);
});