const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')


const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')


// imports the models
const { Event } = require('./models/event')
const { User } = require('./models/user')

// connects to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://user:kaisa@cluster0.p2xu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{ useNewUrlParser: true, useUnifiedTopology: true })

// uses bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json())

// enables CORS for all requests
app.use(cors())

// adding morgan to log HTTP requests
app.use(morgan('combined'))

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// add new user
app.post('/user', async (req, res) => {
  tokens = uuidv4()
  if(!req.body.userName || !req.body.password) {
    return res.sendStatus(400).send()
  }
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    token: tokens
  })
  user.save()
  res.send({result:true}) 
})

// authorisation
app.post('/auth', async (req, res) => {
  const user = await User.findOne({userName: req.body.userName})
  if (!user) {
    console.log('no user')
    return res.sendStatus(401)
  };
  if (req.body.password !== user.password) {
    return res.sendStatus(403)
  }
  user.token = uuidv4()
  await user.save()
  res.send({token: user.token})
})

app.use(async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const user = await User.findOne({token:authHeader})
  if (user) {
    next()
  } else{
    res.sendStatus(403)
  }
})

// defining CRUD operations
// get all events
app.get('/events', async (req, res) => {
  res.send(await Event.find())
})

// get event by location
app.get('/:location', async (req, res) => {
  res.send(await Event.find({location: req.params.location}))
})

// get event by name
app.get('/name/:name', async (req, res) => {
  res.send(await Event.find({name: req.params.name}))
})

// post an event
app.post('/event', async (req, res) => {
  const newEvent = req.body
  const event = new Event(newEvent)
  await event.save()
  res.send({ message: 'New event inserted.' })
})

// delete an event
app.delete('/:id', async (req, res) => {
  await Event.deleteOne({ _id: ObjectId(req.params.id) })
  res.send({ message: 'Event removed.' })
})


// update event
app.put('/:id', async (req, res) => {
  await Event.findOneAndUpdate({ _id: ObjectId(req.params.id)}, req.body )
  res.send({ message: 'Event updated.' })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening on ${port}`)
