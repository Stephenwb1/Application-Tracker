require('dotenv').config();

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const jobRoutes = require('./routes/jobs')

//express app
const app = express();

//middleware
app.use(express.json());

//cors middleware
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}
app.use(cors(corsOptions))

//logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/jobs', jobRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 4211, () => {
            console.log('connected to db; listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })