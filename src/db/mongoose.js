const mongoose = require('mongoose')

//connecting mongoose to the database
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify: false
})

