const process = require("process")
const express = require("express")
const router = express.Router()
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config()




//Home Page route
router.get("/", function (req, res) {
    res.render('pages/index', {
    })
})

 
//route for 404 page
// router.get("*", function (req, res) {
//     res.render("pages/404", {
//       title: "404 Page",
//     });
//   });


//   Sockkets
io.on('connection', (socket) => {
    console.log('a user connected');
  });



module.exports = router;