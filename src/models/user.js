const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//including the Task model to be able to delete all Tasks when a user is deleted
const Note = require('./note')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true 
    },
    surname: {
        type: String,
        trim: true 
    },
    email: { 
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
           if (!validator.isEmail(value)) {
               throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(validator.isAlphanumeric(value) || (value.length < 6)) {
                throw new Error('Password must contain at least a special character and must contain more than 6 characters')
            }
        }
    },
    //storing authentication tokens 
    tokens: [{
        token: {
            type: String,
            reuqired: true
        }
    }],
    //user profile picture
    avatar: {
        type: Buffer
    }
},
//enabling timestamps
{
    timestamps: true
})


//adding a virtual relation with the notes === OK
userSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'owner'
})


//getting the public profile for the user  === OK
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


//creating a method for the jsonwebtoken ==== OK
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'nodewebapplication')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


//reusable function for the login ==== OK
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//MIDDLEWARES 

//applying methods pre saving to hash the password === OK
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//delete all the tasks associated with a user when the user is deleted 
userSchema.pre('remove', async function(next){
    const user = this 
    await Note.deleteMany({ owner: user._id })
    next()
})

//defining the User model === OK
const User = mongoose.model('User', userSchema)

module.exports = User