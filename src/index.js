//importing path for the routes and serving assets
const path = require('path')

//importing and initialising express and the view manager hbs
const express = require('express')

//making sure that the mongoose file starts, importing models 
require ('./db/mongoose')
const User = require('./models/user')
const Note = require('./models/note')

//requiring the routers
const userRouter = require('./routers/user')
const noteRouter = require('./routers/note')

//setting the variable app to express
const app = express()

//defining the port
const port = process.env.PORT || 3000
const hbs = require('hbs')

//setting up the variable for the view templates folder
const viewsPath    = path.join(__dirname, '../views/')
const partialsPath = path.join(__dirname, '../views/partials')


//setting the engine to hbs and setting the partials views path
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//enabling express to take in json formatted stuff
//serving up the assets and static 
app.use(express.json())
//using the routers 
app.use(userRouter)
app.use(noteRouter)
//serving up the assets and static 
app.use(express.static(path.join(__dirname, '../assets')))



/*
SETTING UP THE VIEWS
*/

//setting up the index 
app.get('', (req, res) => {
    res.render('index')
})

//setting up the about page
app.get('/features', (req, res) => {
    res.render('features', {
        message:"Hallo"
    })
})

//setting up the team page
app.get('/team', (req, res) => {
    res.render('team', {
        message:"Hallo"
    })
})

//setting up the single get requests 
app.get('/weather', (req, res) => {
    res.send({
        name:"Tommy",
        and:"Simona"
    })
})

//team-specific 404
app.get('/team/*', (req, res) => {
    res.render('404', {
        message:"Team member not found",
        descriptionMessage: "Oooops, we couldn't fincd that team member"
    })
})

//generic 404
app.get('*', (req, res) => {
    res.render('404', {
        message:"Page not found",
        descriptionMessage: "Oooops, we couldn't find what you are looking for..."
    })
})

//starting up the server with the listen method
app.listen(port, () => {
    console.log('it worked')
})


