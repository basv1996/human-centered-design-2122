const socket = io();
const video = document.getElementById('video')
const mainEl = document.getElementById('main')
const emotionSpan = document.getElementById('emotion')
const messageBlockUL = document.querySelector('#messages')
const messageBlock = document.querySelector('#messages > li:last-child')
const captureBtn = document.querySelector("#captureEmotion")
const playBtn = document.querySelector("#playEmotion")

const happyEmotionLi = document.querySelector("li.happy")
const neutralEmotionLi = document.querySelector("li.neutral")
const surpisedEmotionLi = document.querySelector("li.surprised")
const disgustedEmotionLi = document.querySelector("li.disgusted")
const fearfulEmotionLi = document.querySelector("li.fearful")
const sadEmotionLi = document.querySelector("li.sad")
const angryEmotionLi = document.querySelector("li.angry")

const AllNavListItems = document.querySelectorAll("nav ul li")

const achievementsSection = document.querySelector(".achievmentsSection")
const closeAchievementsBtn = document.querySelector(".closeAchievements")
const showAchievementsButton = document.querySelector(".achievmentsBtn")


const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const feedbackTxt = document.querySelector(".feedback")

let emotion = 'neutral'

const myName = prompt("what is your name?")

Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ]).then(startVideo)


AllNavListItems.forEach(li => {
  li.addEventListener("click", (e) => {
    let cl = e.target.classList
    removeDots()
    emotion = cl[0]
    li.style.borderStyle = "dotted"
    emotionSpan.innerHTML = cl
    li.classList.add("spinMe")
  })
})

function removeDots(){
  for (let i = 0; i < AllNavListItems.length; i++) {
    AllNavListItems[i].style.borderStyle = 'solid'
    AllNavListItems[i].classList.remove("spinMe")
   
  }
}

function resetEmotions(){
  console.log("hello")
  removeDots()
  emotion = 'neutral'
  emotionSpan.innerHTML = 'neutral'
}


function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
          })
          .catch(function (err0r) {
            console.log("Something went wrong!");
          });
      }
}

function captureMyEmotion() {
  //console.log("pauzerene")
  video.pause()
}

function playVid(){
  //console.log("play viddeeoooo")
  video.play()
}

captureBtn.addEventListener("click", captureMyEmotion)
playBtn.addEventListener("click", playVid)

//startVideo()
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    main.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

// my psuedo
//if video is paused then do not exxecute this function yo

    const intervalletje = setInterval(
      async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // creer een neiuwe canvas elke keer
      faceapi.draw.drawDetections(canvas, resizedDetections) //teken op het canvas het blauwe vierkant en detecteer een gezicht
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) //de landmarks zijn de lijntjes op het gezicht
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //laat de emotie zien van het gezicht
      const expressions = detections[0]['expressions']
        let max = 0;
        let maxKey = "";

        for(let express in expressions){
        if(expressions[express]> max){
            max = expressions[express];
            maxKey= express
            emotion = maxKey
            }
        }
        emotionSpan.innerHTML=emotion

    }, 1000)
    video.addEventListener("pause", ()=> {
      clearInterval(intervalletje)
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    })
  })

 


/////////////////   Sockets  //////////////////

  socket.on('usercnt', (msg) => {
    document.querySelector("#count").innerHTML=msg
  })

appendMessage('You joined')
socket.emit('new-user', myName)


socket.on('chat-message', (data)=> {
  window.scrollTo(0, document.body.scrollHeight);
  spannetje = document.createElement("span")
  appendMessage(`${data.myName}: ${data.msg}`, data.emotion)
  clearInterval(intervalletje)

});

socket.on("user-connected", (myName) => {
  appendMessage(`${myName} connected`)
  console.log(socket.id) 
});

socket.on("typing", ({name, typers}) => {
  feedbackTxt.textContent = typers > 1 ? 'Several people are typing' : `${name} is typing`;
})

socket.on("stop-typing", typers => {
  if (!typers) {
  feedbackTxt.textContent = ""
  }
})

input.addEventListener("keydown", (e) =>{
  socket.emit("typing", myName)
  if (e.key === 'Enter') {  socket.emit("stop-typing") }
})

form.addEventListener('submit', e => {
  e.preventDefault()
    const msg = input.value
    socket.emit('chat-message', {msg, emotion})
    input.value = ''
    appendMessage(`You: ${msg}`, emotion)
});


function appendMessage(msg, emotion) {
  console.log(emotion);
  const item = document.createElement('li');
  item.textContent = msg
  
  if (item.textContent.includes('You:')) {
    item.classList.add("left")
  } else {
    item.classList.add("right")
  }
  removeDots()
  item.classList.add(emotion ? emotion : 'neutral')

  messages.appendChild(item)
  resetEmotions()
  countEmotions()
}

/////////////////////////////////////////////////

function countEmotions() {
const happyAmountSpan = document.querySelector(".happyAmountSpan")
const neutralAmountSpan = document.querySelector(".neutralAmountSpan")
const suprisedAmountSpan = document.querySelector(".surprisedAmountSpan")
const disgustedAmountSpan = document.querySelector(".disgustedAmountSpan")
const fearfulAmountSpan = document.querySelector(".fearfulAmountSpan")
const sadAmountSpan = document.querySelector(".sadAmountSpan")
const angryAmountSpan = document.querySelector(".angryAmountSpan")

let amountHappy = document.querySelectorAll('#messages li.happy').length;
let amountNeutral = document.querySelectorAll('#messages li.neutral').length;
let amountSurprised = document.querySelectorAll('#messages li.surprised').length;
let amountDisgusted = document.querySelectorAll('#messages li.disgusted').length;
let amountFearful = document.querySelectorAll('#messages li.fearful').length;
let amountSad = document.querySelectorAll('#messages li.sad').length;
let amountAngry = document.querySelectorAll('#messages li.angry').length;

happyAmountSpan.innerHTML = amountHappy
neutralAmountSpan.innerHTML = amountNeutral
suprisedAmountSpan.innerHTML = amountSurprised
disgustedAmountSpan.innerHTML = amountDisgusted
fearfulAmountSpan.innerHTML = amountFearful
sadAmountSpan.innerHTML = amountSad
angryAmountSpan.innerHTML = amountAngry
}

closeAchievementsBtn.addEventListener("click", ()=> {
  achievementsSection.classList.remove("show")
  achievementsSection.classList.add("hide")
})

showAchievementsButton.addEventListener("click", () => {
  achievementsSection.classList.remove("hide")
  achievementsSection.classList.add("show")


})