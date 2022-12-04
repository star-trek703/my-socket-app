const socket = io('http://localhost:3001')
const infoContainer = document.getElementById('info-container')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const user = { id: null, name: '' }

const name = prompt('What is your name?')

if (name) {
  user.name = name
  socket.emit('create-user', user.name)
}

socket.on('user-created', data => {
  user.id = data.id
})

socket.on('chat-message', data => {
  appendMessage(data)
})

socket.on('type', name => {
  infoContainer.innerHTML = `${ name } is typing...`
  setTimeout(function() {
    infoContainer.innerHTML = ""
  }, 500)
})

messageInput.addEventListener('keypress', (e) => {
  if (e.keyCode >= 0 && e.keyCode <= 29) { return }
  socket.emit('typing', user.name)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const messageContent = messageInput.value
  if (!messageContent) { return }

  const message = { id: user.id, name: user.name, type: 'text', content: messageContent }
  socket.emit('send-chat-message', message)
  appendMessage({ id: user.id, name: user.name, type: 'text', content: messageContent })
  messageInput.value = ""
})

function appendMessage({ id, name, type, content }) {
  const messageElement = document.createElement('div')

  if (id == user.id) { name = "You" }

  messageElement.innerHTML = `<div class="message ${ id == user.id ? 'me' : '' }">
    <div class="message-sender-name">${ name }</div>
    <div class="message-content">${ content }</div>
  </div>`
  messageContainer.append(messageElement)
  messageContainer.scrollTop = messageContainer.scrollHeight
}
