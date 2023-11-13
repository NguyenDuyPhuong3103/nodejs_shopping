const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const path = require('path')
// const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const envFilePath = path.join(__dirname, 'pre-start/env/development.env')

const app = express()

//Use cookie-parser middleware
app.use(cookieParser())
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions = {
    origin: true,
    credentials: true,
}

app.use(cors(corsOptions))

require('dotenv').config({ path: envFilePath })

const PORT = process.env.PORT || 5000

//su dung thu vien js hay code js de submit
app.use(express.json())

//middelware dung de xu ly du lieu tu form submit len
app.use(express.urlencoded({ extended: true }))

// allow the app to use cookieparser
app.use(helmet())

//Route init
const baseRouter = require('./routes/index.route')

//MongoDB
const db = require('./config/db/index.db')
const { Console } = require('console')

// // parse application/json
// app.use(bodyParser.json())

app.use(morgan('combined'))

//Static file
app.use(express.static(path.join(__dirname, '../../shopping_frontend/assets')))

//Routes init
app.use('/api', baseRouter)

//Connect to DB
db.connect()

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})