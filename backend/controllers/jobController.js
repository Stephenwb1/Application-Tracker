const Job = require('../models/jobModel')
const mongoose = require('mongoose')

//get all the jobs
const getJobs = async (req, res) => {
    const user_id = req.user._id
    const jobs = await Job.find({ user_id }).sort({createdAt: -1})

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

//get a list of jobs
const getSearch = async (req, res) => {
    const searchTerm = req.query.q; 
  
  if (!searchTerm) {
    return res.status(400).json({ message: 'No search term provided' });
  }

  try {
    const results = await Job.find({
      $or: [
        { company: { $regex: searchTerm, $options: 'i' } },
        { title: { $regex: searchTerm, $options: 'i' } }
      ]
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error performing search' });
  }
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
        const user_id = req.user._id
        const job = await Job.create({company, title, link, user_id})
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
    updateJob,
    getSearch
}