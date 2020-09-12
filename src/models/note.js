const mongoose = require('mongoose')
//const validator = require('validator')


//defining the notes schema
const noteSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //referencing to the user model for the note-user linking 
        ref : 'User'
    }
},
//enabling time stamps
{
    timestamps: true
})

//defining the User model === OK
const Note = mongoose.model('Note', noteSchema)

module.exports = Note