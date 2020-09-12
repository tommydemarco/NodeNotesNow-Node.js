const express = require('express')
const Note = require('../models/note')
const router = new express.Router() 


//creating a new note
router.post('/notes', async (req, res) => {
    //with the User model imported, creating an instance of user
    const note = new Note(req.body)

    try {
        await note.save()
        res.status(201).send(note)
    } catch (e) {
        res.status(401).send(e)
    }

})


//GET REQUESTS


//fetching all notes 
router.get('/notes', async (req, res) => {
    //this is a Mongoose method, for more read the mongoose documentation
    try {
        const notes = await Note.find({})
        res.send(notes)
    } catch (p) {
        res.status(500).send()
    }
})

//fetching a single note by id 
router.get('/notes/:id', async (req, res) => {
    //getting the id from the parameters
    const _id = req.params.id

    try {
        const note = await Note.findById(_id)
        if (!note) {
            res.status(404).send()
        }
        res.send(note)
    } catch (e) {
        res.status(500).send()
    }

})


//not tested, NEEDS TESTING with Postman!
//patching the single note
router.patch('/notes/:id', async (req, res) => {
    //logic to prevent the uppdate of non-existing properties
    const updates = Object.keys(req.body)
    const updateableProperties = ['description', 'completed']
    const isValidUpdate = updates.every((update) => {
        return updateableProperties.includes(update)
    })

    if (!isValidUpdate) {
        return res.status(400).send({ error:"invalid updates" })
    }

    try {
        const note = await Note.findById(req.params.id)
        updates.forEach((update) =>  note[update] = req.body[update])
        await note.save()

        if (!note) {
            res.status(404).send()
        }
        res.send(note)
    } catch (e) {
        res.status(400).send(e)
    }
})


//needs testing
//deleting a single note
router.delete('notes/:id', async (req, res) => {

    try {
        const note = await Note.findByIdAndDelete(req.params.id)

        if(!note){
            res.status(404).send()
        }
        res.send(note)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router