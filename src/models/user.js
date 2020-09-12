const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
    }
})

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