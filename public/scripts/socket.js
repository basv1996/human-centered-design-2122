var socket = io();

socket.on('usercnt', (msg) => {
  document.querySelector("#count").innerHTML=msg
})

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
let emotion = 'neutral'

const myName = prompt("what is your name?")
//appendMessage('You joined')
socket.emit('new-user', myName)


socket.on('chat-message', (data)=> {
  window.scrollTo(0, document.body.scrollHeight);
  appendMessage(`${data.myName}: ${data.msg}`)
});

socket.on("user-connected", (myName) => {
  appendMessage(`${myName} connected`)
  console.log(socket.id) 
});

form.addEventListener('submit', e => {
  e.preventDefault()
    const msg = input.value
    let emotionText = document.getElementById('emotion').textContent
    appendMessage(`You: ${msg}`)
    socket.emit('chat-message', msg)
    //socket.emit('chat-message', emotionText)
    input.value = ''
});



function appendMessage(msg) {
  const item = document.createElement('li');
  //let emotion = 'neutral'
  //let emotionText = document.getElementById('emotion').textContent
  item.textContent = msg
  
  if (item.textContent.includes('You:')) {
    item.classList.add("left")
  } else {
    item.classList.add("right")
  }
  //item.classList.add(emotionText)
  messages.appendChild(item)
}