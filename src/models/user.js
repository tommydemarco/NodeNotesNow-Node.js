const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
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
    }]

})

//getting the public profile for the user 
userSchema.methods.toJSON = function(){
    const user = this 

    //getting the user to an object to delete some properties later on 
    const userObject = user.toObject()

    //deleting properties from the user object that you don't want to be shown in the result
    delete userObject.password
    delete userObject.tokens

    return userObject

}


//creating a method for the jsonwebtoken
userSchema.methods.generateAuthToken = async function() {
    const user = this
    //generate the actual token (second parameter is the secret)
    const token = await jwt.sign({ _id: user._id.toString() }, 'nodewebapplication')

    //saving the token to the user instance 
    user.tokens = user.tokens.concat({ token: token })
    //saving the user with the token 
    await user.save()

    return token
}

//reusable function for the login 
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


//applying methods pre saving to hash the password
userSchema.pre('save', async function(next) {
    const user = this
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

//defining the User model 
const User = mongoose.model('User', userSchema)



module.exports = User