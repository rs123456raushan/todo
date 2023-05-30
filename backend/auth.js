const express = require('express');
const User = require('./userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');

const JWT_SECRET = "Roshanis@goodboy";

// Create the user in employee table

router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a password of minimum length of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "Sorry this user already exist" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                email: req.body.email,
                password: securePassword
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken, user: user });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// login the user

router.get('/login', [
    query('email', 'Enter a valid email').isEmail(),
    query('password', 'Enter a password of minimum length of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.query.email });

        if (!user) {
            res.status(400).json({ error: "Please try to login with correct credentials" });
        } else {
            let passwordCompare = await bcrypt.compare(req.query.password, user.password);
            if (!passwordCompare) {
                res.status(400).json({ error: "Please try to login with correct credentials" });
            } else {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                success = true;
                res.json({ success, authToken, user: user });
            }
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Read the data of employee table

router.get('/getuser', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.find({});
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Update the data in employee table

router.put('/updateuser/:id', async (req, res) => {
    const { name, age, email, salary, country, state, city, phoneNumber, password } = req.body;
    try {
        let newUser = {};
        if (email) { newUser.email = email };
        if (password && password.length > 4) {
            newUser.phoneNumber = phoneNumber
        };

        let getUsers = await User.findById(req.params.id);
        if (!getUsers) {
            return res.status(404).send("User not found");
        }
        getUsers = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true });
        // let user = await User.find().sort({ "salary": 1, "age": 1 });
        res.json({ getUsers });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Delete the data from employee table

router.delete('/deleteuser/:id', async (req, res) => {
    try {
        let getUsers = await User.findById(req.params.id);
        if (!getUsers) {
            return res.status(404).send("User not found");
        }
        getUsers = await User.findByIdAndDelete(req.params.id);
        // let user = await User.find().sort({ "salary": 1, "age": 1 });
        res.json({ "Success": "User has been deleted", user: getUsers });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;