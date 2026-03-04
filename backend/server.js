require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jobRoutes = require('./routes/jobs')
const userRoutes = require('./routes/user')

//express app
const app = express();

//middleware
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/jobs', jobRoutes)
app.use('/api/user', userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db; listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })