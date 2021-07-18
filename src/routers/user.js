const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
const router = express.Router()


router.post('/', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
        sendWelcomeEmail(user.email, user.name)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    const body = req.body

    const allowedFields = ["email", "password"]
    const receivedFields = Object.keys(body)
    const isValidUpdate = receivedFields.every(val => allowedFields.includes(val))

    if(!isValidUpdate || receivedFields.length !== 2) {
        return res.status(400).send('Invalid input')
    }
    
    try {
        const user = await User.findByCredentials(body.email, body.password) //custom model method - or the schema static method

        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch(e) {
        res.status(400).send(e.message || e)
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message || err})
})

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users) //here you dont need to explicitly give 200 status coz that is the default anyway
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch(e) {
        res.status(401).send(e)
    }
})

router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id
    // const _id = new mongoose.Types.ObjectId(req.params.id); //you can do like this also
    // console.log(ObjectID.isValid(_id))

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send('ID is not valid')
        }

        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send('No user found.')
        }
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/me', auth, async (req, res) => {
    const _id = req.params.id
    const body = req.body

    const allowedFields = ["age", "name", "email", "password"]
    const receivedFields = Object.keys(req.body)
    const isValidUpdate = receivedFields.every(val => allowedFields.includes(val))

    if(!isValidUpdate) {
        return res.status(400).send('Invalid update')
    }

    try {
        receivedFields.forEach(field => req.user[field] = body[field])
        await req.user.save()

        res.status(200).send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/:id', auth, async (req, res) => {
    const _id = req.params.id
    const body = req.body

    const allowedFields = ["age", "name", "email", "password"]
    const receivedFields = Object.keys(req.body)
    const isValidUpdate = receivedFields.every(val => allowedFields.includes(val))

    if(!isValidUpdate) {
        return res.status(400).send('Invalid update')
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send('ID is not valid')
        }
        const user = await User.findById(_id)
        receivedFields.forEach(field => user[field] = body[field])
        await user.save()

        // const user = await User.findByIdAndUpdate(_id, body, {new: true, runValidators: true})

        if(!user) {
            return res.status(404).send('No user found to update')
        }

        res.status(200).send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        sendCancellationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send('Your profile has been deleted successfully')
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete(_id)

        if(!user) {
            return res.status(404).send('No user found to delete')
        }

        res.status(200).send(`User of ID ${_id} has been deleted.`)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send('User logged out successully')
    } catch (e) {
        res.status(500).send('Error logging out')
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('User logged out successully')
    } catch (e) {
        res.status(500).send('Error logging users out')
    }
})

const upload = multer({
    limits: {
        fileSize: 1.049e+6
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')) { //here we are using endswith method to check if a single file those charactes at the end
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //here match uses regex to chec extentions of multiple files which we are allowing
            cb(new Error('Please upload a JPG/JPEG/PNG file'))
        }

        cb(undefined, true)
    }
})
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({width: 750, height: 700}).png().toBuffer()
        req.user.avatar = buffer
        // req.user.avatar = req.file.buffer //Here we are directl assigning the file we upload to the user as buffer data
        await req.user.save()
        res.send('File uploaded successfully')
    } catch (e) {
        res.status(500).send('Error uploading file')
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message || err})
})

router.delete('/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send('Avatar deleted successsfully')
    } catch (e) {
        res.status(500).send('Error deleting avatar')
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message || err})
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send('Error fetching avatar')
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message || err})
})

module.exports = router