const express = require('express');
const Note = require('./noteSchema');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // const newNotes = await Note.findById(req.body.id);
        const newNotes = await Note.find({ userEmail: req.query.email }).sort({ "title": 1 });
        res.json(newNotes);
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/addnote', [
    body('title', 'Enter title of minimum 1 characters').isLength({ min: 1 }),
    body('description', 'Enter description of minimum 1 characters').isLength({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { userEmail, title, description } = req.body;
    let active = false;
    try {
        const newNotes = new Note({
            userEmail, title, description, active
        });
        const savedNotes = await newNotes.save();
        res.json(savedNotes);
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/updatenote/:id', async (req, res) => {
    const { title, description, active } = req.body;
    try {
        const newNotes = {};
        if (title != '') {
            newNotes.title = title
        };
        if (description != '') {
            newNotes.description = description
        };
        newNotes.active = !active;
        let getNotes = await Note.findById(req.params.id);
        if (!getNotes) {
            return res.status(404).send("Note not found");
        }
        getNotes = await Note.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true });
        res.json({ getNotes });
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/deletenote/:id', async (req, res) => {
    try {
        let getNotes = await Note.findById(req.params.id);
        if (!getNotes) {
            return res.status(404).send("Note not found");
        }
        getNotes = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Notes has been deleted" });
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
