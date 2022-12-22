const express = require("express")
const User = require('../models/User')
const router = express.Router()
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
})
const loginSchema = Joi.object({
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(255),
})

router.post('/register', (req, res) => {

    const { error } = registerSchema.validate(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    console.log('test')
    const user = new User({ name: req.body.name, email: req.body.email, password: hash })
    user
        .save()
        .then((user) => { res.json(user) })
        .catch((err) => {})
})
router.post('/login', (req, res) => {
    const { email, password } = req.body

    const { error } = loginSchema.validate({ email, password })
    if (error) {
        res.status(404).send(error.details[0].message)
        return
    }


    User.findOne({ email: email }).then(user => {
        if (!user) {
            res.status(400).end("invalid email or password")
            return
        }
        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            res.status(400).end("invalid email or password")
            return
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_CODE)

        res.header("Authorization", token).json({ accessToken: token })
    }).catch(() => {
        res.status(400).end("invalid email or password")
    })
})


module.exports = router