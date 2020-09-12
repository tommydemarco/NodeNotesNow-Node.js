const express = require('express')
const User = require('../models/user')
const router = new express.Router() 

//user login
router.post('/users/login', async (req, res) => {
    try { 
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

//creating a new user
router.post('/users', async (req, res) => {
    //with the User model imported, creating an instance of user
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(401).send(e)
    }

    //OLD WAY OF DOING IT
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     //settinga a custom status code
    //     res.status(400)
    //     res.send(error)
    // })

    // res.send('Hallo')
})


//fetching all users 
router.get('/users', async (req, res) => {
    //this is a Mongoose method, for more read the mongoose documentation
    
    try {
        const users = await User.find({})
        res.send(users)
    } catch (p) {
        res.status(500).send()
    }
    
    //NO ASYNC METHOD
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})


//fetching a single user by id 
router.get('/users/:id', async (req, res) => {
    //getting the id from the parameters
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


//not tested, NEEDS TESTING with Postman!
//patching the single user 
router.patch('/users/:id', async (req, res) => {
    //logic to prevent the uppdate of non-existing properties
    const updates = Object.keys(req.body)
    const updateableProperties = ['name', 'surname', 'email']
    const isValidUpdate = updates.every((update) => {
        return updateableProperties.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({ error:"invalid updates" })
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) =>  user[update] = req.body[update])
        await user.save()


        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


//needs testing
//deleting a single user
router.delete('users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})






module.exports = router