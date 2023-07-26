const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const port = 3000

//Route init
const route = require('./routes/index.route');

//MongoDB
const db = require('./config/db/index.db');

//Connect to DB
db.connect();

//Static file
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(morgan('combined'));

app.use(cors())

//Routes init
route(app);

app.listen(port, () => { 
    console.log(`App listening at http://localhost:${port}`); 
});