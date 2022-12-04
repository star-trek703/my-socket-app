const express = require('express')
const dotev = require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 5000
const io = require('socket.io')(3001, {
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  socket.on('create-user', name => {
    socket.emit('user-created', { id: socket.id })
  })

  socket.on('typing', name => {
    socket.broadcast.emit('type', name)
  })

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', message)
  })
})

app.listen(PORT, () => console.log(`Server running on port ${ PORT }`))