const mongoose = require('mongoose');
const jwt =  require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const _id = new mongoose.Types.ObjectId()
testUser = {
    _id,
    "name": "Mike Hannagan",
    "email": "mike.h.njsdh89201@adbahbh.com",
    "password": "dbvsf78f7hhd##",
    tokens: [{
        token: jwt.sign({ _id }, process.env.JWT_KEY)
    }]
}

const _id2 = new mongoose.Types.ObjectId()
testUser2 = {
    _id: _id2,
    "name": "Clark Hannagan",
    "email": "clark.h.njsdh89201@adbahbh.com",
    "password": "dfhjadg877gv##",
    tokens: [{
        token: jwt.sign({ _id: _id2 }, process.env.JWT_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: _id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: _id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: _id2
}

setUpTestDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser).save()
    await new User(testUser2).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    _id,
    _id2,
    testUser,
    testUser2,
    taskOne,
    taskTwo,
    taskThree,
    setUpTestDatabase
}