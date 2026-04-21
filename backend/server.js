require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jobRoutes = require('./routes/jobs')
const userRoutes = require('./routes/user')

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://') || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
            callback(null, true)
        } else {
            console.log('CORS blocked origin:', origin)
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

// Connect to MongoDB (cached across warm serverless invocations)
let dbConnected = false
const connectDB = async () => {
    if (dbConnected) return
    await mongoose.connect(process.env.MONGO_URI)
    dbConnected = true
}

app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' })
    }
})

app.use('/api/jobs', jobRoutes)
app.use('/api/user', userRoutes)

// Local dev: start the server normally
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4000
    connectDB()
        .then(() => app.listen(PORT, () => console.log('connected to db; listening on port', PORT)))
        .catch(console.error)
}

module.exports = app
