const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    link: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('Job', jobSchema)