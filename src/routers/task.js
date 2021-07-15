const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')


router.post('/', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        const store = task.toObject() //create a deep copy clone of the object using toObject() without reference to the orginal object
        delete store.owner //no need to show the user their own name or id that they craeted the task, its already implicit
        res.status(201).send(store)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/', auth, async (req, res) => {
    
    const match = {},
        sort = {},
        isCompleted = req.query.completed,
        skip = (parseInt(req.query.skip) - 1) * parseInt(req.query.limit),
        allowedFields = ["description", "completed", "createdAt", "updatedAt", "_id"]
    if(isCompleted && (isCompleted.toLocaleLowerCase() === 'true' || isCompleted.toLocaleLowerCase() === 'false')) {
        match.completed = isCompleted.toLocaleLowerCase() === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        if(allowedFields.includes(parts[0]))
            sort[parts[0]] = parts[1] === 'desc' ? -1 : parts[1] === 'asc' || parts[1] === undefined ? 1 : 0
    }

    try {
        // const tasks = await Task.find({owner: req.user._id}) //an Alternaive way
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: skip > -1 ? skip : undefined,
                sort
            }
        }).execPopulate() //Here we are ablr to populate all the tasks related to the user using the schema virual relationships we created. There is no such tasks list related in database, but mongoose here links the relationship and fetches the required data. 
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(error)
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message || err})
})

router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send('ID is not valid')
        }

        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('No task found.')
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/:id', auth, async (req, res) => {
    const _id = req.params.id
    const body = req.body

    const allowedFields = ["completed", "description"]
    const receivedFields = Object.keys(req.body)
    const isValidUpdate = receivedFields.every(val => {
        return allowedFields.includes(val)
    })

    if(!isValidUpdate) {
        return res.status(400).send('Invalid update')
    }
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send('No task found to update')
        }
        receivedFields.forEach(field => task[field] = body[field])
        await task.save()
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send('No task found to delete')
        }

        res.status(200).send(`Task of ID ${_id} has been deleted.`)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router