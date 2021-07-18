const mongoose = require('mongoose');
const validator =  require('validator')
const bcrypt =  require('bcryptjs')
const jwt =  require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Passwor cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    // console.log('con', user)

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {expiresIn: '1 hour'}) //jswt.sign is used to create a jwt token, 1st argument must be a unique identifier like IDs, etc, 2nd arg must be password type string used to encrypt/sign the tokens, and optional 3rd argument is the expiry time for the token
    // console.log('token', token)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Invalid credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Invalid credentials')
    }

    return user
}

//these a mongoose middlewares where we do some operation before the http request could complete - here before it could save
userSchema.pre('save', async function(next) {
    const user = this
    // console.log('token3', user)
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8) 
        //Above for passowrd encryption/ hashing we are using bcryptjs instead of nodejs inbuilt cypher coz bcrptjs allows us to hash the password using an algorithm which is irreversible. You cannot reverse the hashed password back to plain text anymore, its a one way route contrary to cipher pr other encryption where after encryption you can also decrypt the encrypted text bac to the original text. So here you have tp again provide the password whcih will again be hashed and compared with your hashed password stpred in your database. we can compare using the following - bcrypt.compare('password123', hashedPassword).
    }
    next()
})

//this will delete all the tasks associated with the user
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

//here in first argument mongoose takes the string and pluralises it and makes the first letter uppercase. 
const User = mongoose.model('User', userSchema); 
//above you can also pass 3rd argument with the string name which you want your collection to be like 'mongoose.model('category', CategorySchema,'category');'

module.exports = User