const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const envFilePath = path.join(__dirname, 'pre-start/env/development.env');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//Use cookie-parser middleware
app.use(cookieParser());

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));

require('dotenv').config({ path: envFilePath });

const PORT = process.env.PORT || 5000;

// allow the app to use cookieparser
app.use(helmet());

//Route init
const baseRouter = require('./routes/index.route');

//MongoDB
const db = require('./config/db/index.db');
const { Console } = require('console');

// parse application/json
app.use(bodyParser.json())

//Connect to DB
db.connect();

app.use(morgan('combined'));

//Static file
app.use(express.static(path.join(__dirname, '../../shopping_frontend/assets')));

//su dung thu vien js hay code js de submit
app.use(express.json());

//middelware dung de xu ly du lieu tu form submit len
app.use(
    express.urlencoded({
        extended: true,
    }),
);

//Routes init
app.use('/api', baseRouter);

//test
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// })

// const publicId = 'shopping-nodejs/image-products/yclu6drjolff77k1qjvs';

// cloudinary.uploader.callApi(deleteUrl, 'DELETE', {}, (error, result) => {
//     if (error) {
//         console.error('Lỗi khi xóa ảnh:', error);
//     } else {
//         console.log('Xóa ảnh thành công:', result);
//     }
// });

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});