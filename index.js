const express = require('express')
const productsRouter = require("./routes/products")
const mongoose = require("mongoose")
require('dotenv').config()
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const authRouter = require("./routes/auth")
const verifyToken = require("./middleware/verifyToken")

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.3folipm.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`, e => {
    if (e) {
        console.log(e)
    } else {
        console.log('Connected to database')
    }
})

app.use("/auth", authRouter)

app.use("/products", verifyToken, productsRouter);

app.get("/", (req, res) => {

    res.send('index page')
})

app.listen(5000, () => {
    console.log('server is running on port 5000')
})