const mongoose = require('mongoose'); //Mongoose is a framework of mongodb just like express is a framewor of nodejs
// const validator =  require('validator')

const connectionUrl = process.env.MONGODB_URL //here the connection url is same as mongodb url, only difference is here we also provide the database  name in the url to connect to. Check dev.env file for its value

mongoose.connect(connectionUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/* const me = new User({
    name: 'Toushif',
    email: 'toushif.haq@gmail.com',
    password: 'Khabib77',
    age: 28
})

me.save().then(data => {
    console.log(data)
}).catch(error => {
    console.log(error)
}) */

/* const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task = new Task({
    description: 'Learn the mongoose library',
    completed: false
})

task.save().then(data => {
    console.log(data)
}).catch(error => {
    console.log(error)
}) */