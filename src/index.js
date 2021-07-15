const express = require('express')
require('./db/mongoose')
const userRoutes = require('./routers/user')
const taskRoutes = require('./routers/task')
// const {ObjectID}  = require('mongodb')

const port = process.env.PORT

const app = express()

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})