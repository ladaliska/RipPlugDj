import express from 'express';
import http from "http";
import { WebSocketServer } from "ws";
import { Server } from "socket.io";
import * as url from 'url';
import ytdl from "ytdl-core"
import fs from "fs"
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
  port:8080
});
app.get('/test', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.sendFile(__dirname + '/test.html');
  app.use(express.static(__dirname+"/public"))
});
app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.set("Same-Site", "None")
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname+"/public"))
});

var count = 0;
var sec = 0;
var isRunning = 0;
var actual
var code, title, len, feed
var obj = []


function second(){
  console.log(obj)
  if(count < obj.length){
    isRunning = 1
  sendSong()
  timer()
}
else {
  io.emit("empty")
}
}

function timer(){
    var call = setInterval(()=>{
      sec++
      if(sec == obj[count]["length"]){
        console.log("song ended")
        clearInterval(call)
        sec=0
        isRunning = 0
        count += 1
        scrap()
      }
    }, 1000)
}

function scrap(){
  io.emit("clear")
  second()
}

function sendSong(){
  actual = {code:obj[count]["code"], sec:sec}
  console.log(actual)
  io.emit("song", actual)
}

function insert(url){
  var data = ytdl.getBasicInfo(url)
  data.then(function (result){
    code = result['videoDetails']['videoId']
    len = result['videoDetails']['lengthSeconds']
    title = result['videoDetails']['title']
  }).then(function() {
      feed = {title:title, code:code, length: len, order:obj.length}
      obj.push(feed)
      if (isRunning != 1){
      second()}
      })
      }

//io.on('song', (socket) => {
//  console.log("socket asked")
//  socket.emit("song", {code: "gp4z85YAqh8", sec: 0})
//});


io.on("connection", (socket)=>{
  socket.onAny((event, arg) => {
    if (event == "connection"){
      console.log("Connected")
    }
    else if (event == "ready"){
      console.log("hes readyyyyyy")
      second()
    }
    else if(event == "insert"){
      console.log(arg)
      insert(arg)
    }
  })  
})


server.listen(3000, () => {
  console.log('listening on *:3000');
});

