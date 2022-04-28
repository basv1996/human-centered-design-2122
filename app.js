//const http = require('http');
const express = require("express")
const process = require("process")
const app = express()
//const path = require('path')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
require("dotenv").config();

//this will sorve static files from public folder
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const router = require("./routes/route.js");
const PORT = process.env.PORT || 5050

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// // //using static files
app.use(express.static(__dirname + "/public"));
//app.use(express.static(__dirname + '/scripts'));


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//using the router when you are on the index
app.use("/", router);


//Error handling
//this can return any content, but must be valled after all other app.use()
// app.use(function (err, req, res) {
//     console.error(err.stack);
//     res.status(500).send("Something broke!");
//   });

//   app.use(function (err, req, res) {
//     res.status(404).render('pages/404', {
//         title: 'this page does not exist'
//     });
//   });

let userCount=0
let users = {}
let typers = {}

io.on('connection', (socket) => {
  userCount++
  io.emit('usercnt', userCount)

  socket.on('new-user', myName => {
    users[socket.id] = myName
    socket.broadcast.emit('user-connected', myName)
  })

  socket.on('disconnect', () => {
    userCount--
    io.emit('usercnt', userCount)
    delete users[socket.id]
  });

  socket.on('chat-message', (msg) => {
    socket.broadcast.emit('chat-message', { 
      msg: msg, 
      myName: users[socket.id],
      //emotionText: emotionText
     })
  });

  socket.on('typing', myName =>{
    users[socket.id] = myName
    typers[socket.id] = 1;
    console.log("naampje: ", myName)
    console.log("typersd socket id: ",  typers[socket.id] = 1)
    console.log("object key length: ",  Object.keys(typers).length)
    socket.broadcast.emit('typing', 
    {
      name: myName,
      typers: Object.keys(typers).length
    });

    socket.on("stop-typing", ()=>{
      delete typers[socket.id]
      socket.broadcast.emit("stop-typing")
    })
  })
});