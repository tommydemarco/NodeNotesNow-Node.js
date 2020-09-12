const mongoose = require('mongoose')
const validator = require('validator')

//defining the tasks model 
const Note = mongoose.model('Note', {
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    date_due: {
        type: Date,
        default: new Date()
    }
})

module.exports = Note