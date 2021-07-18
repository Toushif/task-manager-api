const express = require('express')
require('./db/mongoose')
const userRoutes = require('./routers/user')
const taskRoutes = require('./routers/task')

const app = express()

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

module.exports = app