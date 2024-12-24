const Job = require('../models/jobModel')
const mongoose = require('mongoose')

//get all the jobs
const getJobs = async (req, res) => {
    const jobs = await Job.find({}).sort({createdAt: -1})

    res.status(200).json(jobs)
}

//get a single job
const getJob = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {//checks if the ID is valid
        return res.status(404).json({error: 'No such job'})
    }

    const job = await Job.findById(id)

    if (!job) {
        return res.status(404).json({error: "No such job"})
    }

    res.status(200).json(job)
}

//create a new job
const createJob = async (req, res) => {
    const {company, title, link} = req.body

    let emptyFields = []

    if(!company) {
        emptyFields.push('company')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    try {
        const job = await Job.create({company, title, link})
        res.status(200).json(job)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

//delete a job
const deleteJob = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {//checks if the ID is valid
        return res.status(404).json({error: 'No such job'})
    }

    const job = await Job.findOneAndDelete({_id: id})

    if (!job) {
        return res.status(404).json({error: "No such job"})
    }
    
    res.status(200).json(job)
}

//update a job
const updateJob = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {//checks if the ID is valid
        return res.status(404).json({error: 'No such job'})
    }

    const job = await Job.findOneAndUpdate({_id: id}, {
        ...req.body //spreading out body? idk how this works
    })

    if (!job) {
        return res.status(404).json({error: "No such job"})
    }
    
    res.status(200).json(job)
}


//export stuff
module.exports = {
    getJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob
}