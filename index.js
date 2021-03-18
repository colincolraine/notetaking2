const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
var path = require('path')

const PORT = process.env.PORT || 4000

const noteRoutes = require('./notes/routes')
const userRoutes = require('./users/routes')

const { username, password } = process.env

console.log(username)
console.log(username)

mongoose.connect(`mongodb+srv://${username}:${password}@notetaking2.7q2bv.mongodb.net/notetaking2?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname)))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'createaccount.html'))
})

app.use('/notes', noteRoutes)
app.use('/users', userRoutes)

app.listen(PORT, ()=>{
    console.log(`The app is running on http://localhost:${PORT}`)
})